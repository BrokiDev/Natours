import { Router } from "express";
import { forgotPasswordController, loginController, logoutController, resendEmailVerificationController, resetPasswordController, signUpController, updatePassword, verifyEmailController } from "../controller/Users/auth/auth.controller";
import { checkJwt } from "../middlewares/checkJwt";


export const authRouter = Router();

authRouter.post('/signup',signUpController)
authRouter.post('/login',loginController)
authRouter.post('/logout',checkJwt,logoutController) 
authRouter.post('/forgot-password',forgotPasswordController)
authRouter.patch('/reset-password/:token',resetPasswordController)
authRouter.patch('/verify-email/:token',verifyEmailController)
authRouter.post('/resend-verification-email',resendEmailVerificationController)


/*
auth.patch('/updatePassword',protect,updatePassword)
auth.get('/me',protect,me)
*/