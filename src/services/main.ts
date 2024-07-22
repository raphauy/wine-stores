import { title } from "process"

async function main() {
    console.log('main')

    const btcpayServerUrl = 'https://btcpay.latidio.com'
//    const btcpayServerUrl = 'http://umbrel.local:3003'
    const storeId = '9Dh64zYSNSRYjWGVrHoTiyJKjTAEztzdi5CsPahqfeqP'
    const apiKey = 'db55569d8e0d55b040353f34066eddb8dc7ba114'
    const amount = 30
    const currency = 'USD'

    const apiEndpoint = `/api/v1/stores/${storeId}/invoices`

    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'token ' + apiKey
    }
    const payload = {
        amount: amount,
        currency: currency,
        metadata: {
            orderId: '3234567890'
        }
    }
    fetch(btcpayServerUrl + apiEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
  
}

//main()