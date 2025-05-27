import 'reflect-metadata'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as http from 'http'
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: '/rahmadz', secret: 'rahmadz' })
const execFile = require('child_process').execFile
import * as TelegramBot from 'node-telegram-bot-api'
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN)

const dotenvAbsolutePath = path.join(__dirname, '../.env')
dotenv.config({
  path: dotenvAbsolutePath
})

main()

function main(): any {
  http
    .createServer(function (req, res) {
      handler(req, res, function (err) {
        res.statusCode = 404
        res.end('no such location')
      })
    })
    .listen(process.env.APP_PORT, () => {
      console.log(`Service ${process.env.APP_MODULE} listen on port ${process.env.APP_PORT}`)
    })

  handler.on('error', function (err) {
    console.error('Error:', err.message)
  })

  handler.on('push', function (event) {
    console.log('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref)
    bot.sendMessage(
      process.env.TELEGRAM_CHAT,
      'Hello, Your' +
        process.env.APP_MODULE +
        process.env.APP_NAME +
        'has has started new deployment. Date : ' +
        new Date() +
        '. Domain : ' +
        process.env.APP_DOMAIN +
        '  Thanks You!'
    )
    const execOptions = {
      maxBuffer: 1024 * 1024
    }

    execFile('/root/webhook/restapps/deploy.sh', execOptions, function (error, stdout, stderr) {
      if (error) {
        console.log(error)
        return bot.sendMessage(process.env.TELEGRAM_CHAT, error.message)
      }
      return bot.sendMessage(
        process.env.TELEGRAM_CHAT,
        'Yay, Your' +
          process.env.APP_MODULE +
          process.env.APP_NAME +
          'has completed deployment. Date : ' +
          new Date() +
          '. Domain : ' +
          process.env.APP_DOMAIN +
          '  Thanks You!'
      )
    })
  })
}
