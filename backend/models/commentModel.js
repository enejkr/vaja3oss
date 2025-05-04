var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var commentSchema = new Schema({
	'title' : String,
	'content' : String,
	'belongsTo': { type: mongoose.Schema.Types.ObjectId, ref: 'user' }

});

module.exports = mongoose.model('comment', commentSchema);
