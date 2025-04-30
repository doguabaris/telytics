import {describe, expect, it, vi} from 'vitest';
import {initTelemetry, trackError} from "../src";

global.fetch = vi.fn().mockResolvedValue({
	ok: true,
	status: 204,
	json: async () => ({success: true})
}) as unknown as typeof fetch;

describe('trackError', () => {
	it('should initialize and track an error without crashing', async () => {
		initTelemetry({
			endpoint: 'https://fake-endpoint.dev/api/ingest',
			app: 'test-app',
			release: 'v0.0.1'
		});

		expect(() => {
			trackError(new Error('Test error'), {route: '/test'});
		}).not.toThrow();
	});
});
