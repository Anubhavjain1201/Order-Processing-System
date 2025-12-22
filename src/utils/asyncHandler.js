export const asyncHandler = (handlerFn) => {
    // returns a function reference
    return (req, res, next) => {
        // resolve the promise or catch the error and forward it to error handling middleware
        Promise.resolve(handlerFn(req, res, next)).catch((err) => next(err))
    }
}
