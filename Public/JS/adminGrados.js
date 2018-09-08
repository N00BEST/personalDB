$(document).ready(()=>{
	$('.modal').modal({
		onCloseEnd: limpiarModal,
		onOpenStart: desplegarTitulo
	});
	$('#confirmarGrado').click(agregarGrado);
	$('#nuevoGrado').keyup(validarGrado);
	cargarTabla();
});

var EDITANDO = 0;
var __NOMBRE = false;
var __FILA = undefined;
var __GRADO = undefined;

function desplegarTitulo() {
	//Desplegar el título del modal según lo que se vaya a realizar
	if(EDITANDO){
		//Si se va a editar una fila
		$('#tituloModal').text('Modificar un grado existente');
	} else {
		//Si se va a crear una fila nueva
		$('#tituloModal').text('Crear un grado nuevo');
	}
}

function validarGrado(evt){
	let nombre = $('#nuevoGrado').val().trim();
	let error = $('#mensajeError');
	if(nombre.length > 0) {
		$.get('/api/grado?nombre=' + nombre).then((grado)=>{
			error.text('Ya existe un grado registrado con ese nombre.');
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
		agregarGrado();
	}
}

function actualizarBoton() {
	let boton = $('#confirmarGrado');
	if(__NOMBRE){
		boton.removeClass('disabled');
	} else {
		boton.addClass('disabled');
	}
}

function agregarGrado(){
	//Desplegar la barra de progreso
	barraProgreso(true);
	//Iniciar validación de los campos inscritos
	validarGrado();
	//Si el nombre es válido
	if(__NOMBRE){
		//Extraer datos generales a usar
		let nombre = $('#nuevoGrado').val().trim();
		let tabla = $('#tablaGrados');
		let modal = M.Modal.getInstance($('#agregarGrado'));
		let error = $('#mensajeError');
		if(EDITANDO){
			//Si se está editando una fila existente
			//Enviar solicitud tipo PUT al servidor
			$.ajax({
				url: '/api/grado',
				type: 'PUT', 
				data: {
					ID: __FILA.attr('id'),
					nombre: __GRADO,
					nuevo: nombre
				}, 
				success: (grado)=>{
					//Al recibir respuesta, extraer datos de interés.
					let division = grado.creacion.indexOf('T');
					let fecha = parseDate(grado.creacion.substr(0, division));
					let fila = __FILA;

					//Actualizar la fila
					fila.attr('id', grado.ID);
					fila.children('#1').text(grado.nombre);
					fila.children('#2').text(grado.personal);
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
						error.text('Hay un error en el nombre del grado.');
						__NOMBRE = false;
						actualizarBoton();
					},

					500: ()=>{
						barraProgreso(false);
						error.text('Ocurrió un error y no se pudo registrar el grado.');
					},

					404: ()=>{
						barraProgreso(false);
						error.text('El grado que intenta modificar no existe.');
						__NOMBRE = false;
						actualizarBoton();
					}
				}
			});
		} else {
			//Si se va a crear un grado nuevo
			//Enviar solicitud tipo POST al servidor
			$.post('/api/grado', { nombre: nombre }).then((grado)=>{
				//Grado agregado a la base de datos
				let fila = crearFila(4);
				let division = grado.creacion.indexOf('T');
				let fecha = parseDate(grado.creacion.substr(0, division));
				let lapiz = document.createElement('img');
				let modalTrigger = document.createElement('a');
				
				//Creación de la fila con los datos recibidos del servidor
				fila.id = grado.ID;
				$(fila).children('#1').text(grado.nombre);
				$(fila).children('#2').text(grado.personal);
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
						error.text('Hay un error en el nombre del grado.');
						__NOMBRE = false;
						actualizarBoton();
					break;

					case 409: 
						error.text('El grado ya está registrado.');
						__NOMBRE = false;
						actualizarBoton();
					break;

					default:
						error.text('Ocurrió un error y no se pudo registrar el grado.');
					break;
				}
			});
		}
	}
}

function edicion(evt){
	//Si se selecciona una fila para modificarla
	let fila = $(evt.target).parent().parent().parent();
	let grado = $(fila).children('#1').text();
	EDITANDO = 1;
	__FILA = fila;
	__GRADO = grado;
	//Actualizar los inputs del modal
	$('#nuevoGrado').val(grado);
	$('#nuevoGradoLabel').addClass('active');
	//Verificar que el cargo sea correcto
	validarGrado();
}

function cargarTabla(){
	//Cargar elementos en la tabla al abrir la página por primera vez
	let tabla = $('#tablaGrados');
	//Solicitar todos los grados al servidor
	$.get('/api/grados').then((grados)=>{
		for(let i = 0; i < grados.length; i++){
			//Crear las filas necesarias
			let fila = crearFila(4);
			let division = grados[i].creacion.indexOf('T');
			let fecha = parseDate(grados[i].creacion.substr(0, division));
			let lapiz = document.createElement('img');
			let modalTrigger = document.createElement('a');

			//Añadir los datos relevantes en cada fila
			fila.id = grados[i].ID;
			$(fila).children('#1').text(grados[i].nombre);
			$(fila).children('#2').text(grados[i].personal);
			$(fila).children('#2').addClass('center-align');
			$(fila).children('#3').text(fecha);
			$(fila).children('#3').addClass('center-align');
			//Añadir datos para la modificación de la fila
			lapiz.src = "/ICONS/lapiz.png";
			lapiz.className = "imagen-editar logo responsive-img";
			modalTrigger.href = "#agregarGrado";
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
	let nombre = $('#nuevoGrado');
	let label = $('#nuevoGradoLabel');
	let error = $('#mensajeError');
	let boton = $('#confirmarGrado');
	barraProgreso(false);

	nombre.val('');
	label.removeClass('active');
	boton.addClass('disabled');
	error.text('');

	EDITANDO = 0;
	__NOMBRE = false;
	__FILA = undefined;
	__GRADO = undefined;
}