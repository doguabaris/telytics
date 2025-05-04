## `@telytics/collector`

Minimal telemetry ingestion API for dApps. Receives structured logs from clients and writes them to a newline-delimited JSON (`.ndjson`) log file.

## Features

- Simple Express.js API (`POST /api/ingest`)
- Accepts structured telemetry events from clients
- Appends logs to a persistent `.ndjson` file
- Type-safe with full `LogPayload` validation
- Suitable for local development, production tailing, or log forwarding

## Installation

```bash
npm install
npm run dev --workspace=@telytics/collector
```

The service starts on:

```
http://localhost:3000
```

## API endpoint

### `POST /api/ingest`

Receives a structured log payload from the client.

**Request Body:**

```json
{
	"type": "error",
	"message": "Something went wrong",
	"timestamp": 1714430000000,
	"app": "my-dapp",
	"release": "v1.0.0"
}
```

**Success response:**

```
204 No Content
```

**Invalid payload:**

```
400 Bad Request
```

## Log storage

Logs are appended to:

```bash
packages/collector/logs/events.ndjson
```

Each line is a valid JSON object, separated by newlines:

```json
{
	"type": "error",
	"message": "Something went wrong",
	"timestamp": 1714430000000,
	"app": "my-dapp",
	"release": "v1.0.0"
}
```

```json
{
	"type": "info",
	"message": "User connected",
	"timestamp": 1714430100000,
	"app": "my-dapp",
	"release": "v1.0.0"
}
```

## Development

```bash
npm run dev --workspace=@telytics/collector
```
> [!IMPORTANT]
> Uses `ts-node-dev` for live reloading.

## Example use

Paired with [`@telytics/client`](../client):

```ts
trackError(new Error("Something went wrong"), {
    route: '/stake',
    wallet: publicKey.toBase58()
});
```

Collector will write that as a line in `events.ndjson`.

## License

This project is licensed under the [MIT License](LICENSE).
