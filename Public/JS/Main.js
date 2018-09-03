$(document).ready(()=>{
	$('.dropdown-trigger').dropdown();
	$('.lateral').height($('.principal').height() + $('header').height() + $('footer').height() + 100);
	$(window).resize(calcularLateral);
	$('select').formSelect();
	$('.datepicker').datepicker({
		format: 'dd mmm yyyy', 
		yearRange: 100,
		maxDate: new Date(),
		i18n: {
			months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
			weekdaysShort: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
			weekdays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
			today: 'Hoy',
			clear: 'Borrar',
			cancel: 'Cancelar',
			weekdaysAbbrev: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
			formatSubmit: 'yyyy/mm/dd'
		}
	});
	calcularColumnas();
});

function calcularColumnas() {
	let columnaIzquierda = $('#columna-izquierda');
	let columnaDerecha = $('#columna-derecha');

	if(columnaDerecha.height() > columnaIzquierda.height()){
		columnaIzquierda.removeClass('borde-derecho');
		columnaDerecha.addClass('borde-izquierdo');
	} else {
		columnaDerecha.removeClass('borde-izquierdo');
		columnaIzquierda.addClass('borde-derecho');
	}
}

function calcularLateral() {
	$('.lateral').height($('.principal').height() + $('header').height() + $('footer').height());
}