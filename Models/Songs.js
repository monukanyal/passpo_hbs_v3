var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var SongSchema=new Schema({
    Title:{type: String, index: true},
    filepath:{type: String, unique: true,index: true},
    Category:{type: String, index: true},
   	createdAt: {type: Date, index: true,default: Date.now}
});

module.exports=mongoose.model('Songs',SongSchema);