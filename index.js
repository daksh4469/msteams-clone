const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const server = require('http').createServer(app);
const PORT = process.env.PORT || 8000;
const jwt = require('jsonwebtoken');
app.use(express.json());
require('dotenv').config();

const path = require('path');

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('Running');
});

io.on('connection', (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('callUser', { signal: signalData, from, name });
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });
});

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const db = process.env.MONGO_URI;

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username };
    const accessToken = jwt.sign(user, s1);
    res.json({
        accessToken: accessToken,
    });
});

app.use(express.static(path.resolve(__dirname, './client/build')));
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
