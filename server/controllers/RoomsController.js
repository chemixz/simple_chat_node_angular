var chatRooms = require('../models/chatRooms');


exports.joinToRoom = function(req,res){
	req.session.current_user.current_channel = req.body.roomData;
	res.send({
		current_user:{
			_id: req.session.current_user._id,
			nickname: req.session.current_user.nickname,
			email: req.session.current_user.email,
			current_channel: req.body.roomData
		}
	});
}
exports.getRooms = function(req,res){
	chatRooms.find({},function(err,rooms){
			// console.log("room encontradas",rooms);
			res.send(rooms)
	})
}