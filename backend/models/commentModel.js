var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var commentSchema = new Schema({
	'title' : String,
	'content' : String,
	'user': { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	'uploaded' : Date,


});

module.exports = mongoose.model('comment', commentSchema);
