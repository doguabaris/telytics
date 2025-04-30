import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {sendLog} from '../src/utils/fetchUtils';
import {LogPayload} from '../src/core/types';

describe('sendLog', () => {
	const payload: LogPayload = {
		type: 'error',
		message: 'Test error',
		app: 'test-app',
		release: 'v0.0.1',
		timestamp: Date.now()
	};

	beforeEach(() => {
		global.fetch = vi.fn(() => Promise.resolve({ok: true})
		) as unknown as typeof fetch;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should call fetch with correct arguments', async () => {
		await sendLog('https://example.com/logs', payload);

		expect(global.fetch).toHaveBeenCalledTimes(1);
		expect(global.fetch).toHaveBeenCalledWith(
			'https://example.com/logs',
			expect.objectContaining({
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(payload)
			})
		);
	});
});
