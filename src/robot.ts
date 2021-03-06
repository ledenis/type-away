import { execSync } from 'child_process';
import * as clipboardy from 'clipboardy';
import * as sendkeysJs from 'sendkeys-js';
import { logger } from './logger';

export interface Robot {
  typeText(text: string): void;

  pressKey(key: XdotoolKey): void;
}

const xdotoolKeyToWindowsKeyCode: { [key in XdotoolKey]: string } = {
  Return: '{ENTER}',
  BackSpace: '{BKSP}'
};

export class WindowsRobot implements Robot {
  typeText(text: string) {
    let previousContent = this.tryReadClipboard();

    clipboardy.writeSync(text);
    sendkeysJs.send('^v');

    if (previousContent) {
      clipboardy.writeSync(previousContent);
    }
  }

  private tryReadClipboard(): string | undefined {
    try {
      return clipboardy.readSync();
    } catch (error) {
      logger.warn('Could not read from clipboard:', error.stack);
    }
    return;
  }

  pressKey(key: XdotoolKey) {
    const winKeyCode = xdotoolKeyToWindowsKeyCode[key];
    sendkeysJs.send(winKeyCode);
  }
}

const xdotoolKeyToKeySenderJsMacKeyCode: { [key in XdotoolKey]: string } = {
  Return: 'return',
  BackSpace: 'bs'
};

export class MacRobot implements Robot {
  typeText(text: string) {
    const previousContent = clipboardy.readSync();
    clipboardy.writeSync(text);
    sendkeysJs.send('v', ['&']); // Cmd+V
    clipboardy.writeSync(previousContent);
  }

  pressKey(key: XdotoolKey) {
    const macKeyCode = xdotoolKeyToKeySenderJsMacKeyCode[key];
    sendkeysJs.send(macKeyCode);
  }
}

const xdotoolTypeDelayInMs = 800;

export class LinuxRobot implements Robot {
  constructor(private readonly useClipboard: boolean) {}

  typeText(text: string) {
    if (this.useClipboard) {
      const previousContent = clipboardy.readSync();
      clipboardy.writeSync(text);
      execSync(`xdotool key ctrl+v`);
      clipboardy.writeSync(previousContent);
      return;
    }
    execSync(
      `xdotool type --delay ${xdotoolTypeDelayInMs} "${escapeDoubleQuotes(
        text
      )}"`
    );
  }

  pressKey(key: XdotoolKey) {
    execSync(`xdotool key "${key}"`);
  }
}

function escapeDoubleQuotes(msg: string): string {
  return msg.replace(/"/g, '\\"');
}

export enum XdotoolKey {
  Return = 'Return',
  BackSpace = 'BackSpace'
}
