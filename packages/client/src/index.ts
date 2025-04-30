/**
 * @file index.ts
 * @description Public entrypoint for the Solana Observe telemetry SDK.
 *
 * This module exposes the primary API functions:
 *  - `initTelemetry()` - to initialize the telemetry client
 *  - `trackError()` - to report captured errors and runtime issues
 *  - `trackInfo()` - to log informational events
 *  - `trackTransaction()` - to report transaction-related activity
 *
 * Designed for use in Solana-based dApps and web front-ends.
 *
 * @example
 * ```ts
 * import { initTelemetry, trackError, trackInfo, trackTransaction } from '@solana-observe/client';
 *
 * initTelemetry({
 *   endpoint: 'https://observe.myapp.dev/api/ingest',
 *   app: 'my-dapp',
 *   release: 'v1.0.0'
 * });
 *
 * try {
 *   throw new Error('RPC timeout');
 * } catch (err) {
 *   trackError(err, { route: '/stake' });
 * }
 *
 * trackInfo('User connected wallet', { wallet: 'Phantom' });
 *
 * trackTransaction('User staked tokens', {
 *   txId: '0xabc123',
 *   amount: 500,
 *   token: 'SOL'
 * });
 * ```
 *
 * @author     Doğu Abaris <abaris@null.net>
 * @license    MIT
 * @see        ./core/Telemetry.ts
 */

import {Telemetry} from './core/Telemetry';
import {TelemetryOptions} from './core/types';

let telemetry: Telemetry | null = null;

/**
 * Initializes the telemetry system with the given configuration.
 *
 * @param options - Telemetry configuration including endpoint, app name, and release version.
 * @remarks This function should typically be called once at application startup.
 */
export function initTelemetry(options: TelemetryOptions): void {
	telemetry = new Telemetry(options);
}

/**
 * Sends a captured error to the telemetry endpoint.
 *
 * @param error - Any caught error (can be Error object or anything else).
 * @param context - Optional metadata such as route, method name, or user session info.
 * @remarks Requires `initTelemetry()` to have been called first.
 *
 * @example
 * ```ts
 * trackError(new Error('Something broke'), { route: '/dashboard' });
 * ```
 */
export async function trackError(
	error: unknown,
	context?: Record<string, unknown>
): Promise<void> {
	if (!telemetry) {
		console.warn('Telemetry not initialized. Call initTelemetry() first.');
		return;
	}
	await telemetry.trackError(error, context);
}

/**
 * Sends a generic info log to the telemetry endpoint.
 *
 * @param message - Informational message string describing the event.
 * @param context - Optional metadata such as user action, component, or debug context.
 * @remarks Requires `initTelemetry()` to have been called first.
 *
 * @example
 * ```ts
 * trackInfo('User connected wallet', { wallet: 'Phantom' });
 * ```
 */
export async function trackInfo(
	message: string,
	context?: Record<string, unknown>
): Promise<void> {
	if (!telemetry) {
		console.warn('Telemetry not initialized. Call initTelemetry() first.');
		return;
	}
	await telemetry.trackInfo(message, context);
}

/**
 * Sends a transaction-related log to the telemetry endpoint.
 *
 * @param message - Description of the transaction or interaction.
 * @param context - Optional metadata such as transaction ID, method, or user wallet.
 * @remarks Requires `initTelemetry()` to have been called first.
 *
 * @example
 * ```ts
 * trackTransaction('User swapped tokens', {
 *   txId: '0xdef456',
 *   pair: 'SOL/USDC',
 *   amount: 120.5
 * });
 * ```
 */
export async function trackTransaction(
	message: string,
	context?: Record<string, unknown>
): Promise<void> {
	if (!telemetry) {
		console.warn('Telemetry not initialized. Call initTelemetry() first.');
		return;
	}
	await telemetry.trackTransaction(message, context);
}
