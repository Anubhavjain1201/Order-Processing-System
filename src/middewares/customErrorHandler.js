// Custom global error handler
export const customErrorHandler = (error, req, res, next) => {
    console.error(
        `Error occurred while processing the request: ${error.message}`
    )
    res.status(error.status || 500).json({
        message: error.message || "Internal Server Error"
    })
}
