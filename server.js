const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const moment = require('moment'); // 시간을 예쁘게 표시하기 위해 moment.js 사용

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // 정적 파일 서빙

let clients = []; // 접속한 클라이언트들을 저장

// 클라이언트가 접속했을 때 실행되는 이벤트
io.on('connection', (socket) => {
    let userName = '';

    socket.on('join', (name) => {
        userName = name;
        clients.push({ id: socket.id, name });
        const joinMessage = `🟢 ${name} joined the chat! 🟢`;
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${name} connected.`);
        io.emit('message', joinMessage);
    });

    // 클라이언트가 메시지를 보냈을 때
    socket.on('chatMessage', (message) => {
        const formattedMessage = `💬 ${userName}: ${message}`;
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${userName}: ${message}`);
        io.emit('message', formattedMessage);
    });

    // 클라이언트가 연결을 끊었을 때
    socket.on('disconnect', () => {
        clients = clients.filter(client => client.id !== socket.id);
        const leaveMessage = `🔴 ${userName} has left the chat. 🔴`;
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${userName} disconnected.`);
        io.emit('message', leaveMessage);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
