const request = require('supertest');
const app = require('../app'); // Asegúrate de que este sea el archivo correcto donde se configura tu servidor Express

describe('Reserva de Espacios', () => {
    const validReservation = 
    {
        "space_id": "12345",
        "start_time": "2025-05-15T14:00:00Z",
        "end_time": "2025-05-15T16:00:00Z",
        "user_id": "8OUZ28cuNjfdMi0DEDHd"
      };
    test('Debe crear una reserva con datos válidos', async () => {
        const response = await request(app)
            .post('/spaces/reservations')
            .send(validReservation)
            .expect(201);

        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('reservation_id');
        expect(response.body.data).toHaveProperty('pdf_url');
    });
    test('Debe devolver 400 si falta algún campo requerido', async () => {
        const incompleteReservation = { ...validReservation };
        delete incompleteReservation.start_time;

        const response = await request(app)
            .post('/spaces/reservations')
            .send(incompleteReservation)
            .expect(400);

        expect(response.body.status).toBe('Bad request');
    });

    test('Debe devolver 409 si el espacio ya está reservado en ese horario', async () => {
        await request(app).post('/spaces/reservations').send(validReservation);
        const response = await request(app)
            .post('/spaces/reservations')
            .send(validReservation)
            .expect(409);

        expect(response.body.status).toBe('Conflict');
    });

    test('Debe devolver 404 si el espacio no existe', async () => {
        const response = await request(app)
            .post('/spaces/reservations')
            .send({ ...validReservation, space_id: 'ID_INEXISTENTE' })
            .expect(404);

        expect(response.body.status).toBe('Not found');
    });

    test('Debe devolver 400 si los horarios son inválidos', async () => {
        const invalidReservation = {
            ...validReservation,
            start_time: '2025-03-15T12:00:00Z',
            end_time: '2025-03-15T10:00:00Z'
        };
        const response = await request(app)
            .post('/spaces/reservations')
            .send(invalidReservation)
            .expect(400);

        expect(response.body.status).toBe('Bad request');
    });
});
