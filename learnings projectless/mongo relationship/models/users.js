      const { kStringMaxLength } = require('buffer');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/relationshipDB').
then((res)=> {
    console.log('connected to database');
    console.log(res);
}).catch(err =>{
    console.log('OHHH NO ERROR CONNECTING DATABSE')
    console.log(err);
    
})
 

const userSchema = new mongoose.Schema(
    {
        first:String,
        last:String,
        address:[
            {
                street:String,
                city:String,
                state:String,
                country:String,


            }
        ]
    }
)


const User = mongoose.model('User', userSchema);
const newuser  = async()=>{
    const u = new User({
        first:'vaibhav',
        last:'porwal',
        // address:{
        //     street:'mahatma gandhi marg',
        //     city:'ujjain',
        //     state:'madhya pradesh',
        //     country:'india',
        // }
    })
    u.address.push({
            street:'sandesh marg',
            city:'indore',
            state:'madhya pradesh',
            country:'india',
        })
    const save = await u.save();
    
    const u2 = new User({
        first:'nilesh',
        last:'rathod',})
    u2.address.push({
            // _id:{id:false},
            street:'jeevan marg',
            city:'bhopal',
            state:'madhya pradesh',
            country:'india',
        })
    const save2 = await u2.save();

    await User.deleteMany({})
    }
    // const addadress = async(id)=>{
    //     const user = db.findById(id);
    //     user.address.push({})//to add address

    // }

    newuser();

