import {describe, expect, it} from 'vitest';
import {serializeError} from '../src/utils/errorUtils';

describe('serializeError', () => {
	it('should serialize a standard Error object', () => {
		const err = new Error('Boom');
		const result = serializeError(err);
		expect(result).toContain('Boom');
		expect(result).toContain('Error');
	});

	it('should serialize non-Error values', () => {
		const result = serializeError({msg: 'oops', code: 123});
		expect(result).toContain('oops');
		expect(result).toContain('123');
	});

	it('should stringify primitive types safely', () => {
		expect(serializeError('fail')).toBe('"fail"');
		expect(serializeError(404)).toBe('404');
	});
});
