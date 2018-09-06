const express = require('express');
const Controller = require('./JS/Controller');
const bodyParser = require('body-parser');
const API = require('./JS/API');

const app = express();

const __PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('case sensitive routing', true);

app.use(express.static(__dirname + '/Public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// ------ RUTAS DE LA API ------ //

app.get('/api/grados', API.getGrados);
app.post('/api/grado', API.postGrado);
app.get('/api/grado', API.getGrado);
app.put('/api/grado', API.putGrado);

app.get('/api/estados', API.getEstados);
app.post('/api/estado', API.postEstado);
app.get('/api/estado', API.getEstado);
app.put('/api/estado', API.putEstado);

app.get('/api/cargos', API.getCargos);
app.post('/api/cargo', API.postCargo);
app.get('/api/cargo', API.getCargo);
app.put('/api/cargo', API.putCargo);

app.get('/api/clasificaciones', API.getClasificaciones);
app.post('/api/clasificacion', API.postClasificacion);
app.get('/api/clasificacion', API.getClasificacion);
app.put('/api/clasificacion', API.putClasificacion);

// ------ FIN DE LAS RUTAS DE LA API ------ //

app.get('/Administrar/Cargos', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Administrar/Cargos' Desde: '${req.connection.remoteAddress}'`);
	res.render('cargos');
});

app.get('/Administrar/Clasificaciones', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Administrar/Clasificacion' Desde: '${req.connection.remoteAddress}'`);
	res.render('clasificaciones');
});

app.get('/Administrar/Estados', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Administrar/Estados' Desde: '${req.connection.remoteAddress}'`);
	res.render('estados');
});

app.get('/Administrar/Grados', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Administrar/Grados' Desde: '${req.connection.remoteAddress}'`);
	res.render('grados');
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

app.get('/Registrar/Componente', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Registrar/Componente' Desde: '${req.connection.remoteAddress}'`);
	res.render('nuevoComponente');
});

app.get('/Registrar/Personal/Civil', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Registrar/Personal/Civil' Desde: '${req.connection.remoteAddress}'`);
	res.render('nuevoCivil');
});

app.get('/Registrar/Personal/Militar', (req, res)=>{
	console.log(`[ Nueva Conexión ] Hacia: '/Registrar/Personal/Militar' Desde: '${req.connection.remoteAddress}'`);
	res.render('nuevoMilitar');
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

app.post('/test/:status', (req, res)=>{
	res.sendStatus(req.params.status);
});

app.listen(__PORT, (err)=>{
	console.log(`[ ÉXITO ] Servidor corriendo en el puerto ${__PORT}`);
});