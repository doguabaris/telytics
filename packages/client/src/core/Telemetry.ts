/**
 * @file Telemetry.ts
 * @description Defines the core `Telemetry` class used to send error logs
 *              and context information to a configured remote endpoint.
 *
 * This class is responsible for:
 *  - Accepting telemetry options at initialization time
 *  - Formatting and sending structured error logs
 *  - Providing a minimal API surface for SDK consumers
 *
 * It is typically used internally by the SDK and should not be directly
 * instantiated by most users. Instead, use `initTelemetry()` and `trackError()`
 * from the SDK entrypoint.
 *
 * @example
 * ```ts
 * import { initTelemetry, trackError } from '@solana-observe/client';
 *
 * initTelemetry({
 *   endpoint: 'https://observe.myapp.dev/api/ingest',
 *   app: 'my-dapp',
 *   release: 'v1.2.3'
 * });
 *
 * try {
 *   // risky operation
 * } catch (err) {
 *   trackError(err, { method: 'submitTransaction' });
 * }
 * ```
 *
 * @author     Doğu Abaris <abaris@null.net>
 * @license    MIT
 * @see        ../index.ts
 */

import {LogPayload, TelemetryOptions} from './types';
import {serializeError} from '../utils/errorUtils';
import {sendLog} from '../utils/fetchUtils';

/**
 * Internal class for handling telemetry operations.
 * Not meant to be directly accessed by SDK users.
 */
export class Telemetry {
	private options: TelemetryOptions;

	/**
	 * Creates a new Telemetry instance with the given configuration.
	 *
	 * @param options - Settings for endpoint, app name, and release tag.
	 */
	constructor(options: TelemetryOptions) {
		this.options = options;
	}

	/**
	 * Captures and sends a structured log to the configured endpoint.
	 *
	 * @param type - The type of log (“error”, “info”, “transaction”).
	 * @param message - The log message.
	 * @param context - Optional context metadata.
	 */
	async track(
		type: LogPayload['type'],
		message: string,
		context?: Record<string, unknown>
	): Promise<void> {
		const payload: LogPayload = {
			type,
			message,
			context,
			timestamp: Date.now(),
			app: this.options.app,
			release: this.options.release
		};
		await sendLog(this.options.endpoint, payload);
	}

	/**
	 * Captures and sends an error log.
	 *
	 * @param error - The error to serialize and log.
	 * @param context - Optional context metadata.
	 */
	async trackError(error: unknown, context?: Record<string, unknown>): Promise<void> {
		const message = serializeError(error);
		await this.track('error', message, context);
	}

	/**
	 * Captures an informational log.
	 *
	 * @param message - Info message.
	 * @param context - Optional context metadata.
	 */
	async trackInfo(message: string, context?: Record<string, unknown>): Promise<void> {
		await this.track('info', message, context);
	}

	/**
	 * Captures a transaction-related log.
	 *
	 * @param message - Transaction detail message.
	 * @param context - Optional context metadata.
	 */
	async trackTransaction(message: string, context?: Record<string, unknown>): Promise<void> {
		await this.track('transaction', message, context);
	}
}
