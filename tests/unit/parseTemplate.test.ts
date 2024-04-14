import { describe, expect, it } from 'vitest';
import { parseTemplate } from '../../src/util.js';

describe('parseTemplate', () => {
	it('should replace placeholders with values', () => {
		const template = 'My friend {name} is {age} years old';
		const replacements = { name: 'John', age: '30' };
		const result = parseTemplate(template, replacements);
		expect(result).toBe('My friend John is 30 years old');
	});

	it('should accept any-case value keys', () => {
		const template = 'My friend {Name} is {Age} years old';
		const replacements = { Name: 'John', Age: '30' };
		const result = parseTemplate(template, replacements);
		expect(result).toBe('My friend John is 30 years old');
	});

	it('should ignore missing value keys', () => {
		const template = 'Hello, {name}!';
		const replacements = {};
		const result = parseTemplate(template, replacements);
		expect(result).toBe('Hello, {name}!');
	});

	it('should throw when no data is provided', () => {
		// @ts-expect-error missing argument
		expect(() => parseTemplate('Hello, {name}!')).toThrow();
	});
});
