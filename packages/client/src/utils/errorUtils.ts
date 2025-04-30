/**
 * @file errorUtils.ts
 * @description Utility function for converting unknown error values into readable strings.
 *
 * This helper ensures that any `unknown` error (e.g., thrown from a try/catch block)
 * is safely converted into a loggable format. If the error is a native `Error` object,
 * it includes the name, message and stack trace. Otherwise, it attempts to stringify
 * the value using `JSON.stringify()`.
 *
 * Used internally by the `Telemetry` class before sending error logs.
 *
 * @example
 * ```ts
 * try {
 *   throw new Error('Something failed');
 * } catch (err) {
 *   const message = serializeError(err);
 *   console.log(message); // "Error: Something failed\n at ..."
 * }
 * ```
 *
 * @author     Doğu Abaris <abaris@null.net>
 * @license    MIT
 * @see        ../core/Telemetry.ts
 */

/**
 * Serializes an unknown error into a string for logging or transmission.
 *
 * @param error - Any value thrown in a try/catch block or rejected promise.
 * @returns A string representation of the error suitable for telemetry.
 */
export function serializeError(error: unknown): string {
	if (error instanceof Error) {
		return `${error.name}: ${error.message}\n${error.stack}`;
	}
	return JSON.stringify(error);
}
