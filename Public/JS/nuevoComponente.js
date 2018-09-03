$(document).ready(()=>{
	$('.modal').modal({
		onCloseEnd: LimpiarCampos,
		onOpenStart: iniciarJerarquia
	});
	$('#confirmarGrado').click(agregar);
	$('#grados').change(verificarGrado);
	$('#jerarquia').change(verificarJerarquia);
	$('#jerarquia').keyup(verificarJerarquia);
	$('#vaciarTabla').click(vaciarTabla);
});

var EDITANDO = false;
var __GRADOS = false;
var __JERARQUIA = false;
var __FILA;

function LimpiarCampos(evt) {
	$('#grados').val('');
	$('#grados').formSelect();
	$('#jerarquia').val('');
	$('#jerarquia').formSelect();
	$('#confirmarGrado').addClass('disabled');
	__GRADOS = false;
	__JERARQUIA = false;
	EDITANDO = false;
	__FILA = undefined;
}

function actualizarBoton() {
	if(__GRADOS && __JERARQUIA) {
		$('#confirmarGrado').removeClass('disabled');
	} else {
		$('#confirmarGrado').addClass('disabled');
	}
}

function iniciarJerarquia() {
	let tabla = $('#tablaGrados');
	$('#jerarquia').empty();
	let seleccionar = document.createElement('option');
	seleccionar.innerText="Seleccionar...";
	$(seleccionar).attr('disabled');
	$('#jerarquia').append(seleccionar);
	let hijos = tabla.children().length;
	for(let i = 0; i <= hijos; i++){
		let opt = document.createElement('option');
		opt.value = i + 1;
		opt.innerText = i + 1;
		$('#jerarquia').append(opt);
	}
	$('#jerarquia').formSelect();
}

function verificarGrado(evt){
	let valor = $('#grados').val();
	if(valor !== '') {
		__GRADOS = true;
	} else {
		__GRADOS = false;
	}
	actualizarBoton();
}

function verificarJerarquia(evt) {
	let valor = $('#jerarquia').val();
	if(valor.length === 0 || isNaN(valor) || valor.indexOf('.') !== -1) {
		__JERARQUIA = false;
	} else {
		__JERARQUIA = true;
	}
	actualizarBoton();
}

function vaciarTabla(evt)  {
	$('#tablaGrados').empty();
	calcularLateral();
}

function edicion(evt) {
	let padre = $(evt.target).parent().parent();
	let fila = $(padre).parent();
	let grado = $(fila).children('#grado').text();
	let jerarquia = $(fila).children('#orden').text();
	$('#grados').val(grado);
	$('#grados').formSelect();
	$('#jerarquia').val(jerarquia);
	$('#jerarquia').formSelect();
	verificarGrado();
	verificarJerarquia();
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

function agregar(evt) {
	verificarGrado();
	verificarJerarquia();
	if(__JERARQUIA && __GRADOS){
		if(!EDITANDO){
			let grado = $('#grados').val();
			let jerarquia = $('#jerarquia').val();

			let tabla = $('#tablaGrados');

			let tr = document.createElement('tr');
			let _grado = document.createElement('td');
			let divisor = document.createElement('td');
			let divisor1 = document.createElement('td');
			let _jerarquia = document.createElement('td');
			let editar = document.createElement('td');
			let borrar = document.createElement('td');
			let papelera = document.createElement('img');
			let lapiz = document.createElement('img');
			let modalTrigger = document.createElement('a');

			tr.id = jerarquia;
			_grado.id = 'grado';
			_jerarquia.id = 'orden';

			_grado.innerText = grado;
			divisor.className = "divisor";
			divisor1.className = "divisor";
			_jerarquia.innerText = jerarquia;
			_jerarquia.className = "center-align"
			papelera.src = "/ICONS/papelera.png";
			papelera.className = "imagen-eliminar logo responsive-img";
			lapiz.src = "/ICONS/lapiz.png";
			lapiz.className = "imagen-editar logo responsive-img";
			modalTrigger.href = "#agregarGrado";
			modalTrigger.className = "modal-trigger";

			$(modalTrigger).append(lapiz);

			$(papelera).click(eliminar);
			$(modalTrigger).click(edicion);

			$(borrar).append(papelera);
			$(editar).append(modalTrigger);

			$(tr).append(_jerarquia, divisor, _grado, divisor1, editar, borrar);

			if(tabla.children().length === 0){
				console.log('Agregando 0');
				tabla.append(tr);
			} else {
				if(tr.id === '1') {
					console.log('Agregando 1');
					tabla.prepend(tr);
				} else {
					console.log('Agregando N');
					tabla.children('#' + tr.id - 1).after(tr);
				}
			}
			actualizarTabla().then(()=>{
				calcularLateral();
			});
		} else {
			let cargo = $('#cargos').val();
			let plazas = $('#plazas').val();
			$(__FILA).children('#puesto').text(cargo);
			$(__FILA).children('#totales').text(plazas);
		}
	}
}

function actualizarTabla(){
	return new Promise((resolve, reject)=>{
		let tabla = $('#tablaGrados');
		let hijos = tabla.children();
		for(let i = 0; i < hijos.length; i++) {
			let hijo = $(hijos[i]).children('#orden');
			hijo.text(i + 1);
			$(hijos[i]).attr('id', i+1);
		}
	});
}