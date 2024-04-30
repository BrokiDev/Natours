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
        lowercase:true,
        validate: (value:string) => {
            if(!value.includes('@')) throw new Error('Please provide a valid email')
        }
    },
    photo: String,
    password: {
        type:String,
        required:true,
        minlength:8
    },
    passwordConfirm: {
        type:String || undefined,
        required:[true, 'Please confirm your password'],
        validate: {
            validator: function(this:any,val:string) {
                return val === this.password
            },
            message: 'Passwords are not the same'
        }
    },
})

export const User = mongoose.model('Users',userSchema)