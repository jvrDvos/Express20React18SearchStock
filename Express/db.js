const { MongoClient } = require('mongodb');

let db;

async function connectToDatabase() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  db = client.db('cool');
}

function getDb() {
  return db;
}

module.exports = {
  connectToDatabase,
  getDb
};