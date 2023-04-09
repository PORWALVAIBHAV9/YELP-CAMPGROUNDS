
const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');//it needs to install npm i cookie-parser
app.use(cookieparser('thecookiesissigned'));//the string is secret used inside is used for signed cookies for other cookies it is kept vaccant

app.get('/login', (req,res)=>{
    res.cookie('password', 'vaibhavpasss')
    res.send('password saved to cookies')
})

app.get('/account',(req,res)=>{
    const {password} = req.cookies;
    res.send(`save password is ${password}`)


})




//for signed cookies it is there to protect our cookies to being changed by someone\

app.get('/signthecookie', (req,res)=>{
    res.cookie('password', 'signedbyme', {signed:true})
    res.send('your signed cookie is send to the server')
    //now if i do any changes in the cookie from the dev tools or anywhere it will not be cahnged
})

app.get('/fetchsigned', (req,res)=>{
    res.send(req.signedCookies)//signed cookies will be fetched with the funtion 
    res.send('fetching cookies')
})


app.listen(3000, (req,res)=>{
    console.log('connected')
})

