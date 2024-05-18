import { processOrderConfirmation } from "./email-services"

async function main() {
    console.log('main')

    // const orderId= "clvwozc58000135igexu0egeu"
    // await processOrderConfirmation(orderId)

    const mpMarketplaceFeePerc= 10.5
    const totalOrderValue= 1490
    const mpFee= Number((totalOrderValue * mpMarketplaceFeePerc / 100).toFixed(2))
    console.log("mpFee", mpFee)
  
}

//main()