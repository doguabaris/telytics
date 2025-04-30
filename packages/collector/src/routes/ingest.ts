/**
 * @file ingest.ts
 * @description Defines the HTTP handler for telemetry log ingestion.
 *
 * This route accepts structured JSON log payloads (typically from the client SDK)
 * and validates them before writing to persistent storage in NDJSON format.
 *
 * If the payload is valid, it is appended to a local file.
 * Otherwise, a 400 Bad Request is returned.
 *
 * This endpoint is expected to be called from:
 *  - @solana-observe/client via `trackError`, `trackInfo`, or `trackTransaction`
 *  - Internal tooling or backend services emitting structured logs
 *
 * @example
 * curl -X POST http://localhost:3000/api/ingest \
 *   -H "Content-Type: application/json" \
 *   -d '{"type":"info","message":"Ping","timestamp":1714431000000,"app":"my-dapp","release":"v1.0.0"}'
 *
 * @author     Doğu Abaris <abaris@null.net>
 * @license    MIT
 * @see        ../utils/logger.ts
 */

import {Request, Response} from 'express';
import {LogPayload} from '../types/LogPayload';
import {writeLog} from '../utils/logger';

/**
 * Handles incoming POST requests to the /api/ingest endpoint.
 *
 * Validates the structure of the incoming telemetry payload and writes
 * it to the NDJSON log file if valid. Returns HTTP 204 on success,
 * and HTTP 400 if required fields are missing or invalid.
 *
 * @param req - Express request object containing the telemetry payload
 * @param res - Express response object used to send status codes
 */
export function ingestHandler(req: Request, res: Response): void {
	const payload = req.body as Partial<LogPayload>;

	if (
		typeof payload.type !== 'string' ||
		typeof payload.message !== 'string' ||
		typeof payload.timestamp !== 'number' ||
		typeof payload.app !== 'string' ||
		typeof payload.release !== 'string'
	) {
		res.status(400).json({error: 'Invalid payload'});
		return;
	}

	writeLog(payload as LogPayload);
	res.status(204).send();
}
