import {Request,Response, NextFunction } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import { User } from "../../../Model/Users";
import { encryptPassword, verifyPassword } from "../../../helpers/encrypt";
import { generateToken } from "../../../helpers/jwt.service";
import { AppError } from "../../../utils/appError";

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
          user: {
            name: newUser.name,
            email: newUser.email,
            id: newUser._id
          }
        }
      })
    }
  );


  export const loginController = catchAsync(async({body}:Request,res:Response,next:NextFunction) => {
    const {email,password} = body

    if(!email || !password) {
        return next(new AppError('Please Provide a valid email or password',400))
    }

    
    const dataFind = await User.findOne({email})
    const passwordEncrypt = await verifyPassword(password,`${dataFind?.password}`)

    if(!dataFind || !passwordEncrypt) {
        return next(new AppError('Invalid Credentials',401))
    }


    const token = generateToken(`${dataFind?._id}`)

    res.status(200).json({
        status:'success',
        token,
        data: {
            email:dataFind?.email,
            name:dataFind?.name,
            id:dataFind?._id

        }
    })
  } )

export const logoutController = catchAsync(async({headers}:Request,res:Response,next:NextFunction) => {
    const request = headers.authorization
    console.log('Request',request)
    const authorization = request?.split(' ').pop()
    console.log('Authorization',authorization)
    if(!authorization) {
        return next(new AppError('Unauthorized',401))
    }
    
    res.status(200).json({
        status:'success',
        message:'User Logged Out'
    })
})