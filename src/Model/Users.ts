import mongoose from "mongoose";
import crypto from "crypto";

export interface IUser {
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date | string;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  changePasswordAfter: (JWTTimestamp: number) => boolean;
  createPasswordResetToken: () => void;
  role: string;
  active:boolean
  emailVerificationToken?: string;
  createEmailVerificationToken: () => void;
  emailVerificationTokenExpires?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide your email"],
    lowercase: true,
    validate: (value: string) => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailRegex.test(value);
    },
  },
  photo: String,
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  passwordConfirm: {
    type: String || undefined,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (this: any, val: string) {
        return val === this.password;
      },
      message: "Passwords are not the same",
    },
    select: false,
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ["user", "moderator", "admin"],
    default: "user",
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type:Boolean,
  },
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date
});

userSchema.pre("find", function (next) {
  this.select("-__v"), this.select("-password"), this.select('-active')
  this.find({active:{$ne:false}});
  next();
});

userSchema.methods.changePasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = ((this.passwordChangedAt.getTime() / 1000).toString(),10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({resetToken},this.passwordResetToken);

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function(){
  const emailToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(emailToken).digest('hex');

  console.log({emailToken},this.emailVerificationToken);

this.emailVerificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
  return emailToken;
}

userSchema.pre('save',function(next){
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
})


export const User = mongoose.model("Users", userSchema);
