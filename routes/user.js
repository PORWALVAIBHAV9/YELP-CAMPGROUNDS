const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchasync')
const passport = require('passport')

router.get('/register', (req,res)=>{
    res.render('user/register')
})

router.get('/login', (req,res)=>{
    res.render('user/login')
})

router.post('/register', catchAsync(async(req,res)=>{//we are also using try&catch as the catchasycn is taking to the new page template which is looking strange
    try{const {username, password, email} = req.body;
    const user = new User({username, email});//if any user with same userrname will try to register passport will thow err to make unique username
    const registeruser = await User.register(user, password);
    req.login(registeruser,function(err) {//it is used to keep person logged in after regitering account
        if (err) { return next(err); 
    } 
    req.flash('success', 'User successfully registered');
    console.log(registeruser);
    res.redirect('/campgrounds');})
}
    catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }

}))

//keep session will be used to pass the url to session to redirect the same page
router.post('/login', passport.authenticate('local', { failureFlash:true, failureRedirect:'/login',keepSessionInfo:true}), async(req,res)=>{
    req.flash('success', 'Loggedin');
    const {username} = req.body;
    const navuser = await User.findOne({username: username})
    console.log(navuser)//thhis is for showing and hiding login logout button after this we are refering it in app.use middleware check it in app.js
    req.session.user = navuser;
    const redirecturl = req.session.returnTo || '/campgrounds';//this is to redirect the same page  user is trying to reach if not logged in 
    res.redirect(redirecturl)
})

router.get('/logout', (req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); 
    }
    req.flash('success' , 'Successfully logged out')
    res.redirect('/campgrounds')})

})

module.exports = router;