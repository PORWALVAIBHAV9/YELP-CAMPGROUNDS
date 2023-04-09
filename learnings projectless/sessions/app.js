const express =  require('express');
const app = express();
const session =  require('express-session');//needs npm i express-session
const flash = require('connect-flash');// needs npm install
app.use(flash());

app.use(session({ secret: 'Thisismysecret', resave: false, saveUninitialized:false
}));

app.get('/viewcount', (req,res)=>{
    if(req.session.count){
        req.session.count += 1;
    }else {
        req.session.count = 1;
    }
    res.send(`You visited this page ${req.session.count} times`)
});

app.get('/register', (req,res)=>{
    const {username = 'Unknown'} = req.query;
    req.session.username = username;
    res.redirect('/myaccount');

})

app.get('/myaccount', (req,res)=>{
    const {username}= req.session
    res.send(`Your usernamer for the current session is ${username}`)

})

//flash messages

app.get('/flashsetup', (req,res)=>{
    req.flash('success' ,'succesfully flashed the message')//this to be done on the post route
    res.redirect('/showflash')
})


app.get('/showflash', (req,res)=>{
    const message = req.flash('success')
    // or
    // res.send({messages: req.flash('success')})//this will not work as here not form and post route available
    res.send(message);
}) //use <%=messages%> in the render template to show the message






app.listen(3000, (req,res)=>{
    console.log('connected')
});