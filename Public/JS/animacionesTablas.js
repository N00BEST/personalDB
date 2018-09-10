function cerrar(fila, valores) {
	//Animación para colapsar una fila de una tabla. 
	//La animación tarda velocidad + delay ms en completarse.
	return new Promise ((resolve, reject)=>{
		if(typeof valores === 'undefined'){
			//Si es la primera vez que se llama a la función
			//Aquí se fija la cantidad de veces que se repetirá la función
			//Brindando el tiempo total que durará la animación
			let velocidad = 15;
			//Tiempo que tardará la animación en empezar
			let delay = 10; 
			setTimeout(()=>{
				//Calcular cuánto hay que reducir el tr en cada iteración.
				let distancia = $(fila).height()/velocidad;
				//Modificar la altura actual
				let altura = $(fila).height() - distancia; 
				//Setear los valores de referencia para las otras iteraciones
				valores = {
					altura: altura,
					distancia: distancia
				}
				//Añadir clase 'fila-eliminar' para poder manejar libremente el 
				//tamaño de la fila.
				$(fila).addClass('fila-eliminar');
				//Modificar el tamaño de la fila con el nuevo tamaño
				$(fila).height(altura);
				//Llamar a la función recursivamente
				setTimeout(()=>{ cerrar(fila, valores).then(()=>{
					resolve();
				}); }, 1);
			}, delay);
		} else {
			if(valores.altura > 0) {
				let distancia = valores.distancia;
				let altura = valores.altura - distancia; 
				valores = {
					altura: altura,
					distancia: distancia
				}
				if($(fila).css('font-size') && valores.altura <= parseFloat($(fila).css('font-size'))){
					//Si es necesario quitar el texto interno a la tr
					//Se retira para poder manipular la fila
					$(fila).children().text('');
				}
				$(fila).height(altura);
				setTimeout(()=>{ 
					cerrar(fila, valores).then(()=>{
						resolve(); 
					}); 
				}, 1);
			} else {
				//Al haber alcanzado el tamaño 0 o un tamaño negativo
				//Se retira la fila de la tabla
				$(fila).remove();
				resolve();
			}
		}
	});
}

function abrir(tabla, fila, fondo, slow) {
	setTimeout(()=>{
		if(tabla) {
			tabla.prepend(fila);
		}
		$(fila).removeClass('animar slow');
		$(fila).addClass(fondo);
		calcularLateral();
		setTimeout(()=>{
			$(fila).addClass('animar ' + (slow ? 'slow' : ''));
			$(fila).removeClass(fondo);
			$(fila).removeClass('animar slow');
		}, 500);
	});
}

function crearFila(columnas) {
	if(isNaN(columnas)) {
		throw new Error('Columnas debe ser un número');
	} else {
		columnas = parseInt(columnas);
		let fila = document.createElement('tr');
		for(let i = 0; i < columnas; i++){
			let columna = document.createElement('td');
			let divisor = document.createElement('td');
			divisor.className = 'divisor';
			columna.id = i + 1;

			$(fila).append(columna, divisor);
		}

		$(fila).children().last().remove();

		return fila;
	}
}