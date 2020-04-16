const express = require('express');
const trello = require('./trello.js');

const app = express();
const port = process.env.PORT || 8080
const API_KEY = 'eece05e3fbcf1e761c982cbcc3148bf7';
const TOKEN = 'cbd97c1319aa90c3c254418de55384afb3220187d54b12d91b7dd74c1be45fc4';
const AUTH = `key=${API_KEY}&token=${TOKEN}`;
// Your call back url
const URL = 'https://new43.herokuapp.com';
// 
// Finds all cards and updates them
app.get('/api/start', (req, res) => {
    res.status(201).json({ value: trello.start(AUTH, URL) });
})

// Head request shows trello callback is valid
app.use(express.json())
// Watch member for new board
app.head('/api/notifications/boards', (req, res) => res.status(200).json({value: 'success'}))
app.post('/api/notifications/boards', (req, res) => { 
    req.action !== undefined ? req.action.createBoard ? trello.createHook(TOKEN, URL, req.data.board.id) : res.json({'value': null}) : res.json({'value': null})

})
// Watch boards for new cards
app.head('/api/notifications/cards', (req, res) => res.status(200).json({value: 'success'}))
app.post('/api/notifications/cards', (req, res) => !req.action.createCard ? trello.updateCard(AUTH, req.data.card) : res.json({'value': null}))

app.get('/api/webhooks', (req, res) => res.status(200).json({value: trello.readBoardIds()}))
app.listen(port)
