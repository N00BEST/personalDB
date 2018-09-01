const express = require('express');
const Controller = require('./JS/Controller');

const app = express();

const __PORT = process.env.PORT || 8000;



app.set('view engine', 'ejs');
app.set('case sensitive routing', true);

app.use(express.static(__dirname + '/Public/'));

app.get('/Personal', (req, res)=>{
	Controller.personal(req, res);
});

app.get('/Personal/:cedula', (req, res)=>{
	res.render('detallesPersonal');
});

app.get('/Registrar/Personal', (req, res)=>{
	res.render('nuevoPersonal');
});


app.listen(__PORT, ()=>{
	console.log(`[ ÉXITO ] Servidor corriendo en el puerto ${__PORT}`);
});