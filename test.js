// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const {
  updateSavedToken,
  getCurrentToken,
  connectToMongoDB,
  insertNewObject,
  getObj,
  clearDatabase,
} = require("./mongo");
const { isTokenValid, getNewToken } = require("./auth");
const moment = require("moment"); // require


function getDomain (link){
  let regex = /https:\/\/(.*?)\//g;
  let  res = regex.exec(link);
  // link.match(regex)  
  return res[1];
}

let links = [
  {
    site: "hoangha",
    links: [
        `https://hoanghamobile.com/iphone-12-series-c2651.html`,
        `https://hoanghamobile.com/iphone-11-series-c2535.html`,
        `https://hoanghamobile.com/iphone-88-plus-c2364.html`,
        `https://hoanghamobile.com/iphone-se-c2154.html`,
        `https://hoanghamobile.com/iphone-77-plus-c2363.html`,
        `https://hoanghamobile.com/ipad-97-2018-c2325.html`,
        `https://hoanghamobile.com/ipad-pro-c2126.html`,
        `https://hoanghamobile.com/airpods-2-c2644.html`,
        `https://hoanghamobile.com/airpods-pro-c2645.html`,
        `https://hoanghamobile.com/macbook-air-c2646.html`,
        `https://hoanghamobile.com/macbook-pro-c2647.html`,
        `https://hoanghamobile.com/apple-watch-series-3-c2649.html`,
        `https://hoanghamobile.com/apple-watch-series-5-c2650.html`,
    ],
  },
];
// hoang ha 

async function getProducts({links}) {
  
  await connectToMongoDB();
  for (link of links){
    var domain = getDomain(link);
    let res = await fetch(
      link
     );
   
     let text = await res.text();
    
     let $ = cheerio.load(text);
   
     let items = $(".list-item");

     items.each((index, item) => {
       let name = $("h4", ".product-name", item).text();
       let price = $(".product-price", item).text();
   
       insertNewObject(index, { name, price, domain });
     });
  }
  
}

function query(){
  // mobile city
  let items = $(".product-list-item");
  items.each ( (i, phone)=>{
    let name = $("a",".name");
  })
}
const queries = {
  
  mobilecity: {
    listItem: '.product-list-item',
    name: 'a,.name',
    price: '.price'
  }
}

console.log(queries.mobilecity.name.split(","));
async function getProducts({links}) {
 
let {listItem,name,price}=queries.mobilecity;
  await connectToMongoDB();
  for (link of links){
    var domain = getDomain(link);
    let res = await fetch(
      link
     );
   
     let text = await res.text();
    
     let $ = cheerio.load(text);
   
     let items = $(listItem);

     items.each((index, item) => {
       let name = $("h4", ".product-name", item).text();
       let price = $(".product-price", item).text();
   
       insertNewObject(index, { name, price, domain });
     });
  }
  
}



// getProducts(links[0]);