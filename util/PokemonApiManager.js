const fetch = require('node-fetch');
const url = require('url');
const request = require('request');
const fs = require('fs');
const ImageTransformer = require('./ImageTransformer.js');


const apiUrl = `https://pokeapi.co/api/v2/`

function getPokemon(pokemonNumber) {
  return get(`pokemon/${pokemonNumber}/`);
}

function get(endpoint) {
  return fetch(
    url.resolve(apiUrl, endpoint),
    {
      method: 'GET',
      credentials: 'include',
    },
  )
    .then((response) => {
      return response.json();
    })
    .then((jsonData) => {
      return jsonData;
    })
    .catch((err) => {
      console.error(err);
      return { status: 'critical', message: 'A server error has occurred.' };
    });
}

function downloadPokemonImage(imageUrl) {
  return new Promise((resolve) => {
    const download = function(uri, filename, callback){
      request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
      });
    };

    download(imageUrl, './images/original.png', function(){
      resolve();
    });
  })
}

async function generateRandomUnknownPokemon() {
  const pokemonId = Math.floor(Math.random() * 400) + 1;
  const data = await getPokemon(pokemonId);
  const name = data.name;
  const imageUrl = data.sprites.front_default;
  await downloadPokemonImage(imageUrl);
  await ImageTransformer.DarkenImage('./images/original.png');

  return name;
}

module.exports = {
  generateRandomUnknownPokemon
};
