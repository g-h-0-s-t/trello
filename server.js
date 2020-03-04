const express = require('express');
const trello = require('./trello.js');

const app = express();
const port = process.env.PORT || 8080
const API_KEY = 'eece05e3fbcf1e761c982cbcc3148bf7';
const TOKEN = '86026753fef3c550ce06e63f5f1b1ec5d7aadd339068d95483485b001de49083';
const AUTH = `key=${API_KEY}&token=${TOKEN}`;

// Finds all cards and updates them
app.get('/api/start', (req, res) => res.status(201).json({value: trello.start(AUTH)}))

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

app.listen(port)
