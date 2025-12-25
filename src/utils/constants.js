// issuer of identity tokens
const TOKEN_ISSUER = "identity.orderproc.com"

// Types of scopes for identity tokens
const SCOPES = {
    REFRESH: "refresh",
    ACCESS_ORDER: "orders"
}

// Order status
const ORDER_STATUS = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    PROCESSED: "Processed",
    FAILED: "Failed"
}

export { TOKEN_ISSUER, SCOPES, ORDER_STATUS }
