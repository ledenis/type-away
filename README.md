# IME server

Server for remote X11 IME

Enables remote devices to input UTF-8 characters (such as chinese) to Linux X11 applications.

Clients use socket.IO to send text input to the server, which in turn emulates keyboard input to write the text using xdotool.

## Requirements

xdotool

## License

MIT
