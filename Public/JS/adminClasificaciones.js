$(document).ready(()=>{
	$('.modal').modal({
		onCloseEnd: limpiarModal,
		onOpenStart: desplegarTitulo
	});
	$('#confirmarClasificacion').click(agregarClasificacion);
	$('#nuevaClasificacion').keyup(validarClasificacion);
	cargarTabla();
});

var EDITANDO = 0;
var __NOMBRE = false;
var __FILA = undefined;
var __CLASIFICACION = undefined;

function desplegarTitulo() {
	//Desplegar el título del modal según lo que se vaya a realizar
	if(EDITANDO){
		//Si se va a editar una fila
		$('#tituloModal').text('Modificar una clasificación existente');
	} else {
		//Si se va a crear una fila nueva
		$('#tituloModal').text('Crear una clasificación nueva');
	}
}

function validarClasificacion(evt){
	let nombre = $('#nuevaClasificacion').val().trim();
	let error = $('#mensajeError');
	if(nombre.length > 0) {
		$.get('/api/clasificacion?nombre=' + nombre).then((clasificacion)=>{
			error.text('Ya existe una clasificación registrada con ese nombre.');
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
		agregarClasificacion();
	}
}

function actualizarBoton() {
	let boton = $('#confirmarClasificacion');
	if(__NOMBRE){
		boton.removeClass('disabled');
	} else {
		boton.addClass('disabled');
	}
}

function agregarClasificacion(){
	//Desplegar la barra de progreso
	barraProgreso(true);
	//Iniciar validación de los campos inscritos
	validarClasificacion();
	//Si el nombre es válido
	if(__NOMBRE){
		//Extraer datos generales a usar
		let nombre = $('#nuevaClasificacion').val().trim();
		let tabla = $('#tablaClasificaciones');
		let modal = M.Modal.getInstance($('#agregarClasificacion'));
		let error = $('#mensajeError');
		if(EDITANDO){
			//Si se está editando una fila existente
			//Enviar solicitud tipo PUT al servidor
			$.ajax({
				url: '/api/clasificacion',
				type: 'PUT', 
				data: {
					ID: __FILA.attr('id'),
					nombre: __CLASIFICACION,
					nuevo: nombre
				}, 
				success: (clasificacion)=>{
					//Al recibir respuesta, extraer datos de interés.
					let division = clasificacion.creacion.indexOf('T');
					let fecha = parseDate(clasificacion.creacion.substr(0, division));
					let fila = __FILA;

					//Actualizar la fila
					fila.attr('id', clasificacion.ID);
					fila.children('#1').text(clasificacion.nombre);
					fila.children('#2').text(clasificacion.personal);
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
						error.text('Hay un error en el nombre de la clasificación.');
						__NOMBRE = false;
						actualizarBoton();
					},

					500: ()=>{
						barraProgreso(false);
						error.text('Ocurrió un error y no se pudo registrar la clasificación.');
					},

					404: ()=>{
						barraProgreso(false);
						error.text('La clasificación que intenta modificar no existe.');
						__NOMBRE = false;
						actualizarBoton();
					}
				}
			});
		} else {
			//Si se va a crear un clasificacion nuevo
			//Enviar solicitud tipo POST al servidor
			$.post('/api/clasificacion', { nombre: nombre }).then((clasificacion)=>{
				//Clasificación agregada a la base de datos
				let fila = crearFila(4);
				let division = clasificacion.creacion.indexOf('T');
				let fecha = parseDate(clasificacion.creacion.substr(0, division));
				let lapiz = document.createElement('img');
				let modalTrigger = document.createElement('a');
				
				//Creación de la fila con los datos recibidos del servidor
				fila.id = clasificacion.ID;
				$(fila).children('#1').text(clasificacion.nombre);
				$(fila).children('#2').text(clasificacion.personal);
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
						error.text('Hay un error en el nombre de la clasificación.');
						__NOMBRE = false;
						actualizarBoton();
					break;

					case 409: 
						error.text('La clasificación ya está registrada.');
						__NOMBRE = false;
						actualizarBoton();
					break;

					default:
						error.text('Ocurrió un error y no se pudo registrar la clasificación.');
					break;
				}
			});
		}
	}
}

function edicion(evt){
	//Si se selecciona una fila para modificarla
	let fila = $(evt.target).parent().parent().parent();
	let clasificacion = $(fila).children('#1').text();
	EDITANDO = 1;
	__FILA = fila;
	__CLASIFICACION = clasificacion;
	//Actualizar los inputs del modal
	$('#nuevaClasificacion').val(clasificacion);
	$('#nuevaClasificacionLabel').addClass('active');
	//Verificar que el cargo sea correcto
	validarClasificacion();
}

function cargarTabla(){
	//Cargar elementos en la tabla al abrir la página por primera vez
	let tabla = $('#tablaClasificaciones');
	//Solicitar todos los clasificaciones al servidor
	$.get('/api/clasificaciones').then((clasificaciones)=>{
		for(let i = 0; i < clasificaciones.length; i++){
			//Crear las filas necesarias
			let fila = crearFila(4);
			let division = clasificaciones[i].creacion.indexOf('T');
			let fecha = parseDate(clasificaciones[i].creacion.substr(0, division));
			let lapiz = document.createElement('img');
			let modalTrigger = document.createElement('a');

			//Añadir los datos relevantes en cada fila
			fila.id = clasificaciones[i].ID;
			$(fila).children('#1').text(clasificaciones[i].nombre);
			$(fila).children('#2').text(clasificaciones[i].personal);
			$(fila).children('#2').addClass('center-align');
			$(fila).children('#3').text(fecha);
			$(fila).children('#3').addClass('center-align');
			//Añadir datos para la modificación de la fila
			lapiz.src = "/ICONS/lapiz.png";
			lapiz.className = "imagen-editar logo responsive-img";
			modalTrigger.href = "#agregarClasificacion";
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
	let nombre = $('#nuevaClasificacion');
	let label = $('#nuevaClasificacionLabel');
	let error = $('#mensajeError');
	let boton = $('#confirmarClasificacion');
	barraProgreso(false);

	nombre.val('');
	label.removeClass('active');
	boton.addClass('disabled');
	error.text('');

	EDITANDO = 0;
	__NOMBRE = false;
	__FILA = undefined;
	__CLASIFICACION = undefined;
}