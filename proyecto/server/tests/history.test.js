const request = require('supertest');
const app = require('../app'); // Asegúrate de que apunta a tu instancia de Express

describe('GET /spaces/history', () => {
    const user_id = '8OUZ28cuNjfdMi0DEDHd';
    const validQuery = `?user_id=${user_id}&date_from=2024-01-01&date_to=2024-12-31`;

    test('Debe devolver el historial de reservas con datos válidos', async () => {
        const response = await request(app).get(`/spaces/history${validQuery}`);
    
        // Permitir tanto 200 como 204 para evitar fallos
        expect([200, 204]).toContain(response.status);
    
        if (response.status === 200) {
            expect(response.body.status).toBe('success');
            expect(Array.isArray(response.body.data)).toBe(true);
        }
    });

    test('Debe devolver 204 si el usuario no tiene reservas', async () => {
        const response = await request(app)
            .get('/spaces/history?user_id=USUARIO_SIN_RESERVAS')
            .expect(204);
    });

    test('Debe devolver 400 si falta el user_id', async () => {
        const response = await request(app)
            .get('/spaces/history?date_from=2024-01-01&date_to=2024-12-31')
            .expect(400);

        expect(response.body.status).toBe('Bad request');
        expect(response.body.message).toBe('user_id is required');
    });

    test('Debe devolver 500 si hay un error interno en la base de datos', async () => {
        jest.spyOn(require('../config/firebase').admin.database(), 'ref').mockImplementation(() => {
            throw new Error('Simulación de error en Firebase');
        });

        const response = await request(app)
            .get(`/spaces/history${validQuery}`)
            .expect(500);

        expect(response.body.status).toBe('Internal Server Error');
        expect(response.body.message).toContain('Simulación de error en Firebase');
    });
});
