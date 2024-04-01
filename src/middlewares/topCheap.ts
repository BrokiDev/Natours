import { NextFunction, Request, Response } from "express";

export const topCheap = (req:Request,res:Response,next:NextFunction) => {
    req.query.limit = '5';
    req.query.sort = '-rating,price'

    next()
}