# Web Voice Message

A web server that receives a mp3 file and plays it on the host computer.

There is also a simple client application developed in Vue.js for recording mp3.

Useful only for short messages because the whole audio is buffered on
the client and sent via XHR request. XHR  should be swapped for Socket.IO
and the message sent in chunks while recording for better performance and
longer messages.

Requires FFMPEG to be installed with ffplay.

## Install

```shell script
git clone https://github.com/alexandrucancescu/Web-Voice-Message.git
cd Web-Voice-Message
npm install --production
node dist/Run.js

```