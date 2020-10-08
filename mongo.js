const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://van:nhaidepxop@cluster0.z2fgd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


async function connectToMongoDB() {
  await client.connect();
  console.log("Connected successfully to server");
}

async function insertNewObject(id, post) {
  const db = client.db("iphoneScrape");

  const collection = db.collection("products");
  collection.insertOne(post);
}
function clearDatabase() {
  const db = client.db("iphoneScrape");
  db.collection("products").drop();
}


async function getMongoData() {
  await connectToMongoDB();
  const res = await client.db("iphoneScrape").collection("products").find({}, { projection: { _id: 0 } });
  const arr = await res.toArray();
  const arrOfArr = [];
  for (item of arr){
    arrOfArr.push(Object.values(item))
  }
 console.log(arrOfArr);
  return arrOfArr;
}



module.exports = {

  connectToMongoDB,
  insertNewObject,
  getMongoData,
  clearDatabase,
};
