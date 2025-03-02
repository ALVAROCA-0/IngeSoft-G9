const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mockear el módulo de Firebase para simular las llamadas a Firestore
jest.mock('../config/firebase', () => {
  // Simula la función add para Firestore
  const addMock = jest.fn().mockResolvedValue(Promise.resolve({
    id: 'fakeSpaceId123'
  }));
  const docMock = jest.fn((docId) => ({
    get: () => {
      if (docId === '12345') { //usuario admin simulado 
        return Promise.resolve({
          exists: true,
          data: () => ({ rol: 'admin' })
        });
      } else if (docId === '54321') { //usuario normal simulado
        return Promise.resolve({
          exists: true,
          data: () => ({ rol: 'user' })
        });
      } else {
        return Promise.resolve({  //usuario no existe
          exists: false,
          data: () => (undefined)
        });
      }
    }
  }));
  const collectionMock = jest.fn(() => ({
    doc: docMock,
    add: addMock
  }));
  
  // Simula el método firestore() de admin
  const firestore = () => ({
    collection: collectionMock,
    FieldValue: {
      serverTimestamp: jest.fn(() => "timestamp")
    }
  });

  const admin = {
    firestore: firestore
  };

  return { admin };
});

// Importa el router que queremos testear
const spacesAdmin = require('../routes/spacesAdmin');

// Configura una instancia de Express para el test
const app = express();
app.use(bodyParser.json());
app.use('/api/spaces', spacesAdmin);

describe('POST /api/users', () => {
  it('debería crear un espacio y retornar status 201', async () => {
    const response = await request(app)
      .post('/api/spaces/new')
      .send({
          owner_id: '12345', //usuario test con rol admin
          location: 'test',
          name: 'test',
          capacity: 10
      })
    ;
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Space created correctly');
    expect(response.body).toHaveProperty('space_id','fakeSpaceId123');
    expect(response.body).toHaveProperty('status', 'success');
  });

  //hay 16 combinaciones de los campos obligatorios, y no nos interesa el caso donde estan todos (test de arriba)
  for (var i=0; i<15;i++) {
    var load = {};
    if (i&1) load.owner_id = '12345';
    if (i&2) load.capacity = 10;
    if (i&4) load.location = 'Test location';
    if (i&8) load.name = 'Test name';
    load.equipment = 'Test equipment'
    load.description = 'Test description'
    it('debería retornar error 400 si faltan campos requeridos', async () => {
      const response = await request(app)
      .post('/api/spaces/new')
      .send(load);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Owner_id, name, capacity or location missing');
    });
  }

  it('debería retornar error 404 si no existe el usuario', async () => {
    const response = await request(app)
      .post('/api/spaces/new')
      .send({
        owner_id: '11111', //usuario no existe
        location: 'test',
        name: 'test',
        capacity: 10
      })
    ;
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('status', 'Not Found');
    expect(response.body.message).toContain('Owner not found');
  });

  it('debería retornar error 403 si falla por usuario sin role "admin"', async () => {
    const response = await request(app)
      .post('/api/spaces/new')
      .send({
        owner_id: '54321', //usuario test con rol normal
        location: 'test',
        name: 'test',
        capacity: 10
      })
    ;
    
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('status', 'Forbidden');
    expect(response.body.message).toContain('Owner does not have admin privileges');
  });
});