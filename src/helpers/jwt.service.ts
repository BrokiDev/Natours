import {JwtPayload, sign,verify} from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Response } from 'express';
dotenv.config({path:'.env'})


interface JwtPayloadExt extends JwtPayload {
    userId?: string;
  }

const JWT_SECRET = `${process.env.JWT_SECRET}`
const JWT_EXPIRE_IN = `${process.env.JWT_EXPIRE_IN}`

export const generateToken = (userId:string):string => {
    return sign({userId},JWT_SECRET,{expiresIn: JWT_EXPIRE_IN} )
}

export const verifyToken = (token: string) => {
    return verify(token, JWT_SECRET) as JwtPayloadExt;
  };

  export const createSendToken = (user:any, statusCode: number, res: Response) =>{
    const token = generateToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 1000
      ),
      secure: false,
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    user.password = undefined;
    user.passwordConfirm = undefined;
    user.__v = undefined;
    user.active = undefined;
    
    return res.status(statusCode).json({
      status: "created",
      token,
      data: {
        user
      },
    });
  }