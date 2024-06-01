import { createHash } from "crypto";
import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import { encryptPassword, verifyPassword } from "../../../helpers/encrypt";
import { createSendToken, generateToken } from "../../../helpers/jwt.service";
import { User } from "../../../Model/Users";
import { AppError } from "../../../utils/appError";
import { sendEmail } from "../../../utils/Emails";
import { RequestExt } from "../../../interfaces/reqExtend";

config({ path: ".env" });

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
    const token = createSendToken(newUser, 201, res);

    const emailToken = newUser.createEmailVerificationToken();
    newUser.password = body.password;
    newUser.passwordConfirm = body.passwordConfirm;
    newUser.active = false;
    await newUser.save({ validateBeforeSave: false });

    const emailVerificationURL = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;
    const message = `Verify your email address by clicking the link: ${emailVerificationURL}`;

    try {
      await sendEmail({
        email: "bryantro855@gmail.com",
        subject: "Your email verification token (valid for 10 min)",
        message: message,
      });
    } catch (error) {
      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }

    return token;
  }
);

export const verifyEmailController = catchAsync(
  async ({ params }: Request, res: Response, next: NextFunction) => {
    const { token } = params;
    const hashedToken = createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpires: { $gt: new Date().toLocaleString() },
    });
    

    console.log(user);
    if (!user) {
      return next(new AppError("Token invalid or has expired", 400));
    }

    user.active = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const tokenLogged = generateToken(`${user._id}`);

    res.status(200).json({
      status: "success",
      token: tokenLogged,
      message: "Email Verified",
    });
  }
);

export const resendEmailVerificationController = catchAsync(
  async ({ body }: Request, res: Response, next: NextFunction) => {
    const { email } = body;
    const user = await User.findOne({ email});

    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }

    if (user.active === true) {
      return next(new AppError("This email is already verified", 400));
    }


 



    const emailToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const emailVerificationURL = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;
    const message = `Verify your email address by clicking the link: ${emailVerificationURL}`;

    try {
      await sendEmail({
        email: "bryantro855@gmail.com",
        subject: "Your email verification token (valid for 10 min)",
        message: message,
      });
      res.status(200).json({
        status: "success",
        message: "Resend email verification successfully!",
      });
    } catch (error) {
      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
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

    if (!dataFind) {
      return next(new AppError("Invalid Credentials", 401));
    }

    if (!dataFind.active) {
      return next(new AppError("Your Account has been deactivated. Please contact with the support team", 401));
    }

    const passwordEncrypt = await verifyPassword(
      `${password}`,
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
    const user = await User.findOne({ email: email });

    if (email !== user?.email) {
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
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date().toLocaleString() },
    });

    if (!user) {
      return next(new AppError("Token invalid or has expired", 400));
    }

    const passwordEncrypt = await encryptPassword(
      body.password,
      Number(process.env.SALTS_ROUND)
    );

    user.password = passwordEncrypt;
    user.passwordConfirm = passwordEncrypt;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const tokenLogged = generateToken(`${user?._id}`);

    res.status(200).json({
      status: "success",
      token: tokenLogged,
    });
  }
);

export const updatePassword = catchAsync(
  async (req: RequestExt, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, passwordConfirm } = req.body;

    const user = await User.findById(req.user);

    if (!user) return next(new AppError("User not found", 404));

    if (newPassword !== passwordConfirm)
      return next(
        new AppError(
          "The newPassword and passwordConfirm must be the same",
          400
        )
      );

    const passwordHashed = await verifyPassword(
      currentPassword,
      `${user?.password}`
    );

    if (!passwordHashed)
      return next(new AppError("The Password entered is wrong", 403));

    const passwordEncrypt = await encryptPassword(
      newPassword,
      Number(process.env.SALTS_ROUND)
    );

    user.password = passwordEncrypt;
    user.passwordConfirm = passwordEncrypt;
    user.passwordChangedAt = new Date().toLocaleString();
    await user.save();

    const tokenLogged = generateToken(`${user._id}`);

    res.status(200).json({
      status: "success",
      token: tokenLogged,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  }
);
