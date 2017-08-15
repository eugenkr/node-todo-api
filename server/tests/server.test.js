const request = require('supertest');
const expect = require('expect');
const { ObjectID} = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');


const todos = [
  { _id: new ObjectID(), text: 'First todo' },
  { _id: new ObjectID(), text: 'Second todo', completed: true, completedAt: 333 },
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

describe('DELETE /todos/:id', () => {
  it('should remove a todo', done => {
    let id = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${ id }`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then(todo => {
            expect(todo).toNotExist();
            done();
          })
          .catch(e => done(e));
      });
  });

  it('return 404 if todo not found', done => {
    let id = new ObjectID().toHexString();
    
    request(app)
      .delete(`/todos/${ id }`)
      .expect(404)
      .end(done);
  });

  it('return 404 if object id is invalid', done => {
    request(app)
    .delete(`/todos/123`)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', done => {
    let id = todos[0]._id.toHexString();
    let text = 'New test text';

    request(app)
      .patch(`/todos/${ id }`)
      .send({ completed: true, text })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBeTruthy();
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  })

  it('should clear completedAt', done => {
    let id = todos[1]._id.toHexString();
    let text = 'New test text!!!!!';
    
    request(app)
      .patch(`/todos/${ id }`)
      .send({ completed: false, text })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBeFalsy();
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);  });
});
