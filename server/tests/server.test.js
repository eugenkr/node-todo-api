const request = require('supertest');
const expect = require('expect');

const { app } = require('../server');
const { Todo } = require('../models/todo');


const todos = [
  { text: 'First todo' },
  { text: 'Second todo' },
  { text: 'Third todo' }
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