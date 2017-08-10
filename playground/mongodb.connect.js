//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

let obj = new ObjectID();

console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB!');
  }

  console.log('Connected to MongoDB');

  // db.collection('Todos').insertOne({
  //   text: 'Visit a burber',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
    
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  
  // db.collection('Users').insertOne({
  //   name: 'Yevgen',
  //   location: 'Lviv',
  //   age: 20 
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert user', err);
  //   }
    
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  db.close();
});