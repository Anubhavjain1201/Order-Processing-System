import Mailgen from "mailgen"

export const mailGenerator = new Mailgen({
    theme: "salted",
    product: {
        // Appears in header & footer of e-mails
        name: "OrderProc",
        link: "https://orderproc.com/",
        copyright: `Copyright © ${new Date().getFullYear()} OrderProc. All rights reserved.`
    }
})
