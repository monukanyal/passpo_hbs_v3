var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var OrderSchema=new Schema({
    user_id:{type: String, index: true},
    Transaction_id:{type: String, unique: true,index: true},
    state:{type: String, index: true},
   	createdAt: {type: Date, index: true,default: Date.now}
});

module.exports=mongoose.model('order',OrderSchema);