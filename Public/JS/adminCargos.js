$(document).ready(()=>{
	$('.modal').modal();
	$('#confirmarCargo').click(agregarCargo);
	$('#nuevoCargo').keyup(validarCargo);
});

var EDITANDO = false;
var __NOMBRE = false;
var __FILA = undefined;

function validarCargo(){
	let nombre = $('#nuevoCargo').val().trim();
	if(nombre.length > 0) {
		__NOMBRE = true;
	} else {
		__NOMBRE = false;
	}
	actualizarBoton();
}

function actualizarBoton() {
	let boton = $('#confirmarCargo');
	if(__NOMBRE){
		boton.removeClass('disabled');
	} else {
		boton.addClass('disabled');
	}
}

function agregarCargo(evt){
	validarCargo();
	if(__NOMBRE){
		let nombre = $('#nuevoCargo').val().trim();
		let tabla = $('#tablaCargos');
		$.post('/api/cargo', { nombre: nombre }).then((cargo)=>{
			//Cargo agregado a la base de datos
			console.log(cargo);
			let fila = crearFila(5);
			$(fila).children('#1').text(cargo.nombre);
			$(fila).children('#2').text(cargo.activo);
			$(fila).children('#3').text(cargo.historico);
			$(fila).children('#4').text(cargo.creacion);

			tabla.append(fila);
		}).catch((err)=>{
			//Cargo no se pudo agregar a la base de datos
			//Pensar cómo manejar los errores
		});
	}

}