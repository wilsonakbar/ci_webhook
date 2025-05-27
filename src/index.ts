import 'reflect-metadata'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as http from 'http'
import * as TelegramBot from 'node-telegram-bot-api'
import { execFile } from 'child_process'
const createHandler = require('github-webhook-handler')

dotenv.config({ path: path.join(__dirname, '../.env') })

const REQUIRED_ENV = ['TELEGRAM_TOKEN', 'TELEGRAM_CHAT', 'APP_PORT', 'APP_MODULE', 'APP_NAME', 'APP_DOMAIN']
REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})

const { TELEGRAM_TOKEN, TELEGRAM_CHAT, APP_PORT, APP_MODULE, APP_NAME, APP_DOMAIN } = process.env

const bot = new TelegramBot(TELEGRAM_TOKEN)

const handler = createHandler({
  path: '/backend',
  secret: 'backend'
})

http
  .createServer((req, res) => {
    handler(req, res, () => {
      res.statusCode = 404
      res.end('No such location')
    })
  })
  .listen(Number(APP_PORT), () => {
    console.log(`[✅] ${APP_MODULE} listening on port ${APP_PORT}`)
  })

handler.on('error', (err: Error) => {
  console.error('[Webhook Error]', err.message)
})

handler.on('push', async (event: any) => {
  const repo = event.payload.repository.name
  const branch = event.payload.ref
  const date = new Date().toLocaleString()

  console.log(`[🚀] Push event for ${repo} to ${branch}`)

  const startMessage = `🚀 Hello, Your ${APP_MODULE} ${APP_NAME} has started new deployment.

 🕒 ${date}
 🌐 ${APP_DOMAIN}

 Thank You!`

  await sendMessage(startMessage)

  execFile('/root/webhook/restapps/deploy.sh', { maxBuffer: 1024 * 1024 }, async (error, stdout, stderr) => {
    if (error) {
      console.error('[Deploy Error]', error)
      const failedMessage = `❌ Deployment Failed.

 🕒 ${date}
 🐒 ${error.message}

 Thank You!`

      return sendMessage(failedMessage)
    }

    const finishMessage = `✅ Yay, Your ${APP_MODULE} ${APP_NAME} has completed deployment.

 🕒 ${date}
 🌐 ${APP_DOMAIN}

 Thank You!`

    await sendMessage(finishMessage)
  })
})

async function sendMessage(message: string) {
  try {
    await bot.sendMessage(TELEGRAM_CHAT!, message)
  } catch (err) {
    console.error('[Telegram Error]', err)
  }
}
