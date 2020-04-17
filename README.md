
# Trello Card Naming Automation

It will add a hook to every new board from your chosen member, It then updates the name of the cards within the board to it's id.

## Instructions
To start, change the followg variables in trello.js.

API_KEY - You can find it here: 
TOKEN  - You can find it here
CALLBACK_URL - 
USER - Your member, defaults to "me" if not specified 


Finally, Send a GET request to [/api/start/] which does the above, it only needs to be run once per member


Member and Board id's are saved in ./ids. To prevent wasted trello api calls always backup the files.
To clear all the webhooks associated with your token, and the ids folder send a DELETE request to [/api/webhook].
