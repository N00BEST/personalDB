$(document).ready(()=>{
	$('#imagen').change(precargarImagen);
});

function precargarImagen(evt){
	let input = evt.target;
	//Verificar si hay un archivo seleccionado
	if(input.files && input.files[0]){ 
		let lector = new FileReader();
		lector.onload = (data)=>{
			let image = $('img#preview');
			image.attr("src", data.target.result);
		}
		lector.readAsDataURL(input.files[0]);
	} else {
		console.log('No hay archivo seleccionado');
	}
}