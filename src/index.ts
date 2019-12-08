#!/usr/bin/env node

import * as os from 'os'
import * as path from 'path'
import * as http from 'http'
import * as express from 'express'
import * as socketIo from 'socket.io'
import * as internalIp from 'internal-ip'
import * as qrcode from 'qrcode-terminal'
import { logger } from './logger'
import { XdotoolKey, LinuxRobot, WindowsRobot, MacRobot } from './robot'

const robot = createRobot()

function createRobot() {
  switch (os.platform()) {
    case 'linux':
      return new LinuxRobot(!!process.env.TA_USE_CLIPBOARD)
    case 'win32':
      return new WindowsRobot()
    case 'darwin':
      return new MacRobot()
    default:
      throw new Error(`Unsupported platform ${os.platform()}`)
  }
}

const app = express()
const httpServer = new http.Server(app)
const io = socketIo(httpServer)

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
})

io.on('connection', (socket) => {
  logger.debug('user connected')

  socket.on('type', (text) => {
    logger.debug(`type ${text}`)
    robot.typeText(text)
  })

  socket.on('key', (key) => {
    logger.debug(`key ${key}`)
    if (!(key in XdotoolKey)) {
      logger.warn(`key '${key}' not supported`)
      return
    }
    robot.pressKey(key)
  })

  socket.on('disconnect', () => {
    logger.debug('user disconnected')
  })
})

httpServer.listen(3000, () => {
  const url = `http://${internalIp.v4.sync()}:3000`
  logger.log(`Listening on ${url}`)
  logger.log('You can access the url above or scan this QR code:')
  qrcode.generate(url, { small: true })
})