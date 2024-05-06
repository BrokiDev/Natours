import { Router } from "express";
import { forgotPasswordController, loginController, logoutController, signUpController } from "../controller/Users/auth/auth.controller";


export const authRouter = Router();

authRouter.post('/signup',signUpController)
authRouter.post('/login',loginController)
authRouter.post('/logout',logoutController) 
authRouter.post('/forgot-password',forgotPasswordController)

/*
auth.patch('/resetPassword/:token',resetPassword)
auth.patch('/updatePassword',protect,updatePassword)
auth.get('/me',protect,me)
*/