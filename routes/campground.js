const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const {isLoggedIn} = require('../autheticatemiddleware')



const multer  = require('multer')//these are for uploading image
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })
const {cloudinary} = require('../cloudinary')//this is only for deleting images part

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')//needs to install npm i '@mapbox/mapbox-sdk' 
const mapBoxToken  = process.env.mapbox_token;
const geocoder = mbxGeocoding({accessToken:mapBoxToken})


const Campground = require('../models/campground');


const catchAsync = require('../utils/catchasync');
const expressError = require('../utils/expresserror');
const {campgroundSchema} = require('../validatschema')
const joi = require('joi');//joi is used to catch server side error wit the personalised messages
const user = require('../models/user');

 
const validateCampground = (req,res,next)=>{//here joi is used to validate data 
    
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(element => element.message).join(',')
        throw new expressError(msg, 400)
    }
    else{
        next();
    }

}





router.use(express.urlencoded({extended : true}))//it is used to parse req.body without this req.body wii be empty
router.use(methodOverride('_method'))

router.get('/', async (req,res)=> {
    
    const campgrounds = await Campground.find({});

    res.render('index', {campgrounds})

})
router.get('/new', isLoggedIn, (req,res)=>{  
    res.render('new')
})



router.post('/', isLoggedIn, upload.array('image'),  catchAsync(async(req,res,next)=>{//catchasync is imported check it upside
    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send()//FOR MAP LONGITUDE AND LATITUDE
    
    // if(!req.body.campground) throw new expressError('Invalid data', '400');

    const campground = new Campground(req.body.campground)
    console.log(req.files)
    campground.images = req.files.map(f => ({url: f.path , filename: f.filename}))
    console.log(campground.images)
    campground.geometry = geodata.body.features[0].geometry
    
    campground.author = req.user._id//this is used to adding the author with the specific campground
    console.log(campground.author)
    await campground.save();
    console.log(campground)
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`) 
    }))


router.get('/:id', catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
    path:'reviews',//this populate is different as we are first reviews for the campground and then author of the specific review 
    populate:{
        path:'author'}}).populate('author');
    console.log(campground)
    const currentUser = req.user;
    if(!campground){
        req.flash('error', 'campground not found')
        return res.redirect('/campgrounds');
    }
    res.render('show', { campground, currentUser})
}))
router.get('/:id/edit', isLoggedIn,catchAsync(async(req,res)=>{
    const {id} =  req.params;
    const findCampground = await Campground.findById(id)
    if(!findCampground.author._id.equals(req.session.user._id)){
        req.flash('error', 'You do not have permission to do this')
        return res.redirect(`/campgrounds/${id}`)
    }
    const campground = await Campground.findById(req.params.id)
    res.render('edit', {campground});
}))

router.put('/:id',isLoggedIn,upload.array('image'),validateCampground, catchAsync(async (req,res)=>{
    const {id} =  req.params;
    const findCampground = await Campground.findById(id)
    if(!findCampground.author._id.equals(req.session.user._id)){
        req.flash('error', 'You do not have permission to do this')
        return res.redirect(`/campgrounds/${id}`)
    }
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground})
    console.log(campground)
    const img  = req.files.map(f=>({url:f.path, filename:f.filename}))//we are doing this for updating image and the process is different as map makes an array and if we do that way we would have an array inside an array which will spoil its structure
    campground.images.push(...img)//we are using push here as we are not overwriting images array by overwriting the old images will be removed and replaced by new thts why we are pushing here
    // ...img in this way it will push every single element taking individualy out of array
    console.log('seehereeeeeeeeeeeeeee')
    console.log(req.body.deleteImages)
    if(req.body.deleteImages){ //this is for deleteing part//,,,,as we are pulling it means deleting
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages}}}})
        console.log(campground)
    } 

    await campground.save();// this save is for editing piece
    req.flash('success', 'Successfully updated campground');

    res.redirect(`/campgrounds/${campground._id}`);
}))
router.delete('/:id',isLoggedIn, catchAsync(async(req,res)=>{
    const {id} =  req.params;
    const findCampground = await Campground.findById(id)
    if(!findCampground.author._id.equals(req.session.user._id)){
        req.flash('error', 'You do not have permission to do this')
        return res.redirect(`/campgrounds/${id}`)
    }
    await Campground.findByIdAndDelete(id);
    req.flash('error', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}));




module.exports = router;