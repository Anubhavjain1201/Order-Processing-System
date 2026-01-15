import type Mailgen from "mailgen"
import { mailGenerator } from "../utils/mailGenerator.js"
import nodemailer, { type Transporter } from "nodemailer"
import { env } from "../config/env.js"
import type Mail from "nodemailer/lib/mailer/index.js"
import type { OrderPopulated } from "../types/order.types.js"

export interface EmailOptions {
    mailgenContent: Mailgen.Content
    receiverAddress: string
    emailSubject: string
}

class EmailService {
    /**
     * Utility to send an email using MailTrap
     * @param emailOptions
     */
    async sendEmail(emailOptions: EmailOptions) {
        const textualEmailContent = mailGenerator.generatePlaintext(
            emailOptions.mailgenContent
        )

        const htmlEmailContent = mailGenerator.generate(
            emailOptions.mailgenContent
        )

        const transporter = this.initializeNodemailerTransporter()

        const mailOptions: Mail.Options = {
            from: "mail.orderprocsystem@orderproc.com",
            to: emailOptions.receiverAddress,
            subject: emailOptions.emailSubject,
            text: textualEmailContent,
            html: htmlEmailContent
        }

        try {
            console.log(
                `EmailService - Sending email to: ${emailOptions.receiverAddress}`
            )
            await transporter.sendMail(mailOptions)
            console.log(
                `EmailService - Mail sent successfully to: ${emailOptions.receiverAddress}`
            )
        } catch (error) {
            console.error(
                `EmailService - Error occurred while sending email: ${error}`
            )
            throw error
        }
    }

    /**
     * Constructs email content and its options
     */
    prepareEmailOptions(order: OrderPopulated): EmailOptions {
        // email body table data
        const itemsPurchasedData: any[] = []
        for (const item of order.items) {
            const itemDetail = {
                item: item.productId.name,
                quantity: item.quantity,
                price: `Rs. ${item.price_at_purchase}`
            }
            itemsPurchasedData.push(itemDetail)
        }

        // email content
        const orderConfirmationMailgenContent: Mailgen.Content = {
            body: {
                name: `${order.userId.username}`,
                intro: "Your order has been processed successfully.",
                table: {
                    data: itemsPurchasedData,
                    columns: {
                        // Optionally, customize the column widths
                        customWidth: {
                            item: "65%",
                            price: "20%",
                            quantity: "15%"
                        }
                    }
                },
                action: {
                    instructions:
                        "You can check the status of your order and more in your dashboard:",
                    button: {
                        color: "#47cd3e",
                        text: "Go to Dashboard",
                        link: "https://orderproc.com/dash"
                    }
                },
                outro: "We thank you for your purchase."
            }
        }

        return {
            mailgenContent: orderConfirmationMailgenContent,
            receiverAddress: `${order.userId.email}`,
            emailSubject: `Order Confirmed - ${order._id}`
        }
    }

    /**
     * Initializes nodemailer transporter object
     */
    private initializeNodemailerTransporter(): Transporter {
        return nodemailer.createTransport({
            host: env.MAILTRAP_SMTP_HOST,
            port: env.MAILTRAP_SMTP_PORT,
            auth: {
                user: env.MAILTRAP_SMTP_USER,
                pass: env.MAILTRAP_SMTP_PASS
            }
        })
    }
}

export default new EmailService()
