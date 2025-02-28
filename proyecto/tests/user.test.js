const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../config/firebase', () => {
  
  const createUserMock = jest.fn().mockResolvedValue({
    uid: 'fakeUid123',
    displayName: 'Test User'
  });

  const setMock = jest.fn().mockResolvedValue(true);
  const docMock = jest.fn(() => ({ set: setMock }));
  const collectionMock = jest.fn(() => ({ doc: docMock }));

  const firestore = () => ({
    collection: collectionMock,
    FieldValue: {
      serverTimestamp: jest.fn(() => "timestamp")
    }
  });

  const admin = {
    auth: jest.fn(() => ({ createUser: createUserMock })),
    firestore: firestore
  };

  return { admin };
});

// traer router pa testear
const userRouter = require('../routes/CreateUser');

// abrirlo para que pueda llamar de api
const app = express();
app.use(bodyParser.json());
app.use('/api/users', userRouter);

//test 1 crear usuario todo ok 
describe('POST /api/users', () => {
  it('debería crear un usuario y retornar status 201', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'secret',
        nombre: 'Test User',
        rol: 'admin'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId', 'fakeUid123');
    expect(response.body).toHaveProperty('status', 'success');
  });

  //test 2 faltan los parametros o alguno deberia dar error

  it('debería retornar error 400 si faltan campos requeridos', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'secret'
        // Falta nombre y rol
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email, password, nombre, or rol missing');
  });

  // test 3 lo que deberia hacer si firebase falla, deberia dar error 

  it('debería retornar error 500 si createUser falla', async () => {

    const { admin } = require('../config/firebase');
    admin.auth.mockImplementationOnce(() => ({
      createUser: jest.fn().mockRejectedValue(new Error('Firebase auth error'))
    }));
    
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'fail@example.com',
        password: 'secret',
        nombre: 'Fail User',
        rol: 'admin'
      });
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('status', 'Internal Server Error');
    expect(response.body.message).toContain('Firebase auth error');
  });
});
