$(document).ready(()=>{
	$('.modal').modal({
		onCloseEnd: limpiarModal,
		onOpenStart: desplegarTitulo
	});
	$('#confirmarCargo').click(agregarCargo);
	$('#nuevoCargo').keyup(validarCargo);
	cargarTabla();
});

var EDITANDO = 0;
var __NOMBRE = false;
var __FILA = undefined;
var __CARGO = undefined;

function desplegarTitulo() {
	//Desplegar el título del modal según lo que se vaya a realizar
	if(EDITANDO){
		//Si se va a editar una fila
		$('#tituloModal').text('Modificar un cargo existente');
	} else {
		//Si se va a crear una fila nueva
		$('#tituloModal').text('Crear un cargo nuevo');
	}
}

function validarCargo(evt){
	let nombre = $('#nuevoCargo').val().trim();
	let error = $('#mensajeError');
	if(nombre.length > 0) {
		$.get('/api/cargo?nombre=' + nombre).then((cargo)=>{
			error.text('Ya existe un cargo registrado con ese nombre.');
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
		agregarCargo();
	}
}

function actualizarBoton() {
	let boton = $('#confirmarCargo');
	if(__NOMBRE){
		boton.removeClass('disabled');
	} else {
		boton.addClass('disabled');
	}
}

function agregarCargo(){
	//Desplegar la barra de progreso
	barraProgreso(true);
	//Iniciar validación de los campos inscritos
	validarCargo();
	//Si el nombre es válido
	if(__NOMBRE){
		//Extraer datos generales a usar
		let nombre = $('#nuevoCargo').val().trim();
		let tabla = $('#tablaCargos');
		let modal = M.Modal.getInstance($('#agregarCargo'));
		let error = $('#mensajeError');
		if(EDITANDO){
			//Si se está editando una fila existente
			//Enviar solicitud tipo PUT al servidor
			$.ajax({
				url: '/api/cargo',
				type: 'PUT', 
				data: {
					ID: __FILA.attr('id'),
					nombre: __CARGO,
					nuevo: nombre
				}, 
				success: (cargo)=>{
					//Al recibir respuesta, extraer datos de interés.
					let division = cargo.creacion.indexOf('T');
					let fecha = parseDate(cargo.creacion.substr(0, division));
					let fila = __FILA;

					//Actualizar la fila
					fila.attr('id', cargo.ID);
					fila.children('#1').text(cargo.nombre);
					fila.children('#2').text(cargo.activo);
					fila.children('#3').text(cargo.historico);
					fila.children('#4').text(fecha);

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
						error.text('Hay un error en el nombre del cargo.');
						__NOMBRE = false;
						actualizarBoton();
					},

					500: ()=>{
						barraProgreso(false);
						error.text('Ocurrió un error y no se pudo registrar el cargo.');
					},

					404: ()=>{
						barraProgreso(false);
						error.text('El cargo que intenta modificar no existe.');
						__NOMBRE = false;
						actualizarBoton();
					}
				}
			});
		} else {
			//Si se va a crear un cargo nuevo
			//Enviar solicitud tipo POST al servidor
			$.post('/api/cargo', { nombre: nombre }).then((cargo)=>{
				//Cargo agregado a la base de datos
				let fila = crearFila(5);
				let division = cargo.creacion.indexOf('T');
				let fecha = parseDate(cargo.creacion.substr(0, division));
				let lapiz = document.createElement('img');
				let modalTrigger = document.createElement('a');
				
				//Creación de la fila con los datos recibidos del servidor
				fila.id = cargo.ID;
				$(fila).children('#1').text(cargo.nombre);
				$(fila).children('#2').text(cargo.activo);
				$(fila).children('#2').addClass('center-align');
				$(fila).children('#3').text(cargo.historico);
				$(fila).children('#3').addClass('center-align');
				$(fila).children('#4').text(fecha);
				$(fila).children('#4').addClass('center-align');
				lapiz.src = "/ICONS/lapiz.png";
				lapiz.className = "imagen-editar logo responsive-img";
				modalTrigger.href = "#agregarCargo";
				modalTrigger.className = "modal-trigger";
				$(modalTrigger).append(lapiz);
				$(modalTrigger).click(edicion);
				$(fila).children('#5').addClass('center-align');

				$(fila).children('#5').append(modalTrigger);

				//Animación de confirmación agregando de primera en la tabla
				abrir(tabla, fila, 'fondo-exito', true);
				//Cerrar modal
				modal.close();
			}).catch((err)=>{
				//Cargo no se pudo agregar a la base de datos
				barraProgreso(false);
				switch(err.status){
					case 400: 
						error.text('Hay un error en el nombre del cargo.');
						__NOMBRE = false;
						actualizarBoton();
					break;

					case 409: 
						error.text('El cargo ya está registrado.');
						__NOMBRE = false;
						actualizarBoton();
					break;

					default:
						error.text('Ocurrió un error y no se pudo registrar el cargo.');
					break;
				}
			});
		}
	}
}

function edicion(evt){
	//Si se selecciona una fila para modificarla
	let fila = $(evt.target).parent().parent().parent();
	let cargo = $(fila).children('#1').text();
	EDITANDO = 1;
	__FILA = fila;
	__CARGO = cargo;
	//Actualizar los inputs del modal
	$('#nuevoCargo').val(cargo);
	$('#nuevoCargoLabel').addClass('active');
	//Verificar que el cargo sea correcto
	validarCargo();
}

function cargarTabla(){
	//Cargar elementos en la tabla al abrir la página por primera vez
	let tabla = $('#tablaCargos');
	//Solicitar todos los cargos al servidor
	$.get('/api/cargos?fecha=1').then((cargos)=>{
		for(let i = 0; i < cargos.length; i++){
			//Crear las filas necesarias, una por cada cargo
			let fila = crearFila(5);
			let division = cargos[i].creacion.indexOf('T');
			let fecha = parseDate(cargos[i].creacion.substr(0, division));
			let lapiz = document.createElement('img');
			let modalTrigger = document.createElement('a');

			//Añadir los datos relevantes en cada fila
			fila.id = cargos[i].ID;
			$(fila).children('#1').text(cargos[i].nombre);
			$(fila).children('#2').text(cargos[i].activo);
			$(fila).children('#2').addClass('center-align');
			$(fila).children('#3').text(cargos[i].historico);
			$(fila).children('#3').addClass('center-align');
			$(fila).children('#4').text(fecha);
			$(fila).children('#4').addClass('center-align');
			//Añadir datos para la modificación de la fila
			lapiz.src = "/ICONS/lapiz.png";
			lapiz.className = "imagen-editar logo responsive-img";
			modalTrigger.href = "#agregarCargo";
			modalTrigger.className = "modal-trigger";
			$(modalTrigger).append(lapiz);
			$(modalTrigger).click(edicion);

			$(fila).children('#5').append(modalTrigger);
			$(fila).children('#5').addClass('center-align');
			//Desplegar fila en la tabla
			tabla.append(fila);
		}
		//Actualizar el tamaño del menú lateral
		calcularLateral();
	});
}

function barraProgreso(activar){
	//Desplegar u ocultar la barra de progreso.
	let barra = $('#barraProgreso');
	//Quitar la barra
	barra.empty();
	if(activar){
		//Si se requiere activa, se instancia
		let progreso = document.createElement('div');
		let indeterminado = document.createElement('div');

		progreso.className = 'progress';
		indeterminado.className = 'indeterminate';

		$(progreso).append(indeterminado);
		//Se despliega la barra
		barra.append(progreso);
	}
}

function limpiarModal(){
	//Reestablecer los valores a los defaults al cerrar el modal
	let nombre = $('#nuevoCargo');
	let label = $('#nuevoCargoLabel');
	let error = $('#mensajeError');
	let boton = $('#confirmarCargo');
	barraProgreso(false);

	nombre.val('');
	label.removeClass('active');
	boton.addClass('disabled');
	error.text('');

	EDITANDO = 0;
	__NOMBRE = false;
	__FILA = undefined;
	__CARGO = undefined;
}