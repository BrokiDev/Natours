import {JwtPayload, sign,verify} from 'jsonwebtoken'
// import dotenv from 'dotenv'
// dotenv.config({path:'.env'})

interface JwtPayloadExt extends JwtPayload {
    userId?: string;
  }

const JWT_SECRET = `${process.env.JWT_SECRET}`
const JWT_EXPIRE_IN = `${process.env.JWT_EXPIRE_IN}`

export const generateToken = (userId:string):string => {
    return sign({userId},JWT_SECRET,{expiresIn: '2h'} )
}

export const verifyToken = (token: string) => {
    return verify(token, JWT_SECRET) as JwtPayloadExt;
  };