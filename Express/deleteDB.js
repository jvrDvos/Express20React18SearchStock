const { MongoClient } = require('mongodb');

async function deleteDatabase() {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    const db = client.db('food');
    await db.dropDatabase();
    console.log('Base de datos "store" eliminada correctamente.');
    await client.close();
  } catch (err) {
    console.error('Error al eliminar la base de datos:', err);
  }
}

deleteDatabase();