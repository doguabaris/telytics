/**
 * @file logger.ts
 * @description Handles persistent logging of telemetry payloads in NDJSON format.
 *
 * This module creates a writable log file (`events.ndjson`) under a `logs/` directory
 * and appends each telemetry log (`LogPayload`) as a newline-delimited JSON object.
 *
 * Designed to be used by the collector's `ingestHandler()` to persist incoming logs.
 *
 * NDJSON (Newline-Delimited JSON) is used for efficient streamable logging.
 *
 * Example line:
 * ```json
 * {"type":"error","message":"Something broke","timestamp":1714430098765,"app":"my-dapp","release":"v1.0.0"}
 * ```
 *
 * @remarks
 * - The `logs` directory is created automatically if it doesn't exist.
 * - Log appending is done using a file stream in append mode (`flags: 'a'`).
 *
 * @author     Doğu Abaris <abaris@null.net>
 * @license    MIT
 * @see        ../types/LogPayload.ts
 */

import fs from 'fs';
import path from 'path';
import {LogPayload} from '../types/LogPayload';

// Determine logs directory relative to project root
const logsDir = path.resolve(__dirname, '..', '..', 'logs');

// Ensure the directory exists
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, {recursive: true});
}

// File stream in append mode for NDJSON
const logFilePath = path.join(logsDir, 'events.ndjson');
const logStream = fs.createWriteStream(logFilePath, {flags: 'a'});

/**
 * Appends a serialized log payload to the NDJSON file.
 *
 * @param payload - A structured telemetry log to persist to disk.
 */
export function writeLog(payload: LogPayload): void {
	const json = JSON.stringify(payload);
	logStream.write(json + '\n');
}
