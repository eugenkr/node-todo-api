const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB!');
  }

  db.collection('Todos').find({ _id: new ObjectID('598c6a2b13c07fb3e6fcd015') }).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (error) => {
    console.log('Unable to fetch todos!');  
  });

  console.log('Connected to MongoDB');

  db.close();
});