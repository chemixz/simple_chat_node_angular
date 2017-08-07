var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cookieSession = require("cookie-session");
var session_middleware = require("./server/middlewares/session"); // middleware para validar session em rutas
 
 //Comtrollers
var UserController = require('./server/controllers/UserController');
var MessageController = require('./server/controllers/MessageController');
var RoomsController = require('./server/controllers/RoomsController');

// models
// var User = require('./server/models/User');


app.use(bodyParser.json()); // sirve para leer parametros de peticion json,

app.use(bodyParser.urlencoded({extended: true})); // parametros normal // si es falso no parse arreglos objetos // si es true permite parsear arreglos objetos 
app.use(express.static('public'));
app.use(cookieSession({
	name: "session",
	keys: ["llave-1","llave-2"]
})); //para manear las cookies
app.engine('html', require('pug').renderFile);

app.set('view engine', 'html');


app.use("/chat",session_middleware); // valido la session cuando entro a la ruta 

app.get("/",function(req,res){
	// res.sendFile(__dirname+'/login.html')
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
app.get("/messages", MessageController.getMessages);
app.post("/joinToRoom",RoomsController.joinToRoom);
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




var io = require('socket.io').listen(app.listen(3000, function(){
		console.log("Servidor Chat port 3000")
}))


io.on('connect', function(socket){
	var channel = null;
	// console.log("el usuario con id"+socket.id+"se ha conectado");

	// socket.on('actionSendMsg',function(data){
	// 	console.log("recibiendo por socket actionSendMsg", data);
	// 	socket.broadcast.emit("actionReceiver", data);
	// })
	socket.on('joinToRoom',function(data){
		channel = data.current_user.current_channel;
		socket.join(channel._id);
		var tempdata = {
			user: data.current_user,
			text: "Se ha unido a esta sala",
			fecha: Date.now
		}
		socket.broadcast.to(channel._id).emit('actionReceiver',tempdata);
		
	})
	socket.on('sendMsgToRoom', function( msg){
		console.log("la room"+msg.chatrooms+"el msj", msg.text);
		socket.broadcast.to(msg.chatrooms).emit('actionReceiver',msg);
	});

	socket.on('disconnect', function(){
		console.log("alguien se ha desconectado", socket)
	});
})