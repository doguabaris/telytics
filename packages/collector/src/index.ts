/**
 * @file index.ts
 * @description Entry point for the Telytics collector service.
 *
 * This lightweight HTTP server receives telemetry logs via POST requests
 * and processes them using the `ingestHandler`. Logs may be printed to
 * stdout or persisted to file depending on implementation.
 *
 * The collector exposes the following endpoint:
 *
 *  - `POST /api/ingest`: Accepts a telemetry log payload (`LogPayload`)
 *
 * Example payload:
 * ```json
 * {
 *   "type": "error",
 *   "message": "Something went wrong",
 *   "context": { "method": "submitTransaction" },
 *   "timestamp": 1714440012345,
 *   "app": "test-dapp",
 *   "release": "v1.0.0"
 * }
 * ```
 *
 * @remarks
 * This module is intended to be run in Node.js environments as a microservice.
 *
 * @author     Doğu Abaris <abaris@null.net>
 * @license    MIT
 * @see        ./routes/ingest.ts for request handler
 */

import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {ingestHandler} from './routes/ingest';

dotenv.config({path: path.resolve(__dirname, '../.env.local')});

console.log('process.env.PORT =', process.env.PORT);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.status(200).send('Telytics Collector is running.\nUse POST /api/ingest to submit telemetry.');
});

/**
 * POST /api/ingest
 *
 * Accepts a telemetry log payload and processes it via the `ingestHandler`.
 */
app.post('/api/ingest', ingestHandler);

/**
 * Starts the telemetry collector server.
 */
app.listen(port, () => {
	console.log(`Collector listening on http://localhost:${port}`);
});
