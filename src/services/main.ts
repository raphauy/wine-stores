import { processOrderConfirmation, sendEmailConfirmation } from "./email-services"
import { getStoreDAO } from "./store-services"

async function main() {
    console.log('main')

    // const orderId= "clvwozc58000135igexu0egeu"
    // await processOrderConfirmation(orderId)

    const storeId= "clv10m49u000387ust8w8u86j"
    const emailTo= "rapha.uy@gmail.com"
    await sendEmailConfirmation(storeId, emailTo)
  
}

main()