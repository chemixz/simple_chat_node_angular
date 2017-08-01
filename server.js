var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json() );
app.use(express.static('public'));

var UserController = require('./server/controllers/UserController');
var MessageController = require('./server/controllers/MessageController');

app.post('/signingup', UserController.saveOrGetUser);
app.post('/sendMsg', MessageController.sendMsg);
app.get('/messages', MessageController.getMessages);

app.get('/',function(req,res){
	res.sendFile(__dirname+'/chat.html')
})
app.get('/login',function(req,res){
	res.sendFile(__dirname+'/login.html')
})


var io = require('socket.io').listen(app.listen(3000, function(){
		console.log("Servidor Chat port 3000")
}))


io.on('connect', function(socket){
	console.log("el usuario con id"+socket.id+"se ha conectado");

	socket.on('actionSendMsg',function(data){
		console.log("desde server data es", data);
		socket.broadcast.emit("actionReceiver", data);
	})
})