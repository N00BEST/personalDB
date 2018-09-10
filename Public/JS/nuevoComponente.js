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
	$('#submit').click(submit);
	$('#nombre').keyup(validarNombre);
});

var EDITANDO = false;
var __GRADOS = false;
var __JERARQUIA = false;
var __FILA = undefined;
var __NOMBRE = false;

var __GRADOSARRAY;

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
	
	if(!EDITANDO){
		$.get('/api/grados').then((grados)=>{
			$('#grados').empty();
			let seleccionar = document.createElement('option');
			seleccionar.innerText="Seleccionar...";
			$(seleccionar).attr('disabled', 'disabled');
			$(seleccionar).attr('selected', 'selected');
			$('#grados').append(seleccionar);
			__GRADOSARRAY = grados;
			for(let i = 0; i < grados.length; i++){
				let grado = grados[i];
				let opt = document.createElement('option');
				opt.value = grado.ID;
				opt.innerText = grado.nombre;
				$('#grados').append(opt);
			}
			$('#grados').formSelect();
		}).catch((err)=>{
	
		})
		let tabla = $('#tablaGrados');
		$('#jerarquia').empty();
		let seleccionar = document.createElement('option');
		seleccionar.innerText="Seleccionar...";
		$(seleccionar).attr('disabled', 'disabled');
		$(seleccionar).attr('selected', 'selected');
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
	let grado = $(fila).attr('name');
	let jerarquia = $(fila).children('#orden').text();
	console.log('Jerarquia: ' + jerarquia);
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
			actualizarTabla().then(()=>{
				calcularLateral();
			});
		});
	}, 400);
}

function agregar(evt) {
	verificarGrado();
	verificarJerarquia();

	if(__JERARQUIA && __GRADOS){
		let tabla = $('#tablaGrados');
		if(!EDITANDO){
			let grado = buscar(__GRADOSARRAY, $('#grados').val());
			let jerarquia = $('#jerarquia').val();
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
			$(tr).attr('name', grado.ID);
			_grado.id = 'grado';
			_jerarquia.id = 'orden';

			_grado.innerText = grado.nombre;
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

			if(tabla.children().length === 0) {
				tabla.append(tr);
			} else {
				if(parseInt(jerarquia) === 1) {
					tabla.prepend(tr);
				} else if(parseInt(jerarquia) === tabla.children().length + 1) {
					tabla.append(tr);
				} else {
					tabla.children('#' + (parseInt(jerarquia) - 1)).after(tr);
				}
			}
			
			abrir(undefined, tr, 'fondo-exito', true);

			actualizarTabla().then(()=>{
				calcularLateral();
			});
		} else {
			let grado = buscar(__GRADOSARRAY, $('#grados').val());
			let jerarquia = $('#jerarquia').val();
			$(__FILA).children('#grado').text(grado.nombre);
			$(__FILA).children('#orden').text(jerarquia);
			$(__FILA).attr('name', grado.ID);
			if(tabla.children().length === 0) {
				tabla.append(__FILA);
			} else {
				if(parseInt(jerarquia) === 1) {
					tabla.prepend(__FILA);
				} else if(parseInt(jerarquia) === tabla.children().length + 1) {
					tabla.append(__FILA);
				} else {
					tabla.children('#' + (parseInt(jerarquia) - 1)).after(__FILA);
				}
			}

			abrir(undefined, __FILA, 'fondo-exito', true);

			actualizarTabla().then(()=>{
				calcularLateral();
			});
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
		resolve();
	});
}

function submit(){
	validarNombre();
	if(__NOMBRE){
		let obj = {
			nombre: $('#nombre').val().trim(),
			jerarquia: '',
			comandante: $('#nombreComandante').val().trim(),
			gradoComandante: $('#gradoComandante').val().trim(),
			fechaComandante: StringFecha($('#tomaComandante').val().trim()),
			segundo: $('#nombreSegundo').val().trim(),
			gradoSegundo: $('#gradoSegundo').val().trim(),
			fechaSegundo: StringFecha($('#tomaSegundo').val().trim()),
		}
		let grados = $('#tablaGrados').children();

		for(let i = 0; i < grados.length; i++) {
			obj.jerarquia += $(grados[i]).attr('name') + '#';
		}
		if(obj.jerarquia.length > 0) {
			obj.jerarquia = obj.jerarquia.substr(0, obj.jerarquia.length - 1);
		}
		$.post('/api/componente', obj).then((componente)=>{
			M.toast({
				html: '¡Se creó el componente "' + componente.nombre + '" éxitosamente!',
				classes: 'fondo-exito'
			});
			$('#nombre').val('');
			$('#nombreLabel').removeClass('active');
			vaciarTabla();
			$('#nombreComandante').val('');
			$('#comandanteLabel').removeClass('active');
			$('#gradoComandante').val('');
			$('#gradoComandanteLabel').removeClass('active');
			$('#tomaComandante').val('');
			$('#nombreSegundo').val('');
			$('#segundoLabel').removeClass('active');
			$('#gradoSegundo').val('');
			$('#gradoSegundoLabel').removeClass('active');
			$('#tomaSegundo').val('');
			calcularLateral();
		}).catch((err)=>{
			console.log(err);
			let msg = "";
			switch(err.status){
				case 400: 
					msg += 'Hay errores en el formulario.<br>Por favor corríjalos antes de continuar.';
				break;

				case 409: 
					msg += 'No se puede registrar el componente.<br>Ya hay un componente registrado con ese nombre';
				break;

				default:
					msg += 'Por favor inténtelo de nuevo más tarde.'
				break;
			}
			M.toast({
				html: msg,
				classes: 'fondo-peligro'
			});
		});
	} else {
		M.toast({
			html: 'Hay errores en el nombre del componente.<br /> Corríjalos antes de continuar',
			classes: 'fondo-peligro'
		});
	}
	$(document).scrollTop(0);
}

function validarNombre(){
	let nombre = $('#nombre').val().trim();
	if(nombre.length === 0) {
		$('#errorNombre').text('El nombre no puede estar vacío.');
		__NOMBRE = false;
	} else {
		$.get('/api/componente?nombre=' + nombre).then((resultado)=>{
			$('#errorNombre').text('Ya hay un componente registrado con ese nombre.');
			__NOMBRE = false;
		}).catch((err)=>{
			$('#errorNombre').text('');
			__NOMBRE = true;
		});
	}
}