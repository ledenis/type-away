#!/usr/bin/env node

const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const { execSync } = require('child_process')

const internalIp = require('internal-ip')

const qrcode = require('qrcode-terminal')

const typeDelayInMs = 800
const debug = process.env.DEBUG === 'true' || false;

const logger = {
  log(msg, ...params) {
    console.log(msg, ...params)
  },

  debug(msg, ...params) {
    debug && console.log(msg, ...params)
  }
}

app.get('/', (_, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  logger.debug('user connected')

  socket.on('type', (msg) => {
    logger.debug(`type ${msg}`)
    execSync(`xdotool type --delay ${typeDelayInMs} "${escapeTypeMsg(msg)}"`)
  })

  socket.on('key', (msg) => {
    logger.debug(`key ${msg}`)
    execSync(`xdotool key "${msg}"`)
  })

  socket.on('disconnect', () => {
    logger.debug('user disconnected')
  })
})

function escapeTypeMsg(msg) {
  return msg.replace(/"/g, '\\"')
}

http.listen(3000, () => {
  const url = `http://${internalIp.v4.sync()}:3000`
  logger.log(`Listening on ${url}`)
  logger.log('You can access the url above or scan this QR code:')
  qrcode.generate(url, { small: true })
})
