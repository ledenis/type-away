#!/usr/bin/env node

const path = require('path')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const internalIp = require('internal-ip')
const qrcode = require('qrcode-terminal')
const { logger } = require('./logger')
const { typeText, pressKey } = require('./event-handler')

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
})

io.on('connection', (socket) => {
  logger.debug('user connected')

  socket.on('type', (text) => {
    logger.debug(`type ${text}`)
    typeText(text)
  })

  socket.on('key', (key) => {
    logger.debug(`key ${key}`)
    pressKey(key)
  })

  socket.on('disconnect', () => {
    logger.debug('user disconnected')
  })
})

http.listen(3000, () => {
  const url = `http://${internalIp.v4.sync()}:3000`
  logger.log(`Listening on ${url}`)
  logger.log('You can access the url above or scan this QR code:')
  qrcode.generate(url, { small: true })
})
