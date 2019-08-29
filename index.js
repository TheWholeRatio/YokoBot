
const Discord = require('discord.io');
const fs = require("fs")
const fetch = require("node-fetch");
const util = require('util');
const RunescapeApiManager = require('./util/RunescapeApiManager.js');
const PokemonApiManager = require('./util/PokemonApiManager.js');


const usersFile = fs.readFileSync("./util/users.json");
// make sure your users are set up read README.MD
var { users } = JSON.parse(usersFile);
let isPlayingPokemon = false;
let pokemonAnswer;

var bot = new Discord.Client({
    token: "Enter your token here",
    autorun: true
});

bot.on('ready', function() {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', async function(user, userID, channelID, message, event) {
    console.log(`user: ${user}`);
    console.log(`ChannelId: ${channelID}`);
    console.log(`user id: ${userID}`);

    if (message === "ping") {
        bot.sendMessage({
            to: channelID,
            message: "pong"
        });
    }

      const sequence = message.split(' ')

      if(sequence[0].toLowerCase() == 'yoko'){
        let data = { to:channelID };
        let response;
        const [name, command, ...temp] = sequence
        args = temp.join(' ');

        switch(command) {
          case 'price':
            response = await RunescapeApiManager.getItemDetails(args);
            data = { ...data, message: response, file: null };
            break;
          case 'pokemon':
            if (isPlayingPokemon) {
              console.log(args);
              console.log(pokemonAnswer);
              if (args === pokemonAnswer) {
                let exists = users.find((user) => { return user.id === userID; })
                if (exists){
                  users = users.map((user) => {
                    if (user.id === userID) {
                      return { ...user, pokemonScore: user.pokemonScore + 1 };
                    }
                  })
                }
                else {
                  let newUser = { id: userID, name: user, pokemonScore: 1 }
                  users.push(newUser);
                }
                fs.writeFile('./util/users.json', JSON.stringify({ users }) , 'utf-8', (err) => {
                  if(err) throw err;
                });
                data = { ...data, file: null, message: 'Correct!' }
                isPlayingPokemon = false;
              }
              else {
                data = { ...data, file: './images/unknown.png', message: 'Wrong! Try again.' }
              }
            }
            else {
              pokemonAnswer = await PokemonApiManager.generateRandomUnknownPokemon();
              console.log(pokemonAnswer);
              data = { ...data, file: './images/unknown.png', message: 'Who is this pokemon?' }
              isPlayingPokemon = true;
            }
            break;
          default:
            response = 'N-Nani?';
            data = { ...data, message: response, file: null };
        }

        //Check to see if we have a file to send
        //Else just send a message
        if (data.file) {
          bot.uploadFile(data);
        }
        else {
          console.log("sending message");
          bot.sendMessage(data);
        }
      }
});
bot.on('disconnect', function(erMsg, code) {
    console.log('----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----');
    bot.connect();
});
bot.connect()
