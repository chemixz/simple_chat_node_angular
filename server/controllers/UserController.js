var User = require('../models/User');
// exports.saveOrGetUser = function(req,res){
// 	// console.log("ctr enviado datos al ervidor ", req.body.userData);
// 	User.findOne({nickname: req.body.userData.nickname})
// 	.exec(function(err,user){
// 		if (!err)
// 		{	
// 			// console.log("haber que encontramos", user);
// 			if (!user)
// 			{
// 				// console.log("usuario no existe");
// 				new User(req.body.userData)
// 				.save(function(err,user){
// 					if (!err)
// 					{
// 						console.log("usuario creado");
// 						res.send(user)
// 					}
// 				})
// 			}
// 			else
// 			{
// 				res.send(user)
// 			}	
// 		}
// 		else
// 		{
// 			res.send(err);
// 		}
// 	})
// }

exports.signin = function(req,res){
	User.findOne({email: req.body.userData.email})
	.exec(function(err,user){
		if (!err)
		{	
			// console.log("desde login encontramos", user);
			if (user)
			{
				req.session.current_user = user;
				console.log("ctr user encontramos session", req.session);
				res.send({
					retStatus: 'Success',
					redirectTo: "/chat",
					current_user:req.session.current_user,
				});
			}
			else{
				res.send({
					retStatus: 'Warning',
					redirectTo: "/",
					msg: "Usuario no encontrado",
				});
			}
			
		}
		else
		{
			res.send(err);
		}
	})
	
}

exports.signup = function(req,res){
	User.findOne({email: req.body.userData.email})
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
						res.send({
							retStatus: 'Success',
							redirectTo: "/",
							msg: "usuario Creado",
						});
					}
					else
					{
						res.send(err)
					}
				})
			}
			else
			{
				res.send({
					retStatus: 'Warning',
					error: "Usuario ya existe",
				});
			}	
		}
		else
		{
			res.send(err);
		}
	})
}