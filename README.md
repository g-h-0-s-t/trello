
# Trello Card Naming Automation

It will add a hook to every new board from your chosen member, It then updates the name of the cards within the board.

## Instructions
To start, change the followg variables in trello.js.

API_KEY
TOKEN
CALLBACK_URL
USER

Finally, Send a GET request to [/api/start/]


Member and Board id's are saved in ./ids, to prevent wasted trello api calls always backup the files.
To clear all the webhooks associated with your token send a DELETE request to [/api/webhook].
