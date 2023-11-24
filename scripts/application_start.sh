#!/bin/bash

DIR="/home/ubuntu/environment/backend"
cd $DIR

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

npm install
#nodemon index.js
npm start-dev
node index.js > app.out.log 2> app.err.log < /dev/null &