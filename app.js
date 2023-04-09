if(process.env.NODE_ENV != "production") {
    require('dotenv').config();

 }//also npm i dotenv

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash')

const Review = require('./models/review')
const catchAsync = require('./utils/catchasync');
const Campground = require('./models/campground');
const expressError = require('./utils/expresserror');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');//it is used to show the same boiler plate on all the pages just like partials 
app.engine('ejs', ejsMate);//ALSO NEEDS TO  NPM I EJS-MATE
const campgroundRoute = require('./routes/campground');
const reviewRoute = require('./routes/review');
const userRoute = require('./routes/user');
const session = require('express-session')
const passport = require('passport');
const localstrategy = require('passport-local')
const User = require('./models/user');
const { ref } = require('joi');
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.dbUrl






const sessionConfig = {
    secret:"Thisisagoodbigsecret",
    resave:false,
    saveUninitialised:true,
    cookies:{
        expires: Date.now() + 1000 * 60 * 60 * 24,//this used to expire user session with this given time so that the user dont stay logged in for a long time
        httpOnly:true//this is used so that the cookies can't be opend on the client side in a scripted form
    }

}




app.use(session(sessionConfig))
app.use(flash())
app.use(mongoSanitize());

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(passport.initialize())//this is going to start the passport 

//this session is to keep the session logged in 
app.use(passport.session())//always use this after our express session  defined above
passport.use(new localstrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    dbName: 'yelp-camp',
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false}).
then((res)=> {
    console.log('connected to database'); 
    // console.log(res);
}).catch(err =>{
    console.log('OHHH NO ERROR CONNECTING DATABSE')
    console.log(err);
    
})
mongoose.set('strictQuery', true);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use((req,res,next)=>{//we use this middlewear so that we can use this message in all our below router
    console.log(req.query)
    res.locals.currentUser = req.session.user;
    res.locals.success = req.flash('success')//whatever we  put inside res.local have access in all the templates
    res.locals.error = req.flash('error')
    
    next()
})//after this puhe <%suuccess%> like this in our template



app.get('/',(req,res)=>{
    console.log(dbUrl)
    res.render('home')
})






app.use(express.urlencoded({extended : true}))//it is used to parse req.body without this req.body wii be empty
app.use(methodOverride('_method'))


app.use('/campgrounds', campgroundRoute)
app.use('/campgrounds/:id/review', reviewRoute)
app.use('/', userRoute);
app.use(express.static(path.join(__dirname, 'public')))


// app.all('*', (req,res,next)=>{
//     throw new expressError('Not Found', 400)
// })


app.use((err,req,res,next)=>{
    const{statusCode = 500, message = 'Something went wrong'} = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', {err})
})

app.listen(2000, (req,res)=>{
    console.log("connected to port 2000!!")

})

