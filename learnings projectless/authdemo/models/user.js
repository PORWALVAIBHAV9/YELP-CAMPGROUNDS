const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'username cannot be empty']

    },
    password:{
        type:String,
        required:[true, 'password is must']
    }
})


module.exports = mongoose.model('User', userSchema);