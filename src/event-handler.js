const os = require('os')
const { execSync } = require('child_process')
const clipboardy = require('clipboardy')
const keySender = require('node-key-sender-cmd-fix')
const { logger } = require('./logger')

const xdotoolTypeDelayInMs = 800
const useXdotool = os.platform() === 'linux' && process.env.TA_USE_CLIPBOARD !== 'true'
const isMac = os.platform() === 'darwin'

module.exports = {
  typeText,
  pressKey,
}

async function typeText(text) {
  if (useXdotool) {
    execSync(`xdotool type --delay ${xdotoolTypeDelayInMs} "${escapeDoubleQuotes(text)}"`)
  } else {
    const previousContent = clipboardy.readSync()
    clipboardy.writeSync(text)
    await pasteClipboard()
    clipboardy.writeSync(previousContent)
  }
}

function escapeDoubleQuotes(msg) {
  return msg.replace(/"/g, '\\"')
}

async function pasteClipboard() {
  if (isMac) {
    await keySender.sendCombination(['meta', 'v'])
  } else {
    await keySender.sendCombination(['control', 'v'])
  }
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
