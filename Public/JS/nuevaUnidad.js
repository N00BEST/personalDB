$(document).ready(()=>{
	$('.modal').modal({
		onCloseEnd: LimpiarCampos
	});
	$('#confirmarCargo').click(agregar);
	$('#cargos').change(verificarCargo);
	$('#plazas').change(verificarPlaza);
	$('#plazas').keyup(verificarPlaza);
	$('#vaciarTabla').click(vaciarTabla);
});

var EDITANDO = false;
var __CARGOS = false;
var __PLAZAS = false;
var __FILA;

function actualizarBoton() {
	if(__CARGOS && __PLAZAS) {
		$('#confirmarCargo').removeClass('disabled');
	} else {
		$('#confirmarCargo').addClass('disabled');
	}
}

function verificarCargo(evt){
	let valor = $('#cargos').val();
	if(valor !== '') {
		__CARGOS = true;
	} else {
		__CARGOS = false;
	}
	actualizarBoton();
}

function verificarPlaza(evt) {
	let valor = $('#plazas').val();
	if(valor.length === 0 || isNaN(valor) || valor.indexOf('.') !== -1) {
		__PLAZAS = false;
	} else {
		__PLAZAS = true;
	}
	actualizarBoton();
}

function LimpiarCampos(evt) {
	$('#cargos').val('');
	$('#cargos').formSelect();
	$('#plazas').val('');
	$('#confirmarCargo').addClass('disabled');
	__CARGOS = false;
	__PLAZAS = false;
	EDITANDO = false;
	__FILA = undefined;
}

function agregar(evt) {
	verificarCargo();
	verificarPlaza();
	if(__PLAZAS && __CARGOS){
		if(!EDITANDO){
			let cargo = $('#cargos').val();
			let plazas = $('#plazas').val();

			let tabla = $('#tablaCargos');

			let tr = document.createElement('tr');
			let puesto = document.createElement('td');
			let divisor = document.createElement('td');
			let divisor1 = document.createElement('td');
			let totales = document.createElement('td');
			let editar = document.createElement('td');
			let borrar = document.createElement('td');
			let papelera = document.createElement('img');
			let lapiz = document.createElement('img');
			let modalTrigger = document.createElement('a');

			tr.id = cargo;
			puesto.id = 'puesto';
			totales.id = 'totales';

			puesto.innerText = cargo;
			divisor.className = "divisor";
			divisor1.className = "divisor";
			totales.innerText = plazas;
			totales.className = "center-align"
			papelera.src = "/ICONS/papelera.png";
			papelera.className = "imagen-eliminar logo responsive-img";
			lapiz.src = "/ICONS/lapiz.png";
			lapiz.className = "imagen-editar logo responsive-img";
			modalTrigger.href = "#agregarCargo";
			modalTrigger.className = "modal-trigger";

			$(modalTrigger).append(lapiz);

			$(papelera).click(eliminar);
			$(modalTrigger).click(edicion);

			$(borrar).append(papelera);
			$(editar).append(modalTrigger);

			$(tr).append(puesto, divisor, totales, divisor1, editar, borrar);

			$(tabla).append(tr);

			calcularLateral();
		} else {
			let cargo = $('#cargos').val();
			let plazas = $('#plazas').val();
			$(__FILA).children('#puesto').text(cargo);
			$(__FILA).children('#totales').text(plazas);
		}
	}
}

function vaciarTabla(evt)  {
	$('#tablaCargos').empty();
	calcularLateral();
}

function edicion(evt) {
	let padre = $(evt.target).parent().parent();
	let fila = $(padre).parent();
	let puesto = $(fila).children('#puesto').text();
	let plazas = $(fila).children('#totales').text();
	$('#cargos').val(puesto);
	$('#cargos').formSelect();
	$('#plazas').val(plazas);
	verificarCargo();
	verificarPlaza();
	EDITANDO = true;
	__FILA = fila;
}

function eliminar(evt) {
	let padre = $(evt.target).parent();
	let fila = $(padre).parent();
	$(fila).addClass('fondo-peligro');
	setTimeout(()=>{
		cerrar(fila).then(()=>{
			calcularLateral();
		});
	}, 400);
}