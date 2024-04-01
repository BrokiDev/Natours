import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Tour must have a name'],
        unique:true,
        trim:true
    },
    duration:{
        type:Number,
        required:[true,'Tour must have a duration']
    },
    maxGroupSize: {
        type:Number,
        required:[true,'Tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true,'Tour must have a difficulty']
    },
    rating: {
        type:Number,
        default:4.5
    },
    price:{
        type:Number,
        required:[true,'Tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type:String,
        trim:true,
        required:[true,'Tour must have a summary']
    },
    description: {
        type:String,
        trim:true
    },
    imageCover: {
        type:String,
        required:[true,'Tour must have a cover image']
    },
    images:[String],
    createdAt: {
        type:Date,
        default:Date.now()
    },
    startDates:[Date]

})

export const Tour = mongoose.model('Tour',tourSchema)