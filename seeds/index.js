const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cities = require('./cities');
const Campground = require('../models/campground');
const {descriptors , places }= require('./seedHelpers')
const images = require('./images')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').
then((res)=> {
    console.log('connected to database');
    console.log(cities.length)
    // console.log(res);
}).catch(err =>{
    console.log('OHHH NO ERROR CONNECTING DATABSE')
    console.log(err);
    
})

const forTitle = array => array[Math.floor(Math.random()*array.length)];
const forImages = array => array[Math.floor(Math.random()*array.length)];
const prices = Math.floor(Math.random()*10)+15; 

const seeddb = async ()=>{
    await Campground.deleteMany({})
    for(let i=0; i<400; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        const newLocation = `${cities[random1000].city} ${cities[random1000].state}`
        const camp = new Campground({
            author:'6412fa8f31e57e724ab76c3b',
            geometry: { type: 'Point', coordinates: [ 74.858092, 32.718561 ] },
            location:newLocation,
            title:`${forTitle(places)} ${forTitle(descriptors)}`,
            geometry:{
                type:"Point",
            coordinates:[
                cities[random1000].longitude,cities[random1000].latitude
                
            ]

            },
            images:[{
                url:`${forImages(images)}`,
                filename:'my1image'
            },
            {
                url:`${forImages(images)}`,
                filename:'my2image'
            }],
            description:'Summer camp is an outdoor activity that includes several recreational activities during the summer break. The summer camp often takes place in a location away from home, or by the school authorities themselves for students from different backgrounds to partake.',
            price:prices
            
        })
         
    await camp.save();
    }
}

seeddb();
