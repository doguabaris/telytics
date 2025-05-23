![Image](https://github.com/user-attachments/assets/738808a4-5323-4cfb-b85a-dcf2792e7169)

# Telytics

> [!NOTE]  
> Originally built for the **Solana Buildstation Belgrade @ Breakout Hackathon**, hosted by Superteam Balkan.

Telytics is an open-source lightweight, privacy-respecting telemetry system designed for decentralized applications (dApps). It addresses the need for a telemetry solution tailored to dApps, as existing observability tools are often complex and not well-suited for browser-based or client-side environments typical in this context.

The project offers a minimal Software Development Kit (SDK) to capture runtime errors, transaction events, and user interactions directly from dApps. Optional components include a simple ingestion API server for receiving telemetry data, and a dashboard for visualizing collected logs.

## Monorepo structure

This repository is an [npm workspace](https://docs.npmjs.com/cli/v10/using-npm/workspaces)-based monorepo that includes three main packages:

```
packages/
├── client     # Lightweight telemetry SDK (browser & server)
├── collector  # Minimal ingestion API server (Express-based)
└── dashboard  # Next.js 15 UI for log visualization
```

## Getting started

### Prerequisites

- Node.js ≥ 20

### Install dependencies

```bash
npm install
```

### Run all packages

In separate terminals:

```bash
# Collector API (http://localhost:3000)
npm run dev --workspace=@telytics/collector

# Dashboard UI (http://localhost:3001)
npm run dev --workspace=@telytics/dashboard
```

> [!IMPORTANT] 
> The `client` SDK is used by your dApp and does not run as a standalone process.

## Packages

### [`@telytics/client`](./packages/client)

- Type-safe SDK to report telemetry events (`error`, `info`, `transaction`)
- Framework-agnostic (can be used in front-end, backend, or edge runtimes)

```ts
import {initTelemetry, trackError} from "@telytics/client"

initTelemetry({
    endpoint: "http://localhost:3000/api/ingest",
    app: "my-dapp",
    release: "v1.0.0"
})

trackError(new Error("Something broke"), {route: "/stake"})
```

### [`@telytics/collector`](./packages/collector)

- Lightweight Express API to receive telemetry data
- Writes logs to `.ndjson` file (append-only format)
- Future support planned: SQLite, ClickHouse, and OpenTelemetry ingestion

Endpoint:

```
POST /api/ingest
```

### [`@telytics/dashboard`](./packages/dashboard)

- Built with Next.js 15 + Tailwind + ShadCN
- Server-side rendering of telemetry data (parsed from `.ndjson`)
- Uses `@tanstack/react-table` and `recharts` for display

## Testing

Run all tests in the monorepo:

```bash
npm test
```

Or per package:

```bash
npm run test --workspace=@telytics/client
npm run test --workspace=@telytics/collector
```

## Contributing

See the [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the [MIT License](LICENSE).
