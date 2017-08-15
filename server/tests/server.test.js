const request = require('supertest');
const expect = require('expect');
const { ObjectID} = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');


const todos = [
  { _id: new ObjectID(), text: 'First todo' },
  { _id: new ObjectID(), text: 'Second todo' },
  { _id: new ObjectID(), text: 'Third todo' }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create new todo', (done) => {
    let text = todos[0].text;

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }

        Todo.find().then(t => {
          expect(t.length).toBe(todos.length + 1);
          expect(t[0].text).toBe(text);
          done();          
        })
        .catch(e => done(e));
      });
  });

  it('should not create todo with invalid data', (done) => {
    request(app)
      .post('/todos')
      .send()
      .expect(400)
      .end((error, res) => {
        if (error) {
          return done(error);
        }

        Todo.find().then(t => {
          expect(t.length).toBe(todos.length);
          done();          
        })
        .catch(e => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(todos.length);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo', (done) => {
    request(app)
      .get(`/todos/${ todos[0]._id.toHexString() }`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  
  it('should return 404 if todo not found', done => {
    let id = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${ id }`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
    .get(`/todos/123`)
    .expect(404)
    .end(done);
});
});
