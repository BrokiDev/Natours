import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, 'Please provide your name']
    },
    email: {
        type:String,
        unique:true,
        required:[true, 'Please provide your email'],
        lowercase:true
    },
    photo: String,
    password: {
        type:String,
        required:true,
        minlength:8
    },
    passwordConfirm: {
        type:String,
        required:[true, 'Please confirm your password'],
        minlength:8
    },
})


export const User = mongoose.model('Users',userSchema)