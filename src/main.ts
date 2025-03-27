import { Client, ClientOptions } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

const options: ClientOptions = {
  puppeteer: {
      headless: true,
  },
  session: undefined, 
}

const client = new Client(options)

client.on('ready', () => {
  console.log('Client is ready');
})

client.on('qr', () => {
  qrcode
})