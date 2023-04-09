const express = require('express');
const app = express();
const dogRouter = require('./routes/dogs');
const shelterRouter = require('./routes/shelter');
const adminRouter = require('./routes/admin');





app.use('/dogs',dogRouter);
app.use('/shelters',shelterRouter);
app.use('/',adminRouter);



app.listen(3010, () => {
    console.log("connected")
})