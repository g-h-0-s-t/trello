// Somewhat complete, let me know if my codes messy, I always choose python over javascript, as i know I can create a cleaner product faster!

const axios = require('axios');
const fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };


function handleErrors(err) {
    switch(err.response.status) {
        case 433:
            return sleep(90000);
        case 401:
            return err        
    }
};

function getBoardIds(AUTH, URL) {
    let url = `https://api.trello.com/1/members/me/boards?${AUTH}`;
    return axios.get(url)
        .then(res => { createHook(AUTH, URL + 'notifications/boards', res.data.id); return res.data; })
         .catch(err => console.error(err))
};


function getCards(AUTH, boardIds) {
    const url = 'https://api.trello.com/1/batch?urls=';
    return axios.get(url + `${boardIds.join(',')}&${AUTH}`)
     .then(res => {
         return res.data.map(data => {
             return data['200'];}
         ) 
     })
      .catch(err => console.error(err))

};


function updateCards(AUTH, cards) {
    cards.map( card => updateCard(AUTH, card))

};
// Creates webhook, returns id
// Token: trello oauth token
// URL: callback url
// watch: id of w/e you want to watch
// webhook watchs id for actions (createboard/update board etc)

function readWebhooks() {
    return JSON.parse(fs.readFileSync('webhook_ids.json'));
};

function writeWebhook(id) {
    console.log(id)
    let webhooks = readWebhooks();
    webhooks.push(id);
    let data = JSON.stringify(webhooks);
    fs.writeFileSync('webhook_ids.json', data)
}

function createHook(TOKEN, URL, watch) {
    const data = {
        description: 'Created using API',
        callbackURL: URL,
        idModel: watch
    };

    axios.post(`https://api.trello.com/1/tokens/${TOKEN}/webhooks`, data)
        .then(res => res.ok ? writeWebhook(res.data.id) : console.log(false))
         .catch(err => handleErrors(err))
    
    return watch;
};

// Runs createHook function on every board, and updateCard function on every card
function start(AUTH, TOKEN, URL) {
    // Get users "me" boards and return url's to get all cards
    let boardIds = getBoardIds(AUTH, URL).then(boards => boards.map( boards => `/boards/${createHook(TOKEN, URL, boards.id)}/cards` ) )
    // Get cards, update them & send them back
    let cardsInBoards = boardIds.then(boardIds => getCards(AUTH, boardIds))
    cardsInBoards.then(cardsInBoard => {
        cardsInBoard.map(cards => {
            updateCards(AUTH, cards);
        });
    })
    return true;
};

function updateCard(AUTH, card) {
    const url = 'https://api.trello.com/1/';
    if (card.name.search(card.id)) {
        card.name = `${card.id} - ${card.name}`;
        axios.put(url + `cards/${card.id}?${AUTH}`, card)
            .then(res => console.log(`Name change successful: ${card.name}`))
             .catch(err => handleErrors(err))
    };
};

module.exports = { updateCards,
                   createHook,
                   start,
                   readWebhooks, };