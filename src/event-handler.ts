import * as os from 'os'
import { execSync } from 'child_process'
import * as clipboardy from 'clipboardy'
import * as sendkeysJs from 'sendkeys-js'

const xdotoolTypeDelayInMs = 800
const useClipboard = process.env.TA_USE_CLIPBOARD
const isLinux = os.platform() === 'linux'
const isWindows = os.platform() === 'win32'
const isMac = os.platform() === 'darwin'

export async function typeText(text: string): Promise<void> {
  if (isLinux && !useClipboard) {
    execSync(`xdotool type --delay ${xdotoolTypeDelayInMs} "${escapeDoubleQuotes(text)}"`)
  } else {
    const previousContent = clipboardy.readSync()
    clipboardy.writeSync(text)
    await pasteClipboard()
    clipboardy.writeSync(previousContent)
  }
}

function escapeDoubleQuotes(msg: string): string {
  return msg.replace(/"/g, '\\"')
}

async function pasteClipboard(): Promise<void> {
  if (isWindows) {
    sendkeysJs.send('^v')
  } else if (isMac) {
    sendkeysJs.send('v', ['&']) // Cmd+V
  } else {
    execSync(`xdotool key ctrl+v`)
  }
}

export enum XdotoolKey {
  Return = 'Return',
  BackSpace = 'BackSpace',
}

const xdotoolKeyToWindowsKeyCode: {[key in XdotoolKey]: string} = {
  'Return': '{ENTER}',
  'BackSpace': '{BKSP}',
}
const xdotoolKeyToKeySenderJsMacKeyCode: {[key in XdotoolKey]: string} = {
  'Return': 'return',
  'BackSpace': 'bs',
}

export function pressKey(key: XdotoolKey) {
  if (isLinux) {
    execSync(`xdotool key "${key}"`)
    return
  }
  if (isWindows) {
    const winKeyCode = xdotoolKeyToWindowsKeyCode[key]
    sendkeysJs.send(winKeyCode)
    return
  }
  const macKeyCode = xdotoolKeyToKeySenderJsMacKeyCode[key]
  sendkeysJs.send(macKeyCode)
}
