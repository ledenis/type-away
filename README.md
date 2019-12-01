# Type Away

> Use your smartphone to type any text (including chinese!) to your PC.

This is a server which enables remote devices to input UTF-8 text to desktop applications as if it were typed from the local keyboard.

A use case would be to directly use a smartphone as a remote handwriting pad to write chinese/japanese characters. It also works well as voice input method if the device supports it.

## How it works

Clients use Socket.IO to send text input to the server, which in turn write the text using either:
* `xdotool` (Linux only): simulate keyboard input
* or the system clipboard + paste command (`Ctrl/Cmd` + `V`) on Windows and Mac (the latter is untested)

On Linux, you can force the clipboard mode by setting the env variable `TA_USE_CLIPBOARD=true`.

## Requirements

* node

And:
* on Linux:
  * xdotool
* on Windows:
  * nothing special
* on Mac (or with env variable `TA_USE_CLIPBOARD=true` on Linux)
  * Java 8+ (used for sending paste command)

## Installation

    npm install --global type-away

Then:
* on Linux:

      sudo apt-get install xdotool

* on Mac:
    * Install Java (version 8 or above)

## Usage

1. Launch the server:

    `type-away`

2. It will output something like:

    `Listening on http://192.168.0.15:3000`

3. From a remote device (smartphone), open a browser and navigate to the given url (or scan the QR code)
4. Input your text into the webpage

   The text is now written to the focused application.

## License

MIT
