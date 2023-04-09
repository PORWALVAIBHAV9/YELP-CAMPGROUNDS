const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt')
const session = require('express-session')


mongoose.connect('mongodb://127.0.0.1:27017/authdemo').
then((res)=> {
    console.log('connected to database'); 
    // console.log(res);
}).catch(err =>{
    console.log('OHHH NO ERROR CONNECTING DATABSE')
    console.log(err);
    
})
mongoose.set('strictQuery', true);


app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.urlencoded({extended:true}));
app.use(session({secret:'itsabigloginsecret'}))

app.get('/', (req,res)=>{
    res.send('This is your homepage')

})


app.get('/register', (req,res)=>{
    res.render('register')

})

app.post('/registerme',async(req,res)=>{
    const {username, password} = req.body;
    const hashpsd = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password:hashpsd
    })
    req.session.userid = user._id

    await user.save();
    res.redirect('/secretloggedin')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/loginme', async (req,res)=>{
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const chkpassword = await bcrypt.compare(password, user.password);
    if(chkpassword){
        req.session.userid = user._id//1st step---here the login is if the password is correct we are storing user id in the session cookie 
        res.redirect('/secretloggedin')
    }
    else{
        res.redirect('/login')
    }
})





app.get('/secretloggedin', (req,res)=>{
    if(!req.session.userid){//we took id as later we could nedd id to refer the user post and other details
        res.redirect('/login')

    }
    else{
        res.render('secret')
    }
})

app.post('/logout', (req,res)=>{
    // req.session.userid = null;//this is a option but dont use it is not working properly
    req.session.destroy();
    res.redirect('/login');
})



app.listen(3010, (req,res)=>{
    console.log('Connected to the app')
})