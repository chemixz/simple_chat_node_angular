module.exports = function(server,sessionIo){
	var io = require("socket.io")(server);
	var connectedClients = [];
	var userList = [];
	var userSize= 0;
 	
	// function createUserList()
	// {
	// 	userList = [];
	//   var i = 0;
	// 	 for(var client in connectedClients)
	// 	 {    

	// 	  	userList[i] = {
	// 	  		"nickname" : connectedClients[client].userClient.nickname,
	// 	  		channel: connectedClients[client].userClient.channel,
	// 	  	};
 				
	// 	    i++;
	// 	 }
	// 	 // console.log("cantidad de usuarios es "+userList.length , userList);
	// }

	function getUserInRoom(sockets){
		var usersInRoom =[] , i=0;
		if (sockets)
		{
			console.log("OBTENIENDO FROM GET USERS -->",sockets)
			for(var client in sockets.sockets)
			{
				usersInRoom[i] ={
			  	"nickname" : connectedClients[client].userClient.nickname,
			  		channel: connectedClients[client].userClient.channel,
			  };
			  i++;
			}
			
		}
		return usersInRoom;
		
	}

	io.use(function(socket,next){
		sessionIo(socket.request, socket.request.res, next)
		// configuramos para que utilice la misma session cn express
	})
	var onchat = io.of('/chat');
	var onlogin = io.of('/login');

 	onlogin.on('connect', function(socket){
			// console.log(" algien en login ");
	})

	onchat.on('connect', function(socket){
		var channel = null;
		connectedClients[socket.id] = {}; 
 		connectedClients[socket.id].socket = socket;

 		if (!connectedClients[socket.id].userClient)
 		{
 				connectedClients[socket.id].userClient = {
				_id: socket.request.session.current_user._id,
				nickname: socket.request.session.current_user.nickname,
				email: socket.request.session.current_user.email,
				channel: socket.request.session.current_user.current_channel
			}
 		}
		// console.log(" se ha conectado  ---> " , connectedClients.length);
	
		
		socket.on('joinToRoom',function(data)
		{
			var channel = data.current_user.current_channel;
			var clientsInRoom = [];
			if (connectedClients[socket.id].userClient.channel)
			{
				console.log("si tiene anterior canal",connectedClients[socket.id].userClient.channel)
				clientsInRoom = [];
				var oldChannel = connectedClients[socket.id].userClient.channel;
				socket.leave(oldChannel._id);
				if (onchat.adapter.rooms[oldChannel._id])
				{
					clientsInRoom = getUserInRoom( onchat.adapter.rooms[oldChannel._id] )
					onchat.to(oldChannel._id).emit('usersOnline',clientsInRoom);
				}
				console.log("usuarios ene el anterior canal ---->" , onchat.adapter.rooms[oldChannel._id]);
			}
			
			socket.join(channel._id);
			console.log("Usuario entra al canal"+channel.name+"-->",connectedClients[socket.id].socket.id)
			var tempdata = {
				user: socket.request.session.current_user,
				text: "Se ha unido a esta sala",
				fecha: Date.now
			}
			socket.request.session.current_user.current_channel = channel;
			connectedClients[socket.id].userClient.channel = channel;
			// emito un msj de quien se ha conectado a un canal
		
			clientsInRoom = [];
			clientsInRoom = getUserInRoom(onchat.adapter.rooms[channel._id] )
			console.log("todos los clientes conectados",clientsInRoom )
			socket.broadcast.to(channel._id).emit('actionReceiver',tempdata);
			onchat.to(channel._id).emit('usersOnline',clientsInRoom);
			
			
		})
		socket.on('sendMsgToRoom', function( msg){
			// console.log("la room "+msg.chatrooms+" el msj ", msg.text);
			socket.broadcast.to(msg.chatrooms).emit('actionReceiver',msg);
		});

		socket.on('disconnect', function(){

			var tempUser = connectedClients[socket.id].userClient;
	    delete connectedClients[socket.id];
	    // console.log("mostrando temp",tempUser)
			console.log("Se ha desconectado" , tempUser.userClient);
	    if (tempUser.channel)
	    {
	    	clientsInRoom = [];
				clientsInRoom = getUserInRoom( onchat.adapter.rooms[tempUser.channel._id] )
				socket.broadcast.to(tempUser.channel._id).emit('usersOnline',clientsInRoom);
	    }

		});
	})

}



