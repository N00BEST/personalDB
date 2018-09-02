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

function edicion(evt) {
	let padre = $(evt.target).parent().parent();
	let abuelo = $(padre).parent();
	let puesto = $(abuelo).children('#puesto').text();
	let plazas = $(abuelo).children('#totales').text();
	$('#cargos').val(puesto);
	$('#cargos').formSelect();
	$('#plazas').val(plazas);
	verificarCargo();
	verificarPlaza();
	EDITANDO = true;
	__FILA = abuelo;
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
			papelera.src = "../Public/ICONS/papelera.png";
			papelera.className = "imagen-eliminar logo responsive-img";
			lapiz.src = "../Public/ICONS/lapiz.png";
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
}

function eliminar(evt) {
	let padre = $(evt.target).parent();
	let abuelo = $(padre).parent();
	$(abuelo).addClass('fondo-peligro');
	setTimeout(()=>{ cerrar(abuelo); }, 5);
}

function cerrar(abuelo, valores) {
	if(typeof valores === 'undefined'){
		let distancia = $(abuelo).height()/25;
		let altura = $(abuelo).height() - distancia; 
		valores = {
			altura: altura,
			distancia: distancia
		}
		$(abuelo).addClass('fila-eliminar');
		$(abuelo).height(altura);
		setTimeout(()=>{ cerrar(abuelo, valores); }, 1);
	} else {
		if(valores.altura > 0) {
			let distancia = valores.distancia;
			let altura = valores.altura - distancia; 
			valores = {
				altura: altura,
				distancia: distancia
			}
			if($(abuelo).css('font-size') && valores.altura <= parseFloat($(abuelo).css('font-size'))){
				$(abuelo).children().text('');
			}
			$(abuelo).height(altura);
			setTimeout(()=>{ cerrar(abuelo, valores); }, 1);
		} else {
			$(abuelo).remove();
		}
	}
}