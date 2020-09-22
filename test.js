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

function getDomain(link) {
  let regex = /https:\/\/(.*?)\//g;
  let res = regex.exec(link);
  // link.match(regex)
  return res[1];
}

let listWeb = {
  hoanghamobile: [
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
  thegioididong: [
    `https://www.thegioididong.com/dtdd-apple-iphone`,
    `https://www.thegioididong.com/laptop-apple-macbook`,
    `https://www.thegioididong.com/may-tinh-bang-apple-ipad`,
    `https://www.thegioididong.com/dong-ho-thong-minh-apple`,
  ],

  techone: [
    `https://www.techone.vn/iphone-11-pro-max`,
    `https://www.techone.vn/iphone-11-pro`,
    `https://www.techone.vn/iphone-11-cu`,
    `https://www.techone.vn/iphone-xs-max`,
    `https://www.techone.vn/iphone-xs`,
    `https://www.techone.vn/iphone-xr`,
    `https://www.techone.vn/iphone-x`,
    `https://www.techone.vn/iphone-8-plus`,
    `https://www.techone.vn/iphone-8`,
    `https://www.techone.vn/iphone-7-plus`,
    `https://www.techone.vn/iphone-7`,
    `https://www.techone.vn/iphone-cpo`,
    `https://www.techone.vn/macbook`,
    `https://www.techone.vn/ipad`,
    `https://www.techone.vn/apple-watch`,
  ],
  cellphones: [
    `https://cellphones.com.vn/mobile/apple.html`,
    `https://cellphones.com.vn/tablet/ipad-pro.html`,
    `https://cellphones.com.vn/tablet/ipad-air.html`,
    `https://cellphones.com.vn/tablet/ipad-mini.html`,
    `https://cellphones.com.vn/tablet/ipad-10-2.html`,
    `https://cellphones.com.vn/tablet/ipad-9-7.html`,
    `https://cellphones.com.vn/do-choi-cong-nghe/apple-watch.html`,
    `https://cellphones.com.vn/laptop/mac.html`,
  ],
  fptshop: [
    `https://fptshop.com.vn/dien-thoai/apple-iphone`,
    `https://fptshop.com.vn/may-tinh-xach-tay/apple-macbook`,
    `https://fptshop.com.vn/may-tinh-bang/apple-ipad`,
    `https://fptshop.com.vn/smartwatch/apple-watch`,
  ],
  mobilecity: [
    `https://mobilecity.vn/dien-thoai-apple`,
    `https://mobilecity.vn/may-tinh-bang-ipad`,
  ],
};

// hoang ha
async function getProducts() {
  let $;
  let selector = {
    hoanghamobile: function (item) {
      return {
        listItem: $(".list-item"),
        name: $("h4", ".product-name", item),
        price: $(".product-price", item),
      };
    },
    thegioididong: function (item) {
      return {
        listItem: $(".item"),
        name: $("h3", item),
        price: $("strong", ".price", item),
      };
    },
    techone: function (item) {
      return {
        listItem: $(".product_item"),
        name: $("a", ".product_item_title", item),
        price: $(".amount", ".product_item_price", item),
      };
    },
    cellphones: function (item) {
      return {
        listItem: $(".cate-pro-short"),
        name: $("#product_link", item),
        price: $(".price", item),
      };
    },
    fptshop: function (item) {
      return {
        listItem: $(".cdt-product"),
        name: $(".cdt-product__name", item),
        price: $(".progress", item),
      };
    },
    mobilecity: function (item) {
      return {
        listItem: $(".product-list-item"),
        name: $(".name", item),
        price: $(".price", item),
      };
    },

  };

  // await connectToMongoDB();
  for (web in listWeb) {
    for (link of listWeb[web]) {
     
      let res = await fetch(link);
    
      let text = await res.text();
      $ = cheerio.load(text);
   
      let items = selector[web]().listItem;
    
     
      
      items.each((index, item) => {
      
        let name = selector[web](item).name.text();
        let price = selector[web](item).price.text();
        console.log(name, price, web);
        // insertNewObject(index, { name, price, web });
      });
    }
  }
}

// getProducts();
