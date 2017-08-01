var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chatChemixz');
var db = mongoose.connection;
		db.on('error', console.error.bind(console , 'Error de conexion'));
		db.once('open',function callback(){
			console.log('conectado a bd chatChemixz');
		})

module.exports = mongoose;