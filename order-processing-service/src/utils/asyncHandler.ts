import type { NextFunction, Request, RequestHandler, Response } from "express"

export const asyncHandler = (handlerFn: RequestHandler) => {
    // returns a function reference
    return (req: Request, res: Response, next: NextFunction) => {
        // resolve the promise or catch the error and forward it to error handling middleware
        Promise.resolve(handlerFn(req, res, next)).catch((err) => next(err))
    }
}
