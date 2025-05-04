var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'name' : String,
	'description' : String,
	'path' : String,
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'views' : Number,
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
});

module.exports = mongoose.model('photo', photoSchema);
