const express = require('express');
// const trello = require('./trello.js')
const app = express()
const port = 3000

const API_KEY = 'eece05e3fbcf1e761c982cbcc3148bf7';
const TOKEN = 'cbd97c1319aa90c3c254418de55384afb3220187d54b12d91b7dd74c1be45fc4';
const AUTH = `key=${API_KEY}&token=${TOKEN}`

// !req.params.id ? res.send('Invalid Params.', 404) : trello(req.params.id)
app.post('/api', (req, res) => console.log(req))
app.listen(port, () => console.log(`Listening on port ${port}!`))