import { processOrderConfirmation } from "./email-services"

async function main() {
    console.log('main')

    const orderId= "clvwozc58000135igexu0egeu"
    await processOrderConfirmation(orderId)
}

main()