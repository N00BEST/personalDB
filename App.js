const express = require('express');
const Controller = require('./JS/Controller');
const bodyParser = require('body-parser');

const app = express();

const __PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('case sensitive routing', true);

app.use(express.static(__dirname + '/Public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/Administrar/Cargos', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Administrar/Cargos' Desde: '${req.connection.remoteAddress}'`);
	res.render('nuevoCargo.ejs');
});

app.get('/Componente/:nombre', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Componente/${req.params.nombre}' Desde: '${req.connection.remoteAddress}'`);
	res.render('detallesComponente');
});

app.get('/Personal', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Personal' Desde: '${req.connection.remoteAddress}'`);
	Controller.personal(req, res);
});

app.get('/Personal/:cedula', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Personal/${req.params.cedula}' Desde: '${req.connection.remoteAddress}'`);
	res.render('detallesPersonal');
});

app.get('/Registrar/Personal', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Registrar/Personal' Desde: '${req.connection.remoteAddress}'`);
	res.render('nuevoPersonal');
});

app.get('/Registrar/Unidad', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Registrar/Personal' Desde: '${req.connection.remoteAddress}'`);
	res.render('nuevaUnidad');
});

app.get('/Unidades', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Unidades' Desde: '${req.connection.remoteAddress}'`);
	res.render('unidades');
});

app.get('/Unidad/:abreviacion', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Unidad/${req.params.abreviacion}' Desde: '${req.connection.remoteAddress}'`);
	res.render('detallesUnidad');
});


app.listen(__PORT, ()=>{
	console.log(`[ ÉXITO ] Servidor corriendo en el puerto ${__PORT}`);
});