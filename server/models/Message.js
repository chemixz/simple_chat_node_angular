var models = require('./models'),
		Schema = models.Schema;


var messagechema = Schema({
		text: String,
		fecha: {type: Date, default: Date.now},
		user: {type: Schema.ObjectId, ref: 'User'},
		chatrooms: {type: Schema.ObjectId, ref: 'chatRooms'}
});


var Message = models.model('Message', messagechema);

module.exports = Message