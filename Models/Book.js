var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var BookSchema=new Schema({
    Title:{type: String, index: true},
    Author:{type: String, unique: true,index: true},
    Category:{type: String, index: true},
   	createdAt: {type: Date, index: true,default: Date.now}
});

module.exports=mongoose.model('Book',BookSchema);
