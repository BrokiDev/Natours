import mongoose from "mongoose";

export interface IUser {
    name: string;
    email: string;
    photo: string;
    password: string;
    passwordConfirm: string;
    passwordChangedAt: Date;
    changePasswordAfter: (JWTTimestamp: number) => boolean;
}


const userSchema = new mongoose.Schema<IUser>({
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
        minlength:8,
    },
    passwordConfirm: {
        type:String || undefined,
        required:[true, 'Please confirm your password'],
        validate: {
            validator: function(this:any,val:string) {
                return val === this.password
            },
            message: 'Passwords are not the same'
        },
        select:false
    },
    passwordChangedAt: Date,

})

userSchema.pre('find',function(next) {
    this.select('-__v'),
    this.select('-password')
    next()
})

userSchema.methods.changePasswordAfter = function(JWTTimestamp:number) {
    if(this.passwordChangedAt) {
        const changedTimestamp = (this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < changedTimestamp
    }
    return false
}


export const User = mongoose.model('Users',userSchema)