import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Tour must have a name'],
        unique:true,
        trim:true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10,'A tour name must have more or equal then 40 characters']
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
        required:[true,'Tour must have a difficulty'],
        enum: {values:['easy','medium','difficult'],
            message: 'Difficulty is either: easy, medium,difficult'
        }
    },
    rating: {
        type:Number,
        default:4.5,
        min: [1,'A tour must have a rating must be above 1.0'],
        max: [5,'A tour must have a rating must be below 5.0']
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
    startDates:[Date],
    
}, {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
    
})

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration  / 7;
})

export const Tour = mongoose.model('Tour',tourSchema)