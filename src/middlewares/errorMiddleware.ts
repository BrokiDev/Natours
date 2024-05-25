import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if(process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  } else if(process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if(error.name === 'CastError') {
      const message = `Invalid ${error.path}: ${error.value}`;
      return error = new AppError(message, 400);
    }

    if(error.code === 11000) {
      const message = `Duplicate field value: ${error.keyValue.name}. Please use another value!`;
      return error = new AppError(message, 400);
    }

    if(error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((el: any) => el.message);
      const message = `Invalid input data. ${errors.join('. ')}`;
      return error = new AppError(message, 400);
    }
    
  }

  if(err.message === 'jwt malformed') {
    return res.status(401).json({
      status:'error',
      message:'Unauthorized'
    })
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}; 
