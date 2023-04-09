const express = require('express');
const router = express.Router({mergeParams:true})//mergeparam is used as we put the campground id in this.apply.js so it is not accessible to make it acccesible 
const Review = require('../models/review')
const Campground = require('../models/campground');
const {isLoggedIn} = require('../autheticatemiddleware')

const catchAsync = require('../utils/catchasync');
const expressError = require('../utils/expresserror');

const joi = require('joi');//joi is used to catch server side error wit the personalised messages


const { reviewSchema } = require('../validatschema')


const validateReview = (req,res,next)=>{
    const {err} =  reviewSchema.validate(req.body)
    if(err){
        const msg =  err.details.map(element => element.message).join(',')
        throw new expressError(msg,400)

    }
    else{
        next();
    }
}



router.post('/',isLoggedIn, validateReview, catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    await campground.reviews.push(review)
    review.author = req.session.user._id
    await campground.save();
    await review.save();
    req.flash('success', 'Created a new review');
    res.redirect(`/campgrounds/${campground.id}`)
    

}))
router.delete('/:reviewid',isLoggedIn, catchAsync(async(req,res)=>{
    const { id, reviewid } = req.params;
    console.log(id)
    console.log(reviewid)
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewid}})//this is used to delete the review reference as well from the campground database
    const review = await Review.findByIdAndDelete(reviewid);
    req.flash('error', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`)
}))


module.exports = router;