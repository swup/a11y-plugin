import { describe, expect, it } from 'vitest';
import { parseTemplate } from '../../src/util.js';

describe('parseTemplate', () => {
	it('replaces placeholders with values', () => {
		const template = 'My friend {name} is {age} years old';
		const replacements = { name: 'John', age: '30' };
		const result = parseTemplate(template, replacements);
		expect(result).toBe('My friend John is 30 years old');
	});

	it('accepts any-case value keys', () => {
		const template = 'My friend {Name} is {Age} years old';
		const replacements = { Name: 'John', Age: '30' };
		const result = parseTemplate(template, replacements);
		expect(result).toBe('My friend John is 30 years old');
	});

	it('ignores missing value keys', () => {
		const template = 'Hello, {name}!';
		const replacements = {};
		const result = parseTemplate(template, replacements);
		expect(result).toBe('Hello, {name}!');
	});

	it('throws when no data is provided', () => {
		// @ts-expect-error missing argument
		expect(() => parseTemplate('Hello, {name}!')).toThrow();
	});
});
