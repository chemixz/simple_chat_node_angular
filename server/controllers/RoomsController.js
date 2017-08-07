var chatRooms = require('../models/chatRooms');


// exports.getRooms = function(req,res){
// 	chatRooms.find()
// 	.exec(function(err,rooms){
// 		if (!err)
// 		{
// 			console.log("room encontradas",rooms);
// 			res.send(rooms)
// 		}
// 		else
// 		{
// 			console.log(err);
// 		}
// 	})
// }

exports.joinToRoom = function(req,res){
	req.session.current_user.current_channel = req.body.roomData;
	res.send(req.session);
}
exports.getRooms = function(req,res){
	chatRooms.find({},function(err,rooms){
			// console.log("room encontradas",rooms);
			res.send(rooms)
	})
}