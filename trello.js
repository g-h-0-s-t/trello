// Somewhat complete, let me know if my codes messy, I always choose python over javascript, as i know I can create a cleaner product faster!

const axios = require('axios');
const API_KEY = '';
const TOKEN = '';
const AUTH = `key=${API_KEY}&token=${TOKEN}`;

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

function getBoardIds(AUTH) {
    let url = `https://api.trello.com/1/members/me/boards?${AUTH}`;
    return axios.get(url)
        .then(res => { return res.data })
         .catch(err => console.error(err))
};


function getCards(boardIds, AUTH) {
    const url = 'https://api.trello.com/1/batch?urls=';
    return axios.get(url + `${boardIds.join(',')}&${AUTH}`)
     .then(res => {return res.data.map(data => data['200']);} )
      .catch(err => console.error(err))

};


function updateCards(cards, AUTH) {
    const url = 'https://api.trello.com/1/';
    cards.map( card => {
        if (card.name.search(card.id)) {
            card.name = `${card.id} - ${card.name}`;
            axios.put(url + `cards/${card.id}?${AUTH}`, card)
                .then(console.log(`Name change successful: ${card.name}`))
                 .catch(err => handleErrors(err))
        };
    })

};

// function createWebhook() {
//     const data = {
//         description: ''
//         callbackURL: 
//         idModel: 
//     }
//     axios.post('https://api.trello.com/1/tokens/{APIToken}/webhooks', data)
//         .then()
//          .catch(err => handleErrors(err))
// };


// function webhookResponse() {

// }

// AUTH = key=[API_KEY]&token=[TOKEN]
function main(AUTH) {
    // Get users "me" boards and return url's to get all cards
    let boardIds = getBoardIds(AUTH).then(boards => boards.map( boards => `/boards/${boards.id}/cards` ) )
    // Get cards, update them & send them back
    let cards = boardIds.then(boardIds => getCards(boardIds, AUTH))
    cards.then(cards => updateCards(cards[0]), AUTH)
};

// function updateNewCard(card) {

// }
// module.exports(main)

setInterval(main(AUTH), 60000)
