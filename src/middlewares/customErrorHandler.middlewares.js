// Custom global error handler
export const customErrorHandler = (error, req, res, next) => {
    console.error(
        `CustomErrorHandler - Error occurred while processing the request: ${error.message}`
    )
    res.status(error.statusCode || 500).json({
        message:
            error.statusCode !== 500 ? error.message : "Internal Server Error"
    })
}
