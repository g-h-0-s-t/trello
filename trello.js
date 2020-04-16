// Somewhat complete, let me know if my codes messy, I always choose python over javascript, as i know I can create a cleaner product faster!

const axios = require('axios');
const fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };


function handleErrors(err) {
    switch(err.response.status) {
        case 433:
            sleep(90000);
            return err;
        case 401:
            return err        
    }
};

// Gets the all the boards for a specific member, defaults to me
function getBoardIds(AUTH, CALLBACK_URL, member='me') {
    const url = `https://api.trello.com/1/members/${member}/boards?${AUTH}`;
    return axios.get(url)
        .then(res => {
            // Creates a webhook on the member
             res.data.id in readUserIds() ? false : createHook(AUTH, CALLBACK_URL + '/api/notifications/boards', res.data.id, writeUserIds);
             return res.data;
        })
         .catch(err => console.error(err))
};

function boardIdsToRequests(AUTH, board_ids) {
    return board_ids.map( boards => {
        `/boards/${ boards.id in readBoardIds() ? boards.id : createHook(AUTH, URL + '/api/notifications/boards', boards.id, writeBoardIds)}/cards`;
    }); 
}
// gets the card objects from a board, uses batch to save api calls
function getCards(AUTH, requests) {
    let url = 'https://api.trello.com/1/batch?urls=';
    return axios.get(url + `${requests.join(',')}&${AUTH}`)
     .then(res => {
         return res.data.map(data => {
             return data['200'];}
         ) 
     })
      .catch(err => console.error(err))

};

// updates an array of cards
function updateCards(AUTH, cards) {
    cards.map( card => updateCard(AUTH, card))
};


function readJson(filename) {
    return JSON.parse(fs.readFileSync(`./ids/${filename}`)).ids;
};

function writeIdIntoJson(filename, readFunc, id) {
    let ids = readFunc();
    ids.push(id);
    const json_ids = JSON.stringify(ids)
    fs.writeFileSync(`./ids/${filename}`, json_ids)
}

function readUserIds() { return readJson('user_ids.json'); }
function readBoardIds() { return readJson('board_ids.json'); }

function writeUserIds(id) { writeIdIntoJson('users_ids.json', readUserIds, id); }
function writeBoardIds(id) { writeIdIntoJson('board_ids.json', readBoardIds, id); }



// Creates webhook, returns id
// Token: trello oauth token
// URL: callback url
// watch: id of w/e you want to watch
// webhook watches id for actions (createboard/update board etc)

function createHook(AUTH, URL, watch, writeFunc) {
    
    const data = {
        description: 'Created using API',
        callbackURL: URL,
        idModel: watch
    };

    axios.post(`https://api.trello.com/1/webhooks?${AUTH}`, data)
        .then(res => res.ok ? console.log(`successfully watching ${watch}`) : console.log(`failed to create webhook for ${watch}`))
         .catch(err => {
             console.log(handleErrors(err));
          })
    
    writeFunc(watch);
    return watch;
};

// Runs createHook function on the chosen, member (defaults to me, and every boar.
// Then runs updateCard function on every card
function start(AUTH, URL, USER) {
    // Get users "me" boards and return url's to get all cards
    let requests_to_boards = getBoardIds(AUTH, URL, USER).then(board_ids => { boardIdsToRequests(AUTH, board_ids) });
        
    // Get cards, update them & send them back
    let cards_in_boards = requests_to_boards.then(requests => { 
        return getCards(AUTH, requests); 
    });

    cards_in_boards.then(cards_in_boards => { 
        cards_in_boards.map(cards_in_board => {
            updateCards(AUTH, cards_in_board);
        });
    });
    return true;
};

function updateCard(AUTH, card) {
    const url = 'https://api.trello.com/1/';
    if (card.name.search(card.id)) {
        card.name = `${card.id} - ${card.name}`;
        axios.put(url + `cards/${card.id}?${AUTH}`, card)
            .then(res => console.log(`Name change successful: ${card.name}`))
             .catch(err => console.log(handleErrors(err)))
    };
};

module.exports = { updateCards,
                   createHook,
                   start,
                   readBoardIds, };