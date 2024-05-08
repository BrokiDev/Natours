import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import { User } from "../../../Model/Users";
import { encryptPassword, verifyPassword } from "../../../helpers/encrypt";
import { generateToken } from "../../../helpers/jwt.service";
import { AppError } from "../../../utils/appError";
import { sendEmail } from "../../../utils/Emails";
import { createHash } from "crypto";
import { token } from "morgan";

export const signUpController = catchAsync(
  async ({ body }: Request, res: Response, next: NextFunction) => {
    if (body.password) {
      const passwordEncrypt = await encryptPassword(
        body.password,
        Number(process.env.SALTS_ROUND)
      );
      body.password = passwordEncrypt;
      body.passwordConfirm = passwordEncrypt;
    }

    const newUser = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
      passwordConfirm: body.passwordConfirm,
    });
    const token = generateToken(`${newUser._id}`);

    res.status(201).json({
      status: "created",
      token,
      data: {
        user: {
          name: newUser.name,
          email: newUser.email,
          id: newUser._id,
        },
      },
    });
  }
);

export const loginController = catchAsync(
  async ({ body }: Request, res: Response, next: NextFunction) => {
    const { email, password } = body;

    if (!email || !password) {
      return next(
        new AppError("Please Provide a valid email or password", 400)
      );
    }

    const dataFind = await User.findOne({ email });
    const passwordEncrypt = await verifyPassword(
      password,
      `${dataFind?.password}`
    );

    if (!dataFind || !passwordEncrypt) {
      return next(new AppError("Invalid Credentials", 401));
    }

    const token = generateToken(`${dataFind?._id}`);

    res.status(200).json({
      status: "success",
      token,
      user: {
        id: dataFind?._id,
      },
    });
  }
);

export const logoutController = catchAsync(
  async ({ headers }: Request, res: Response, next: NextFunction) => {
    const request = headers.authorization;
    const authorization = request?.split(" ").pop();
    if (!authorization) {
      return next(new AppError("Unauthorized", 401));
    }

    res.status(200).json({
      status: "success",
      message: "User Logged Out",
    });
  }
);

export const forgotPasswordController = catchAsync(
  async ({ body }: Request, res: Response, next: NextFunction) => {
    const { email } = body;
    const user = await User.findOne({ email });

    if (!email) {
      return next(new AppError("There is no user with email address.", 404));
    }

    const resetToken = user?.createPasswordResetToken();
    await user?.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: "bryantro855@gmail.com",
        subject: "Your password reset token (valid for 10 min)",
        message: message,
      });
      res.status(200).json({
        status: "success",
        message: "Token sent to email",
      });
    } catch (error) {
      if (user) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
      }
      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
  }
);

export const resetPasswordController = catchAsync(
  async ({ body, params }: Request, res: Response, next: NextFunction) => {
    const { token } = params;

    const hashedToken = createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({passwordResetToken:hashedToken, passwordResetExpires: {$gt:Date.now()}})

    if(!user) {
        return next(new AppError('Token invalid or has expired',400))
    }

    user.password = body.password;
    user.passwordConfirm = body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()


    const tokenLogged = generateToken(`${user?._id}`);

    console.log(token)
    res.status(200).json({
      status: "success",
      token:tokenLogged,
    });



  });
