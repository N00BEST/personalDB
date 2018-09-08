$(document).ready(()=>{
	$('.modal').modal({
		onCloseEnd: limpiarModal,
		onOpenStart: desplegarTitulo
	});
	$('#confirmarEstado').click(agregarEstado);
	$('#nuevoEstado').keyup(validarEstado);
	cargarTabla();
});

var EDITANDO = 0;
var __NOMBRE = false;
var __FILA = undefined;
var __ESTADO = undefined;

function desplegarTitulo() {
	//Desplegar el título del modal según lo que se vaya a realizar
	if(EDITANDO){
		//Si se va a editar una fila
		$('#tituloModal').text('Modificar un estado existente');
	} else {
		//Si se va a crear una fila nueva
		$('#tituloModal').text('Crear un estado nuevo');
	}
}

function validarEstado(evt){
	let nombre = $('#nuevoEstado').val().trim();
	let error = $('#mensajeError');
	if(nombre.length > 0) {
		$.get('/api/estado?nombre=' + nombre).then((estado)=>{
			error.text('Ya existe un estado registrado con ese nombre.');
			if(EDITANDO === 1) {
				EDITANDO++;
				error.text('');
			}
			__NOMBRE = false;
			actualizarBoton();
		}).catch((err)=>{
			error.text('');
			__NOMBRE = true;
			actualizarBoton();
		});
	} else {
		error.text('');
		__NOMBRE = false;
		actualizarBoton();
	}
	if(typeof evt !== 'undefined' && evt.keyCode === 13) {
		agregarEstado();
	}
}

function actualizarBoton() {
	let boton = $('#confirmarEstado');
	if(__NOMBRE){
		boton.removeClass('disabled');
	} else {
		boton.addClass('disabled');
	}
}

function agregarEstado(){
	//Desplegar la barra de progreso
	barraProgreso(true);
	//Iniciar validación de los campos inscritos
	validarEstado();
	//Si el nombre es válido
	if(__NOMBRE){
		//Extraer datos generales a usar
		let nombre = $('#nuevoEstado').val().trim();
		let tabla = $('#tablaEstados');
		let modal = M.Modal.getInstance($('#agregarEstado'));
		let error = $('#mensajeError');
		if(EDITANDO){
			//Si se está editando una fila existente
			//Enviar solicitud tipo PUT al servidor
			$.ajax({
				url: '/api/estado',
				type: 'PUT', 
				data: {
					ID: __FILA.attr('id'),
					nombre: __ESTADO,
					nuevo: nombre
				}, 
				success: (estado)=>{
					//Al recibir respuesta, extraer datos de interés.
					let division = estado.creacion.indexOf('T');
					let fecha = parseDate(estado.creacion.substr(0, division));
					let fila = __FILA;

					//Actualizar la fila
					fila.attr('id', estado.ID);
					fila.children('#1').text(estado.nombre);
					fila.children('#2').text(estado.personal);
					fila.children('#3').text(fecha);

					//Añadir animación de confirmación de la modificación
					$(fila).addClass('fondo-exito');
					calcularLateral();
					setTimeout(()=>{
						$(fila).addClass('animar slow');
						$(fila).removeClass('fondo-exito');
					}, 600);

					//Desactivar la barra de progreso
					barraProgreso(false);
					//Cerrar el modal
					modal.close();
					
				},
				statusCode: {
					//Si ocurrió algún error
					400: ()=>{
						barraProgreso(false);
						error.text('Hay un error en el nombre del estado.');
						__NOMBRE = false;
						actualizarBoton();
					},

					500: ()=>{
						barraProgreso(false);
						error.text('Ocurrió un error y no se pudo registrar el estado.');
					},

					404: ()=>{
						barraProgreso(false);
						error.text('El estado que intenta modificar no existe.');
						__NOMBRE = false;
						actualizarBoton();
					}
				}
			});
		} else {
			//Si se va a crear un estado nuevo
			//Enviar solicitud tipo POST al servidor
			$.post('/api/estado', { nombre: nombre }).then((estado)=>{
				//Estado agregado a la base de datos
				let fila = crearFila(4);
				let division = estado.creacion.indexOf('T');
				let fecha = parseDate(estado.creacion.substr(0, division));
				let lapiz = document.createElement('img');
				let modalTrigger = document.createElement('a');
				
				//Creación de la fila con los datos recibidos del servidor
				fila.id = estado.ID;
				$(fila).children('#1').text(estado.nombre);
				$(fila).children('#2').text(estado.personal);
				$(fila).children('#2').addClass('center-align');
				$(fila).children('#3').text(fecha);
				$(fila).children('#3').addClass('center-align');
				lapiz.src = "/ICONS/lapiz.png";
				lapiz.className = "imagen-editar logo responsive-img";
				modalTrigger.href = "#agregarEstado";
				modalTrigger.className = "modal-trigger";
				$(modalTrigger).append(lapiz);
				$(modalTrigger).click(edicion);
				$(fila).children('#4').addClass('center-align');

				$(fila).children('#4').append(modalTrigger);

				//Animación de confirmación agregando de primera en la tabla
				abrir(tabla, fila, 'fondo-exito', true);
				//Cerrar modal
				modal.close();
			}).catch((err)=>{
				//Cargo no se pudo agregar a la base de datos
				barraProgreso(false);
				switch(err.status){
					case 400: 
						error.text('Hay un error en el nombre del estado.');
						__NOMBRE = false;
						actualizarBoton();
					break;

					case 409: 
						error.text('El estado ya está registrado.');
						__NOMBRE = false;
						actualizarBoton();
					break;

					default:
						error.text('Ocurrió un error y no se pudo registrar el estado.');
					break;
				}
			});
		}
	}
}

