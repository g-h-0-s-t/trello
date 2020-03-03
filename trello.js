// Somewhat complete, let me know if my codes messy, I always choose python over javascript, as i know I can create a cleaner product faster!

const axios =  require('axios');

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
    console.log(cards)
    cards.map( card => {
        if (card.name.search(card.id)) {
            card.name = `${card.id} - ${card.name}`;
            axios.put(url + `cards/${card.id}?${AUTH}`, card)
                .then(console.log(`Name change successful: ${card.name}`))
                 .catch(err => handleErrors(err))
        };
    })

};
// Creates webhook, returns id
// Token: trello oauth token
// URL: callback url
// watch: id of w/e you want to watch
// webhook watchs id for actions (createboard/update board etc)
function createHook(TOKEN, URL, watch) {
    const data = {
        description: 'Created using API',
        callbackURL: URL,
        idModel: watch
    };

    axios.post(`https://api.trello.com/1/tokens/${TOKEN}/webhooks`, data)
         .catch(err => handleErrors(err))
    
    return watch;
};

// Runs createHook function on every board, and updateCard function on every card
function start(AUTH) {
    // Get users "me" boards and return url's to get all cards
    let boardIds = getBoardIds(AUTH).then(boards => boards.map( boards => `/boards/${createHook(boards.id)}/cards` ) )
    // Get cards, update them & send them back
    let cards = boardIds.then(boardIds => {console.log(boardIds); getCards(boardIds, AUTH);})
    cards.then(cards => updateCards(cards[0], AUTH))
    return true;
};

function updateCard(AUTH, card) {
    if (card.name.search(card.id)) {
        card.name = `${card.id} - ${card.name}`;
        axios.put(url + `cards/${card.id}?${AUTH}`, card)
            .then(console.log(`Name change successful: ${card.name}`))
             .catch(err => handleErrors(err))
    };
};

module.exports = { updateCard,
                   createHook,
                   start, };