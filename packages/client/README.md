## `@solana-observe/client`

Lightweight client-side telemetry SDK for Solana dApps. Easily track runtime errors and operational events, and send structured logs to your collector.

## Features

- Minimal API: `initTelemetry()`, `trackError()`
- Fully typed with TypeScript
- Fire-and-forget error tracking
- Compatible with browser and server environments
- Ideal for decentralized dApp telemetry

## Installation

```bash
npm install @solana-observe/client
```

## Quick start

```ts
import {initTelemetry, trackError} from '@solana-observe/client';

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

### `initTelemetry(options: TelemetryOptions): void`

Initializes the telemetry client.

| Option     | Type     | Required | Description                        |
|------------|----------|----------|------------------------------------|
| `endpoint` | `string` | YES      | Full URL of the collector endpoint |
| `app`      | `string` | YES      | Your dApp's name                   |
| `release`  | `string` | YES      | Version tag or commit ID           |

### `trackError(error: unknown, context?: Record<string, unknown>): void`

Captures an error and sends it to the collector.

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
