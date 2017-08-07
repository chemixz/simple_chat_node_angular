var models = require('./models'),
		Schema = models.Schema;

var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ , "Coloca un email vlaido" ];

var userSchema = Schema({
		nickname: {type: String,  required: "Nickname requerido" },
		email:{ type:String , required: "Correo Requerido" , match: email_match  },
		password:{type: String , minlength:[6 , "Password minimo 6 caracteres"] , required: "Password requerido"},
});


var User = models.model('User', userSchema);

module.exports = User