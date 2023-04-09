const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose');



const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})



userSchema.plugin(passportlocalmongoose)//this is going to add username and password to our schema and some other methods
 

module.exports = mongoose.model('User', userSchema);
