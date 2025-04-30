import {describe, expect, it, vi} from 'vitest';
import {initTelemetry, trackTransaction} from "../src";

global.fetch = vi.fn().mockResolvedValue({
	ok: true,
	status: 204,
	json: async () => ({success: true})
}) as unknown as typeof fetch;

describe('trackTransaction', () => {
	it('should initialize and track a transaction log without crashing', async () => {
		initTelemetry({
			endpoint: 'https://fake-endpoint.dev/api/ingest',
			app: 'test-app',
			release: 'v0.0.1'
		});

		expect(() => {
			trackTransaction('User staked 5 SOL', {amount: 5});
		}).not.toThrow();
	});
});
