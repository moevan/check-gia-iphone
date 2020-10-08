// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.

const puppeteer = require("puppeteer");

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
const { insertData } = require("./sheets.js");
const { isTokenValid, getNewToken } = require("./sheets");
const moment = require("moment"); // require


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
};

const listJsWeb = {
  fptshop: [
    `https://fptshop.com.vn/dien-thoai/apple-iphone`,
    `https://fptshop.com.vn/may-tinh-xach-tay/apple-macbook`,
    `https://fptshop.com.vn/may-tinh-bang/apple-ipad`,
    `https://fptshop.com.vn/smartwatch/apple-watch`,
  ],
};

const mobileCity = {
  mobilecityPages: [
    `https://mobilecity.vn/dien-thoai-apple`,
    `https://mobilecity.vn/may-tinh-bang-ipad`,
  ],
  cookies: [
    {
      value: "1",
      location: "Ha Noi",
    },
    {
      value: "2",
      location: "Ho Chi Minh",
    },
    {
      value: "3",
      location: "Da Nang",
    },
  ],
};
const cellPhones = {
  cellphonesPages: [
    `https://cellphones.com.vn/do-choi-cong-nghe/apple-watch.html`,
    `https://cellphones.com.vn/mobile/apple.html`,
    `https://cellphones.com.vn/tablet/ipad-pro.html`,
    `https://cellphones.com.vn/tablet/ipad-air.html`,
    `https://cellphones.com.vn/tablet/ipad-mini.html`,

    `https://cellphones.com.vn/tablet/ipad-9-7.html`,

    `https://cellphones.com.vn/laptop/mac.html`,
    `https://cellphones.com.vn/tablet/ipad-10-2.html`,
  ],
  cookies: [
    {
      location: "Ha Noi",
      value: "hanoi",
    },
    {
      location: "Ho Chi Minh",
      value: ""
    }
  ],
};

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
        listItem: $("[data-id]", ".products-container"),
        name: $("#product_link", item),
        price: $(".price", ".special-price", item),
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
  function getDetail(text, web, location) {
    if (!location) {
      location = 'vietnam';
    }
    $ = cheerio.load(text);
    let items = selector[web]().listItem;
    items.each((index, item) => {
      let name = selector[web](item).name.text().trim();
      let price = selector[web](item).price.text();
      if (web == 'techone' || web == 'hoanghamobile') {

        if (price.match(/₫/g) && price.match(/₫/g).length == 2) {

          price = price.match(/(.*)₫(.*)₫/)[2];


        }

      }

      console.log(name, price, web, location);
      insertNewObject(index, { name, price, web, location });


    });
  }

  await connectToMongoDB();
  await clearDatabase();
  for (web in listWeb) {
    for (link of listWeb[web]) {

      let res = await fetch(link);
      let text = await res.text();
      getDetail(text, web);
    }

  }
  for (web in listJsWeb) {
    for (link of listJsWeb[web]) {
      let text = await (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(link);
        const body = await page.$("body");
        const text = body.evaluate(el => el.innerHTML);

        return text;
      })();
      getDetail(text, web);
    }
  }

  for (link of mobileCity.mobilecityPages) {
    let web = "mobilecity";

    for (cookie of mobileCity.cookies) {
      let text = await (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(link);

        await page.setCookie(
          { name: "location", value: cookie.value },
          { name: "location_name", value: cookie.location }
        );

        await page.reload();

        const button = await page.$("#product_view_more");
        const div = await page.$(".viewmore");

        isMorePosts = async function () {
          const style = await div.evaluate((el) => el.getAttribute("style"));
          console.log(style == null);
          if (style == null) {
            await button.click();
            await page.waitForTimeout(1000);
            isMorePosts();
          }
        };
        await isMorePosts();

        const body = await page.$("body");
        const text = body.evaluate((el) => el.innerHTML);

        return text;
      })();

      getDetail(text, web, cookie.location);
    }
  }

  for (link of cellPhones.cellphonesPages) {
    let web = "cellphones";

    for (cookie of cellPhones.cookies) {

      let text = await (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(link);
        await page.setCookie({ name: "store", value: cookie.value });
        await page.reload();
        let body = await page.$("body");
        let text = await body.evaluate((el) => el.innerHTML);



        async function howManyPages(page) {
          const pages = await page.$(".pagination", ".pages");
          if (pages != null) {

            const quantity = await pages.evaluate(
              (el) => Object.keys(el.children).length
            );

            return quantity;
          }
          return 1;
        }

        pageNum = await howManyPages(page);

        if (pageNum > 1) {
          for (let i = 2; i < pageNum; i++) {
            await page.goto(`${link}?p=${i}`);
            let bodyNew = await page.$("body");
            let textNew = await bodyNew.evaluate((el) => el.innerHTML);
            text += textNew;

          }
        }



        return text;
      })();

      getDetail(text, web, cookie.location);
    }
  }
}



(async function () {
  await getProducts();
  insertData();
})();
