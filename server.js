const express = require('express');
const trello = require('./trello.js');

const app = express();
const port = process.env.PORT || 8080
const API_KEY = 'eece05e3fbcf1e761c982cbcc3148bf7';
const TOKEN = 'cbd97c1319aa90c3c254418de55384afb3220187d54b12d91b7dd74c1be45fc4';
const AUTH = `key=${API_KEY}&token=${TOKEN}`;
const USER = 'me';
// Your callback url
const CALLBACK_URL = 'https://new43.herokuapp.com';

app.use(express.json())

// Finds all cards and updates them
app.get('/api/start', (req, res) => {
    res.status(201).json({ value: trello.start(AUTH, CALLBACK_URL, USER) });
})

// Head request shows trello callback is valid

// Watch member for new board
app.head('/api/notifications/boards', (req, res) => res.status(200).json({value: 'success'}))
app.post('/api/notifications/boards', (req, res) => { req.body.action.type === 'createBoard' ? trello.createHook(AUTH, CALLBACK_URL + '/api/notifications/cards', req.body.action.data.board.id, trello.writeUserIds) : res.json({'value': null}) })
// Watch boards for new cards
app.head('/api/notifications/cards', (req, res) => res.status(200).json({value: 'success'}))
app.post('/api/notifications/cards', (req, res) => req.body.action.type == 'createCard' ? trello.updateCard(AUTH, req.body.action.data.card) : res.json({'value': null}))
// These return modelIds not webhook ids
app.get('/api/webhooks', (req, res) => res.status(200).json({value: {users: trello.readUserIds(), boards: trello.readBoardIds()} }))
app.delete('/api/webhooks', (req, res) => res.status(200).json({value: trello.removeAllWebhooks(AUTH, TOKEN)}))



app.listen(port)

