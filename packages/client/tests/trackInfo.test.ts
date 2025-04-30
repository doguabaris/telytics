import {describe, expect, it, vi} from 'vitest';
import {initTelemetry, trackInfo} from "../src";

global.fetch = vi.fn().mockResolvedValue({
	ok: true,
	status: 204,
	json: async () => ({success: true})
}) as unknown as typeof fetch;

describe('trackInfo', () => {
	it('should initialize and track an info log without crashing', async () => {
		initTelemetry({
			endpoint: 'https://fake-endpoint.dev/api/ingest',
			app: 'test-app',
			release: 'v0.0.1'
		});

		expect(() => {
			trackInfo('User logged in', {route: '/login'});
		}).not.toThrow();
	});
});
