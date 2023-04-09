const express = require('express');
const router = express.Router();

router.use((req,res,next)=>{
    if(req.query.isadmin){//to get permission write url /admin?isadmin=true

        next();
    }
    res.send("You are not an admin");
    
})//this will be applied on all the routes below ---to apply on a specific route save it in a variable and apply on that route

router.get('/admin', (req,res)=>{
    res.send('admin opened')

} )

router.get('/admin/details', (req,res)=>{
    res.send('admin account')
})

module.exports = router