const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB!');
  }

  console.log('Connected to MongoDB');

  // deleteMany
  // db.collection('Todos').deleteMany({ text: 'Fuel a car' }).then((res) => {
  //   console.log(res);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({ text: 'Fuel a car' }).then((res) => {
  //   console.log(res);
  // });

  // findOneAndDelete
  db.collection('Todos').findOneAndDelete({ completed: true }).then((res) => {
    console.log(res);
  });

  // db.close();
});