function edicion(evt){
	//Si se selecciona una fila para modificarla
	let fila = $(evt.target).parent().parent().parent();
	let estado = $(fila).children('#1').text();
	EDITANDO = 1;
	__FILA = fila;
	__ESTADO = estado;
	//Actualizar los inputs del modal
	$('#nuevoEstado').val(estado);
	$('#nuevoEstadoLabel').addClass('active');
	//Verificar que el cargo sea correcto
	validarEstado();
}

function cargarTabla(){
	//Cargar elementos en la tabla al abrir la página por primera vez
	let tabla = $('#tablaEstados');
	//Solicitar todos los estados al servidor
	$.get('/api/estados').then((estados)=>{
		for(let i = 0; i < estados.length; i++){
			//Crear las filas necesarias
			let fila = crearFila(4);
			let division = estados[i].creacion.indexOf('T');
			let fecha = parseDate(estados[i].creacion.substr(0, division));
			let lapiz = document.createElement('img');
			let modalTrigger = document.createElement('a');

			//Añadir los datos relevantes en cada fila
			fila.id = estados[i].ID;
			$(fila).children('#1').text(estados[i].nombre);
			$(fila).children('#2').text(estados[i].personal);
			$(fila).children('#2').addClass('center-align');
			$(fila).children('#3').text(fecha);
			$(fila).children('#3').addClass('center-align');
			//Añadir datos para la modificación de la fila
			lapiz.src = "/ICONS/lapiz.png";
			lapiz.className = "imagen-editar logo responsive-img";
			modalTrigger.href = "#agregarEstado";
			modalTrigger.className = "modal-trigger";
			$(modalTrigger).append(lapiz);
			$(modalTrigger).click(edicion);

			$(fila).children('#4').append(modalTrigger);
			$(fila).children('#4').addClass('center-align');
			//Desplegar fila en la tabla
			tabla.append(fila);
		}
		//Actualizar el tamaño del menú lateral
		calcularLateral();
	});
}

function limpiarModal(){
	//Reestablecer los valores a los defaults al cerrar el modal
	let nombre = $('#nuevoEstado');
	let label = $('#nuevoEstadoLabel');
	let error = $('#mensajeError');
	let boton = $('#confirmarEstado');
	barraProgreso(false);

	nombre.val('');
	label.removeClass('active');
	boton.addClass('disabled');
	error.text('');

	EDITANDO = 0;
	__NOMBRE = false;
	__FILA = undefined;
	__ESTADO = undefined;
}