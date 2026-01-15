import app from "./app.js"
import { env } from "./config/env.js"
import { connectDb } from "./db/db-manager.js"
import consumer from "./worker/consumer.js"
import { User } from "./models/user.models.js"
import { Product } from "./models/product.models.js"
import { Order } from "./models/order.models.js"

connectDb()
    .then(() => {
        // start the consumer
        consumer.start()

        console.log(
            console.log("Registered models:", [
                User.modelName,
                Order.modelName,
                Product.modelName
            ])
        )

        // start the server
        app.listen(env.PORT, () => {
            console.log(
                `order-processing-service running and listening on port: ${env.PORT}`
            )
        })
    })
    .catch((error) => {
        console.log(
            `Error occurred while starting the order-processing-service: ${error}`
        )
        process.exit(1)
    })
