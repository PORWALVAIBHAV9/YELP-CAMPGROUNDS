const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/relationshipDB').
then((res)=> {
    console.log('connected to database');
    console.log(res);
}).catch(err =>{
    console.log('OHHH NO ERROR CONNECTING DATABSE')
    console.log(err);
    
})


const fruitSchema = new mongoose.Schema({
    name:String,
    price:Number,
    season:{
        type:String,
        enum:['summer','rainy','winter','fall']
    }

})

const Fruit = new mongoose.model('Fruit', fruitSchema);

Fruit.insertMany([{name:'orange', price:5, season:'summer'},
{name:'grapes', price:9, season:'winter'},
{name:'chikku', price:1, season:'summer'},
{name:'watermelon', price:7, season:'rainy'},
{name:'kiwi', price:6, season:'winter'},
{name:'bamama', price:6, season:'rainy'},
])



const farmSchema = new mongoose.Schema({
    name:String,
    location:String,
    products:[{type: mongoose.Schema.Types.ObjectId, ref:'Fruit'}]
})



const Farm = new mongoose.model('Farm', farmSchema);
const makeFarm = async()=>{
    const farm1 = new Farm({
        name:'nill farms',
        location:'banglore',
    })
    const product = await Fruit.findOne({name:'orange'});
    const product2 = await Fruit.findOne({name:'grapes'});
    
    farm1.products.push(product);
    farm1.products.push(product2)
    console.log(farm1)
    await Farm.deleteMany({});
    await farm1.save()
    


}

makeFarm()


Farm.findOne({name:'nill farms'}).populate('products').then(farm => console.log(farm))