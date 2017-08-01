var Message = require('../models/Message');


exports.sendMsg = function(req,res){
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
	Message.find()
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