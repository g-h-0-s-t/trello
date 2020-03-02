const express = require('express');
const trello = require('./trello.js')
const app = express()
const port = process.env.PORT || 8080
const API_KEY = 'eece05e3fbcf1e761c982cbcc3148bf7';
const TOKEN = 'cbd97c1319aa90c3c254418de55384afb3220187d54b12d91b7dd74c1be45fc4';
const AUTH = `key=${API_KEY}&token=${TOKEN}`

// Head request shows trello callback is valid

app.use(express.json())
// Watch member for new board
app.head('/api/notification/boards', res => res.status(200))
app.get('/api/notifications/boards', (req, res) => req?.action?.createBoard ? trello.createHook(TOKEN, URL, req.data.sa) : '')
// Watch boards for new cards
app.head('/api/notification/cards', res => res.status(200))
app.post('/api/notification/cards', (req, res) => !req?.action?.createCard ? trello.updateCard(AUTH, req.data.card) : '')

app.listen(port)
