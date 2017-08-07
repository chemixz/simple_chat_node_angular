var models = require('./models'),
		Schema = models.Schema;


var roomSchema = Schema({
		name: String,
});


var chatRooms = models.model('chatrooms', roomSchema);

module.exports = chatRooms