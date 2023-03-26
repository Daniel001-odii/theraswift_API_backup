import { Request, Response, NextFunction } from "express";


export type ExpressArgs = {
    req: Request,
    res: Response,
    next?: NextFunction
};