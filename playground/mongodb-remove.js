const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// Remove everything from collection
// Todo.remove({}).then(result => {
//   console.log(result);
// });

// Todo.findOneAndRemove({ _id: 'id' }).then(todo => console.log(todo));

Todo.findByIdAndRemove('5992c68ab25c9db30be34775').then(todo => {
  console.log(todo);
});