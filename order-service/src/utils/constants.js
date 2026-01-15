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

// Outbox message status
const OUTBOX_MESSAGE_STATUS = {
    PENDING: "Pending",
    PROCESSED: "Processed",
    FAILED: "Failed"
}

const OUTBOX_EVENT_TYPE = {
    ORDER_CREATED: "Order_Created"
}

export {
    TOKEN_ISSUER,
    SCOPES,
    ORDER_STATUS,
    OUTBOX_MESSAGE_STATUS,
    OUTBOX_EVENT_TYPE
}
