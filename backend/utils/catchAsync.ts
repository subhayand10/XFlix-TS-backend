import { Request,Response,NextFunction } from "express";
export function catchAsync(fn:any) {
  return function (req:Request, res:Response, next:NextFunction) {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
}

