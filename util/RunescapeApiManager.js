const fetch = require('node-fetch');
const url = require('url');
const request = require('request');
const fs = require('fs');

const apiUrl = 'http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=';
const contents = fs.readFileSync("items.json");

// Define to JSON type
var items = JSON.parse(contents);
items = items.map(x => {
  var item = {}
  item.id = x.id;
  item.name = x.name.toLowerCase();
  return item;
})
//api functions
async function getItemDetails(itemName){
    const id = items.find(function(element) {
      return element.name === itemName
    }).id;
    const response = await fetch(apiUrl + id);
    const { item } = await response.json();
    message = `Here's what I've found\n${item.name}\nCurrent Price: ${item.current.price}\n${item.icon}`
    return message;
}

module.exports = {
  getItemDetails
};
