import mongoose from "mongoose";
import crypto from "crypto";

export interface IUser {
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  changePasswordAfter: (JWTTimestamp: number) => boolean;
  createPasswordResetToken: () => void;
  role: string;
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
      if (!value.includes("@")) throw new Error("Please provide a valid email");
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
});

userSchema.pre("find", function (next) {
  this.select("-__v"), this.select("-password");
  next();
});

userSchema.methods.changePasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = (this.passwordChangedAt.getTime() / 1000, 10);
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

userSchema.pre('save',function(next){
    if(this.isModified('password') || this.isNew) return next()

        this.passwordChangedAt = new Date(Date.now() - 1000);
})

export const User = mongoose.model("Users", userSchema);
