import { NextFunction, Response } from "express"

export const catchAsync = (fn:any):any => {
    return (req:Request,res:Response,next:NextFunction) => {
      fn(req,res,next).catch(next)
    }
  }