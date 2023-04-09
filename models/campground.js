const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').
then((res)=> {
    console.log('connected to database');
    console.log(res);
}).catch(err =>{
    console.log('OHHH NO ERROR CONNECTING DATABSE')
    console.log(err);
    
})

const opts = { toJSON : {virtuals :true } };

const campgroundSchema =  new Schema(
    {title:String,
    price:Number,
    description:String,
    location:String,
    geometry:{

    type:{type:String,
        enum:['Point'],
        },
    coordinates:{
        type:[Number],
        
    }
},
    images:[{
        url:String,
        filename:String
    }],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ]

    }, opts
)

campgroundSchema.virtual('properties.popupMarkup').get( function () {
    return "im popup"
});

campgroundSchema.post('findOneAndDelete', async(campground)=>{//this is the campground which is deleted
    if(campground){
        await Review.deleteMany({
            _id: {
                $in : campground.reviews 
            }
        })
    }

})//it means delete all the id's from the review model that are present in campground.review





module.exports = mongoose.model('Campground', campgroundSchema);