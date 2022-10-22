//Importe los módulos
/* var resultado = require('./database/db'); */
const express = require("express");
const app = express();
const puerto = 5000;

//Para poder capturar los datos del formulario (sin urlencoded nos devuelve "undefined")
app.use(express.urlencoded({extended:false}));
app.use(express.json());
//Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'})
//Configuramos el directorio de assets
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));
//Establecemos el motor de plantillas
app.set('view engine', 'ejs')
//Invocamos a bcrypt
const bcryptjs = require ('bcryptjs');

//Consulta optimizada
const mysql = require('mysql2');
//Crear conexión
const connection = mysql.createConnection({
    host             : 'localhost',
    port             : '3306',
    user             : 'root',
    password         : '123456789',
    database         : 'videoclub',
});

//Variables de sesión
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized:true
}));  




//Atención de la solicitud
app.get('/', async function(req,res){
    async function Leer(){ //Función asincrona
        var memoria=[];
        await( //Espere
            resultado
            .then((value) => {res.send(value);})
            .catch((err)  => {console.log(err);})
        );
        return memoria;
    }
    Leer(); //Ejecutar la función
});

/* app.get('/home', (req, res)=>{
    res.render('home');
}) */

//Establecemos las rutas
app.get('/login', (req, res)=>{
    res.render('login');
})
app.get('/register', (req, res)=>{
    res.render('register');
})
app.get('/peliculas', (req, res)=>{
    res.render('peliculas');
})
app.get('/copias', (req, res)=>{
    res.render('copias');
})
app.get('/prestamos', (req, res)=>{
    res.render('prestamos');
})

//Registro
 app.post('/register', async(req, res)=>{
    const dni = req.body.dni;
    const nombre = req.body.nombre;
    const apellido1 = req.body.apellido1;
    const apellido2 = req.body.apellido2;
    const direccion = req.body.direccion;
    const email = req.body.email;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO clientes SET ?', {dni:dni, nombre:nombre, apellido1:apellido1, apellido2:apellido2, direccion:direccion, email:email, pass:passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('register', {
                alert: true,
                alertTitle: "Registro",
                alertMessage: "¡Registrado con exito!",
                alertIcon: 'success',
                showConfirmButton:false,
                timer:1500,
                ruta:'login'
            })
        }
    })
})

//Prestamos
app.post('/prestamos', async(req, res)=>{
    const fecha_prestamo = req.body.fecha_prestamo;
    const fecha_entrega = req.body.fecha_entrega;
    const fecha_tope = req.body.fecha_tope;
    const cod_cliente = req.body.cod_cliente;
    const n_copia = req.body.n_copia;

    connection.query('INSERT INTO prestamos SET ?', {fecha_prestamo:fecha_prestamo, fecha_entrega:fecha_entrega, fecha_tope:fecha_tope}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('prestamos', {
                alert: true,
                alertTitle: "Prestamo",
                alertMessage: "¡El prestamo se ha hecho con exito!",
                alertIcon: 'success',
                showConfirmButton:false,
                timer:1500,
                ruta:'home'
            })
        }
    })
})



//Autenticación
app.post('/auth', async(req, res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query('SELECT * FROM clientes WHERE email = ?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Correo y/o contraseña incorrectas",
                    alertIcon:'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'    
                });  
            }else{
                //creamos una var de session y le asignamos true si INICIO SESSION       
				req.session.loggedin = true;                
				req.session.name = results[0].nombre;
				res.render('login', {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡LOGIN CORRECTO!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: 'home'
				}); 
            }
            res.end();
        });
    } else {	
		res.send('Por favor ingrese el correo y la contraseña');
		res.end();
	}
});
//Método para controlar que está auth en todas las páginas
app.get('/home', (req, res)=> {
	if (req.session.loggedin) {
		res.render('home',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('home',{
			login:false,
			name:'Debes iniciar sesión',			
		});				
	}
	res.end();
});
//LogOUT - Destruye la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/login') // siempre se ejecutará después de que se destruya la sesión
	})
});

//Oyente
app.listen(puerto, (req, res)=>{
    console.log('SERVIDOR CORRIENDO EN http://localhost:5000/login');
})
