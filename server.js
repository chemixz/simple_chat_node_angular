var express = require("express");

var bodyParser = require("body-parser");
var cookieSession = require("cookie-session");
var session_middleware = require("./server/middlewares/session"); // middleware para validar session em rutas

var http = require("http"); // socket io tiene q ser una instancia de http
var realtime = require("./realtime");
var app = express();
var server = http.Server(app); // nuevo servidor para pasar app expres en server 
 //Comtrollers
var UserController = require('./server/controllers/UserController');
var MessageController = require('./server/controllers/MessageController');
var RoomsController = require('./server/controllers/RoomsController');

// models
// var User = require('./server/models/User');

app.use(bodyParser.json()); // sirve para leer parametros de peticion json,

app.use(bodyParser.urlencoded({extended: true})); // parametros normal // si es falso no parse arreglos objetos // si es true permite parsear arreglos objetos 
app.use(express.static('public'));
// app.use(cookieSession({
// 	name: "session",
// 	keys: ["watasiwakiniro","anatawamiko"]
// })); //para manear las cookies
var cSession = cookieSession({
	name: "session",
	keys: ["watasiwakiniro","anatawamiko"]
});
realtime(server,cSession); 
app.use(cSession); 


app.engine('html', require('pug').renderFile);

app.set('view engine', 'html');


app.use("/chat",session_middleware); // valido la session cuando entro a la ruta 

app.get("/",function(req,res){
	// res.sendFile(__dirname+'/login.html')
	res.redirect("/login")
})
app.get("/login",function(req,res){
	res.render("signin" , {title: "Logearse"});
})

app.get("/signup",function(req,res){
	// res.sendFile(__dirname+'/login.html')
	res.render("signup" , {title: "Registrarse"});
})
app.get("/chat",function(req,res){
	// res.sendFile(__dirname+'/chat.html')
	res.render("chat" , {title: "Chat Chemixz" , user: req.session.current_user });
})


app.post('/signin', UserController.signin); 
app.post('/signup', UserController.signup);
app.post("/sendMsg", MessageController.sendMsg);
app.post("/joinToRoom",RoomsController.joinToRoom);

app.get("/messages", MessageController.getMessages);
app.get("/rooms", RoomsController.getRooms);
app.get("/signout",function(req,res){
	console.log("desconectando")
	req.session.current_user = undefined;
	req.session.current_channel = undefined;
	res.send({
		retStatus: 'Success',
		redirectTo: "/",
		msg: "go there"
	});
});


server.listen(3000,function(){ 
 	console.log("Corriendo caht  port 3000");
});

// var io = require('socket.io').listen(app.listen(3000, function(){
// 		console.log("Servidor Chat port 3000")
// }))


