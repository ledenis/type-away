#!/usr/bin/env node

const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const { execSync } = require('child_process')

const internalIp = require('internal-ip')


const typeDelayInMs = 800

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket){
  console.log('a user connected')

  socket.on('type', function(msg){
    console.log('type: ' + msg)

    execSync(`xdotool type --delay ${typeDelayInMs} "${escapeTypeMsg(msg)}"`)
  })

  socket.on('disconnect', function(){
    console.log('user disconnected')
  })
})

function escapeTypeMsg(msg) {
  return msg.replace(/"/g, '\\"')
}

http.listen(3000, function(){
  console.log(`listening on ${internalIp.v4.sync()}:3000`)
})
