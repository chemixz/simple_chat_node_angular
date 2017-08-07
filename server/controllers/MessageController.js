var Message = require('../models/Message');


exports.sendMsg = function(req,res){
	console.log("el mensaje es",req.body.msgData)
	new Message(req.body.msgData)
	.save(function(err, msg){
		if (!err)
		{
			msg.populate('user',function(err,msg){
				if (!err)
				{
					res.send(msg);
				}
			});
			
		}
		else
		{
			console.log(err);
		}
	});
}

exports.getMessages = function(req,res){

	Message.find({ chatrooms: req.session.current_user.current_channel})
	.sort({fecha: 'asc'})
	.populate('user')
	.exec(function(err,msgs){
		if (!err)
		{
			res.send(msgs)
		}
		else
		{
			console.log(err);
		}
	})
}