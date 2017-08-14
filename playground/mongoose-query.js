
const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');

let id = '5991943cfe7111a341ee1ac5';

if (!ObjectID.isValid(id)) {
  console.log('ID is not valid');
}

Todo.find({
  _id: id
}).then(todos => console.log('Todos', todos));

Todo.findOne({
  _id: id
}).then(todos => console.log('Todos findOne', todos));

Todo.findById(id)
  .then(todos => console.log('Todos findById', todos))
  .catch(e => console.log(e));

