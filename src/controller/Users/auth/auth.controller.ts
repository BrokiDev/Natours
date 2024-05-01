import {Request,Response, NextFunction } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import { User } from "../../../Model/Users";
import { encryptPassword } from "../../../helpers/encrypt";
import { generateToken } from "../../../helpers/jwt.service";

export const signUpController = catchAsync(
    async ({ body }: Request, res: Response, next: NextFunction) => {

        if(body.password){
            const passwordEncrypt = await encryptPassword(body.password,Number(process.env.SALTS_ROUND))
            body.password = passwordEncrypt;
            body.passwordConfirm = passwordEncrypt;
        }


      const newUser = await User.create({
        name: body.name,
        email: body.email,
        password: body.password,
        passwordConfirm: body.passwordConfirm
      });
      const token = generateToken(`${newUser._id}`)
  
      res.status(201).json({
        status:'created',
        token,
        data: {
          user:newUser
        }
      })
    }
  );