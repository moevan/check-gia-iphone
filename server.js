// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

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
let token;


// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes",
];

async function isAccCreatedAfterDayX(username,dayX) {
  async function getUserAge() {
    let res = await fetch(`https://oauth.reddit.com/user/${username}/about`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    let json = await res.json();

    return json.data.created_utc;
  }
  const timeCreated = await getUserAge();
  return timeCreated > dayX;
}
  
async function filterPosts(posts,dayX){
        
      let j = 1;
      let filtered = [];
      for (i = 0; i < posts.length - 1; i++) {
        var post = posts[i];
        let res = await isAccCreatedAfterDayX(post.data.author, dayX);
     
        if (res &&  post.data.thumbnail.includes("http")) {
          filtered.push({
            _id: j,
            data: {
            
             permalink: post.data.permalink,
              author: post.data.author,
              thumbnail: post.data.thumbnail
            }
          })
        
          j++;
        }
      }
    
      return filtered;
}

async function getNewPosts(subreddit,dayX) {
 
  let res = await fetch(    `https://hoanghamobile.com/iphone-11-series-c2535.html`  );

let text =  res.text();
return text
}
async function handleRedditToken() {
  // test token is valid or not
  const isTokenValidTrue = await isTokenValid();
  if (isTokenValidTrue) {
    token = await getCurrentToken();
  } else {
    // refresh token and update in database
    token = await getNewToken();
    updateSavedToken(token);
  }
}



// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
// listen for requests :)
const listener = app.listen(8080, () => {
  console.log("Your app is listening on port " + 8080);
});

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.post("/posts", jsonParser,(request, response) => {
  async function main(requestBody,response) {
  
    //  connect to db
    await connectToMongoDB();
    await handleRedditToken();
    // do waht i want
    // clearDatabase();
    const posts = await getNewPosts(requestBody.subredditInput);
    let filtered = await filterPosts(posts,parseInt(requestBody.dayInput));
    
    response.json(filtered);
    
  }
  main(request.body,response);
});

getNewPosts().then(res=>console.log(res));