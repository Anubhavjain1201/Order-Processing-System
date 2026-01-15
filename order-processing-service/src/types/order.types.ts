import type { Types } from "mongoose"
import type { ProductType } from "../models/product.models.js"
import type { UserType } from "../models/user.models.js"
import type { ORDER_STATUS } from "../utils/constants.js"

export interface OrderItemsPopulated {
    productId: ProductType
    price_at_purchase: number
    quantity: number
}

export interface OrderPopulated {
    _id: Types.ObjectId
    userId: UserType
    items: OrderItemsPopulated[]
    status: ORDER_STATUS
    orderDate: Date
    emailSent: boolean
    totals?: {
        sub_total: number
        tax: number
        grand_total: number
    } | null
}
