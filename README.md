# Type Away

> Use your smartphone to type any text (including chinese!) to your Linux PC.

This is a server which enables remote devices to input UTF-8 text to Linux GUI applications (X11) as if it is typed from the local keyboard.

A use case would be to directly use a smartphone as a remote handwriting pad to input chinese/japanese characters. It also works well as voice input method if the device supports it.

Clients use Socket.IO to send text input to the server, which in turn emulates keyboard input to write the text using `xdotool`.

## Requirements

* node
* xdotool

## Installation

    sudo apt-get install xdotool
    npm install --global type-away

## Usage

* Launch the server:

    `type-away`

* It will output something like:

    `listening on 192.168.0.15:3000`

* From a remote device (such as a smartphone), open a browser that points to the given address
* Input your text into the webpage
* The text is now emulated to the focused Linux X11 application.

## License

MIT
