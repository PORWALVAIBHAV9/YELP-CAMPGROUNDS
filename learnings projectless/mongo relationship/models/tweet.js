const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/relationshipDB').
then((res)=> {
    console.log('connected to database');
    console.log(res);
}).catch(err =>{
    console.log('OHHH NO ERROR CONNECTING DATABSE')
    console.log(err);
    
})

const tweetSchema = new mongoose.Schema({
    text:String,
    likes:Number,
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User'}

})

const userSchema = new mongoose.Schema({
    username:String,
    age:Number,
})

const Tweet = mongoose.model('Tweet', tweetSchema);
const User = mongoose.model('User', userSchema);


// const makeTweet = async()=>{
//     const t1 =  new Tweet({text:'Im here to asssist you boy', likes:55})
//     const u1 = new User({name:'vaibhav', age:22});
//     t1.user = u1;
    
//     await t1.save()
//     await u1.save()

// }


const makeTweet = async()=>{
    const u = await User.findOne({})
    const t2 =  new Tweet({text:'everyone here is looking good', likes:56})
    t2.user = u;
    t2.save()
}

const findtweet = async()=>{
    const t = await Tweet.findOne({}).populate('user')
    console.log(t);

}

makeTweet();
findtweet();