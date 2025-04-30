import request from 'supertest';
import express from 'express';
import {ingestHandler} from '../src/routes/ingest';

const app = express();
app.use(express.json());
app.post('/api/ingest', ingestHandler);

describe('POST /api/ingest', () => {
	it('accepts valid log payload', async () => {
		const res = await request(app).post('/api/ingest').send({
			type: 'error',
			message: 'Something went wrong',
			timestamp: Date.now(),
			app: 'test-dapp',
			release: 'v0.1.0'
		});

		expect(res.status).toBe(204);
	});

	it('rejects invalid payload', async () => {
		const res = await request(app).post('/api/ingest').send({});
		expect(res.status).toBe(400);
	});
});
