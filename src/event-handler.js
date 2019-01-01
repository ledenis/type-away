const os = require('os')
const { execSync } = require('child_process')
const clipboardy = require('clipboardy')
const keySender = require('node-key-sender')
const { logger } = require('./logger')

const xdotoolTypeDelayInMs = 800
const useXdotool = os.platform() === 'linux' && process.env.TA_USE_CLIPBOARD !== 'true'

module.exports = {
  typeText,
  pressKey,
}

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
      logger.error(`key '${key}' not supported`)
      return
    }
    keySender.sendKey(ksKeyCode)
  }
}
