## `@telytics/client`

Lightweight client-side telemetry SDK for dApps. Easily track runtime errors and operational events, and send structured logs to your collector.

## Features

- Minimal API: `initTelemetry`, `trackError`, `trackInfo`, `trackTransaction`
- Fire-and-forget logging for errors, info, and transactions
- Compatible with browser and server environments
- Suitable for decentralized dApp telemetry with privacy in mind

## Installation

```bash
npm install @telytics/client
```

## Quick start

```ts
import {initTelemetry, trackError} from '@telytics/client';

initTelemetry({
    endpoint: 'https://observe.myapp.dev/api/ingest',
    app: 'my-dapp',
    release: 'v1.0.0'
});

try {
    // risky operation
    throw new Error('Something broke');
} catch (err) {
    trackError(err, {route: '/stake'});
}
```

## API reference

### Initialize the telemetry client

Sets up the internal client with endpoint, app name, and release version.

```ts
initTelemetry(options: TelemetryOptions): void
```

| Option     | Type     | Required | Description                        |
|------------|----------|----------|------------------------------------|
| `endpoint` | `string` | Yes      | Full URL of the collector endpoint |
| `app`      | `string` | Yes      | Your dApp's name                   |
| `release`  | `string` | Yes      | Version tag or commit ID           |

**Example:**

```ts
initTelemetry({
	endpoint: 'https://observe.example.dev/api/ingest',
	app: 'nft-hub',
	release: 'v1.0.0'
});
```

### Track an error

Logs a serialized error to the telemetry collector.

```ts
trackError(error: unknown, context?: Record<string, unknown>): Promise<void>
```

**Example:**

```ts
trackError(new Error('Something failed'), { route: '/dashboard' });
```

### Log an informational message

Captures a non-critical event or user action.

```ts
trackInfo(message: string, context?: Record<string, unknown>): Promise<void>
```

**Example:**

```ts
trackInfo('User opened settings panel', { section: 'privacy' });
```

### Record a transaction event

Sends transaction-related telemetry (e.g. swaps, staking).

```ts
trackTransaction(message: string, context?: Record<string, unknown>): Promise<void>
```

**Example:**

```ts
trackTransaction('User staked tokens', {
	txId: '0xabc123',
	amount: 42,
	token: 'SOL'
});
```

## Example log payload

```json
{
	"type": "error",
	"message": "Something broke",
	"context": {
		"route": "/stake"
	},
	"timestamp": 1714430022321,
	"app": "my-dapp",
	"release": "v1.0.0"
}
```

## License

This project is licensed under the [MIT License](LICENSE).
