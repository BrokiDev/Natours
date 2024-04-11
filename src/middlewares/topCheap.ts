import { NextFunction, Request, Response } from "express";

export const topCheap = ({query}:Request,res:Response,next:NextFunction) => {
    query.limit = '5';
    query.sort = '-rating,price'

    next()
}