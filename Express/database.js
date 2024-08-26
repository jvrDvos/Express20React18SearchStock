const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'cool';

async function createItemsCollection() {
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);

  try {
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(c => c.name === 'items');

    if (!collectionExists && collectionExists) {
      await db.createCollection('items', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'details', 'total', 'cost'],
            properties: {
              title: {
                bsonType: 'string',
                description: 'must be a string and is required'
              },
              details: {
                bsonType: 'string',
                description: 'must be a string and is required'
              },
              total: {
                bsonType: 'number',
                description: 'must be a number and is required'
              },
              cost: {
                bsonType: 'number',
                description: 'must be a number and is required'
              }
            }
          }
        }
      });
      console.log('Items collection created successfully');
    } else {
      console.log('Items collection already exists');
    }
  } catch (err) {
    console.error('Error creating items collection:', err);
  } finally {
    await client.close();
  }
}

module.exports = { createItemsCollection };