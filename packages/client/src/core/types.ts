/**
 * @file types.ts
 * @description Internal types used by the Solana Observe telemetry client.
 *
 * These types define the configuration and structure of telemetry payloads
 * sent to the remote logging endpoint.
 *
 * Although primarily used internally by the SDK, they can be referenced
 * by downstream consumers via `TelemetryOptions` and `LogPayload`.
 *
 * @author     Doğu Abaris <abaris@null.net>
 * @license    MIT
 * @see        ../index.ts for SDK entrypoint
 */

/** @internal */
/**
 * Configuration object passed to `initTelemetry()`.
 *
 * This determines where telemetry logs are sent and how they are tagged.
 */
export interface TelemetryOptions {
	/** Full URL of the telemetry collector endpoint. */
	endpoint: string;

	/** Application or project name (e.g., "everiqo", "nft-dashboard"). */
	app: string;

	/** Current release version of the app (e.g., "v1.0.0", "2025.04.29-alpha"). */
	release: string;
}

/** @internal */
/**
 * Shape of a telemetry log payload sent to the collector.
 *
 * Used internally by `trackError()` and related functions.
 */
export interface LogPayload {
	/** Type of log event (error, info, or transaction). */
	type: 'error' | 'transaction' | 'info';

	/** A human-readable or serialized representation of the error or message. */
	message: string;

	/** Optional contextual metadata (e.g., route, function name, user role). */
	context?: Record<string, unknown>;

	/** UTC timestamp (epoch milliseconds) of when the log was generated. */
	timestamp: number;

	/** Application name (copied from TelemetryOptions). */
	app: string;

	/** Release version string (copied from TelemetryOptions). */
	release: string;
}
