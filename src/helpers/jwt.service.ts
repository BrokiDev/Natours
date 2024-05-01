import {JwtPayload, sign,verify} from 'jsonwebtoken'

const JWT_SECRET = `${process.env.JWT_SECRET}`

export const generateToken = (userId:string):string => {
    return sign({userId},JWT_SECRET,{expiresIn: process.env.JWT_EXPIRE_IN} )
}

export const verifyToken = (token: string): string | JwtPayload => {
    return verify(token, JWT_SECRET);
  };