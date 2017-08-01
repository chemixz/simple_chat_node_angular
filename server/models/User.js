var models = require('./models'),
		Schema = models.Schema;


var userSchema = Schema({
		nickname: {type: String,  required: "Nombre requerido" ,}
});


var User = models.model('User', userSchema);

module.exports = User