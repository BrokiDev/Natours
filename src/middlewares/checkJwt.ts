import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../helpers/catchAsync";
import { verifyToken } from "../helpers/jwt.service";
import { AppError } from "../utils/appError";


export const checkJwt = ({headers}:Request, res:Response, next:NextFunction) => {
    try {
        const jwtByUser = headers.authorization;
        const jwt = jwtByUser?.split(' ').pop();
        const validateToken = verifyToken(`${jwt}`);
        next();
        
    } catch (error) {
        return next(new AppError('Unauthorized',401))
    }
    };
