#!/usr/bin/env node

const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const { execSync } = require('child_process')
const internalIp = require('internal-ip')
const qrcode = require('qrcode-terminal')
const clipboardy = require('clipboardy')
const keySender = require('node-key-sender')
const os = require('os')

const xdotoolTypeDelayInMs = 800
const debug = process.env.DEBUG === 'true' || false
const useXdotool = os.platform() === 'linux' && process.env.TA_USE_CLIPBOARD !== 'true'

const logger = {
  error(msg, ...params) {
    console.error(msg, ...params)
  },

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

function typeText(text) {
  if (useXdotool) {
    execSync(`xdotool type --delay ${xdotoolTypeDelayInMs} "${escapeDoubleQuotes(text)}"`)
  } else {
    clipboardy.writeSync(text)
    keySender.sendCombination(['control', 'v'])
  }
}

function escapeDoubleQuotes(msg) {
  return msg.replace(/"/g, '\\"')
}

const xdotoolKeyToKSKeyCode = {
  'Return': 'enter',
  'BackSpace': 'back_space',
}

function pressKey(key) {
  if (useXdotool) {
    execSync(`xdotool key "${key}"`)
  } else {
    const ksKeyCode = xdotoolKeyToKSKeyCode[key]
    if (!ksKeyCode) {
      log.error(`key '${key}' not supported`)
      return
    }
    keySender.sendKey(ksKeyCode)
  }
}

http.listen(3000, () => {
  const url = `http://${internalIp.v4.sync()}:3000`
  logger.log(`Listening on ${url}`)
  logger.log('You can access the url above or scan this QR code:')
  qrcode.generate(url, { small: true })
})
