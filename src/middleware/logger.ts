import { Request, Response, NextFunction } from "express";
// import { ExpressArgs } from "../types/generalTypes";

export const logger = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  };
  

