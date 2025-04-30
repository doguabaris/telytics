/**
 * @file fetchUtils.ts
 * @description Handles HTTP transmission of telemetry payloads to the configured endpoint.
 *
 * This utility is responsible for sending structured telemetry data to a remote collector
 * using a simple POST request. It uses the Fetch API and includes minimal error handling.
 * Failures are silently ignored except for a console warning.
 *
 * @example
 * ```ts
 * const payload: LogPayload = {
 *   type: 'error',
 *   message: 'Something went wrong',
 *   app: 'my-dapp',
 *   release: 'v1.2.3',
 *   timestamp: Date.now()
 * };
 *
 * await sendLog('https://observe.example.dev/api/ingest', payload);
 * ```
 *
 * @remarks
 * This function is internal and used by the `Telemetry` class.
 * It assumes the payload is already well-formed.
 *
 * @author     Doğu Abaris <abaris@null.net>
 * @license    MIT
 * @see        ../core/Telemetry.ts
 */

import {LogPayload} from '../core/types';

/**
 * Sends a telemetry log payload to the given collector endpoint via HTTP POST.
 *
 * @param endpoint - Fully qualified URL of the telemetry collector.
 * @param payload - Structured telemetry event data.
 * @returns A Promise that resolves when the request is completed or fails silently.
 */
export async function sendLog(endpoint: string, payload: LogPayload): Promise<void> {
	try {
		await fetch(endpoint, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload)
		});
	} catch (err) {
		console.warn('Telemetry send failed:', err);
	}
}
