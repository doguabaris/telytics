## `@telytics/dashboard`

Log visualization interface for dApps. Built with Next.js 15, this dashboard renders telemetry logs collected by the [`@telytics/collector`](../collector) in real time.

## Features

- Log explorer for error/info/transaction events
- Built with Next.js 15 App Router and Server Components
- Uses `@tanstack/react-table` and `recharts` for interactive display
- Parses `.ndjson` logs written by the collector
- Fully styled with Tailwind CSS and ShadCN components
- Compatible with local and remote collector backends

## Installation

```bash
npm install
npm run dev --workspace=@telytics/dashboard
```

The dashboard starts on:

```
http://localhost:3001
```

> To customize the port, create a `.env.local` file and add:
> ```
> PORT=3001
> ```

## Requirements

- Collector should be running on a separate port (default: `http://localhost:3000`)
- Dashboard expects the collector logs to be available at:

> `../collector/logs/events.ndjson`

> [!WARNING]
> This file path only works in monorepo development.  
> For production, use an HTTP endpoint exposed by the collector instead.

## File-based log reading

The dashboard currently reads logs by accessing the NDJSON file directly:

```ts
const logsFile = path.resolve(
    process.cwd(),
    '../collector/logs/events.ndjson'
);
```

Each line is parsed as a structured JSON log entry and rendered in a table.

## Example log entry

```json
{
	"type": "error",
	"message": "Something went wrong",
	"timestamp": 1714430022321,
	"app": "my-dapp",
	"release": "v1.0.0"
}
```

## Development

```bash
npm run dev --workspace=@telytics/dashboard
```

Dashboard will be available at [http://localhost:3001](http://localhost:3001)

## License

This project is licensed under the [MIT License](LICENSE).
