import * as os from 'os'
import { execSync } from 'child_process'
import * as clipboardy from 'clipboardy'
import * as sendkeysJs from 'sendkeys-js'
import { logger } from './logger'

const xdotoolTypeDelayInMs = 800
const useClipboard = process.env.TA_USE_CLIPBOARD
const isLinux = os.platform() === 'linux'
const isWindows = os.platform() === 'win32'
const isMac = os.platform() === 'darwin'

export async function typeText(text) {
  if (isLinux && !useClipboard) {
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
  if (isWindows) {
    sendkeysJs.send('^v')
  } else if (isMac) {
    sendkeysJs.send('v', ['&']) // Cmd+V
  } else {
    execSync(`xdotool key ctrl+v`)
  }
}

const xdotoolKeyToWindowsKeyCode = {
  'Return': '{ENTER}',
  'BackSpace': '{BKSP}',
}
const xdotoolKeyToKeySenderJsMacKeyCode = {
  'Return': 'return',
  'BackSpace': 'bs',
}

export function pressKey(key) {
  if (isLinux) {
    execSync(`xdotool key "${key}"`)
    return;
  }
  if (isWindows) {
    const winKeyCode = xdotoolKeyToWindowsKeyCode[key]
    if (!winKeyCode) {
      logger.error(`key '${key}' not supported`)
      return
    }
    sendkeysJs.send(winKeyCode)
    return;
  }
  const macKeyCode = xdotoolKeyToKeySenderJsMacKeyCode[key]
  if (!macKeyCode) {
    logger.error(`key '${key}' not supported`)
    return
  }
  sendkeysJs.send(macKeyCode)
}
