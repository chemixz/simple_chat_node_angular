var User = require('../models/User');

exports.saveOrGetUser = function(req,res){
	console.log("desde servidor ctr user", req.body.userData);
	User.findOne({nickname: req.body.userData.nickname})
	.exec(function(err,user){
		if (!err)
		{	
			// console.log("haber que encontramos", user);
			if (!user)
			{
				// console.log("usuario no existe");
				new User(req.body.userData)
				.save(function(err,user){
					if (!err)
					{
						console.log("usuario creado");
						res.send(user)
					}
				})
			}
			else
			{
				res.send(user)
			}	
		}
		else
		{
			console.log(err);
		}
	})
}