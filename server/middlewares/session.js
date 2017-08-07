var User = require('../models/User'); // .User es apara solo obtener el User
var searchFields = "_id , nickname , email " ;


module.exports = function(req,res,next){
	
	

	if(!req.session.current_user){
		console.log("middleware redireccionando al login ",req.session.current_user);
		res.redirect("/");
	}
	else
	{
		console.log("desde middleware session buscando a:",req.session.current_user );
		// buscamos al usuario para 
		User.findById(req.session.current_user._id , searchFields , function(err,user) {
			// console.log("desde middleware Session", user)
			if (err)
			{
				console.log("session: no encontrado user");
				console.log(err);
				res.redirect("/");
			}
			else
			{
				console.log("desde session lo encontro", user)
				res.locals =  {current_user: user} // esto hacer merge al locals , no sobre escribe
				next();
			}
		});
	}
}