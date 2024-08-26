const express = require('express');
const bodyParser = require('body-parser');
const { connectToDatabase, getDb } = require('./db');
const { ObjectId } = require('mongodb');

const app = express();
app.use(bodyParser.json());

app.use((req, res, express) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  express();
});


const port = 8000;

connectToDatabase()
    .then(async () => {
      console.log('Connected to the database');

      app.post('/api/food', async (req, res) => {
        const { name, description, stock, price } = req.body;

        const item = {
          title: name,
          details: description,
          total: parseInt(stock),
          cost: parseFloat(price)
        };
      
        try {
          const db = await getDb();
          const result = await db.collection('items').insertOne(item);
          res.status(201).json({ message: 'Item created', id: result.insertedId });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Error creating the item', error: err.message });
        }
      });



      app.get('/api/food', async (req, res) => {
        try {
          const db = await getDb();
          let query = {};
      
          const { name } = req.query;
          if (name) {
            query = { title: { $regex: `.*${req.query.name}.*`, $options: 'i' } };
          }      
      
          const articles = await db.collection('items').find(query).sort({ _id: -1 }).toArray();
      
          const totalArticles = await db.collection('items').countDocuments(query);

          const formattedArticles = articles.map(article => ({
            id: article._id.toString(),
            name: article.title,
            description: article.details,
            stock: article.total,
            price: article.cost
          }));
          
      
          res.status(200).json({
            article: formattedArticles,
            articleCount: totalArticles,
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Error al obtener los artículos', error: err.message });
        }
      });
    


    app.put('/api/food/:id', async (req, res) => {
      const id = req.params.id;
      const { name, description, stock, price } = req.body;
    
      const item = {
        title: name,
        details: description,
        total: stock,
        cost: price
      };
    
      try {
        const db = await getDb();
        const result = await db.collection('items').updateOne({ _id: new ObjectId(id) }, { $set: item });
    
        if (result.modifiedCount > 0) {
          res.json({ message: 'Artículo actualizado' });
        } else {
          res.status(404).json({ message: `Artículo con id ${id} no encontrado` });
        }
      } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
          res.status(400).json({ message: 'Error de validación', error: err.message });
        } else {
          res.status(500).json({ message: 'Error al actualizar el artículo', error: err.message });
        }
      }
    });



    app.delete('/api/food/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const db = await getDb();
        const result = await db.collection('items').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
          res.json({ message: 'Artículo eliminado' });
        } else {
          res.status(404).json({ message: 'Artículo no encontrado' });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el artículo!', error: err.message });
      }
    });

    app.listen(port, () => {
      console.log(`Servidor en ejecución en el puerto ${port}`);
    });
  }).catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });