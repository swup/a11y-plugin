import { describe, expect, it } from 'vitest';
import { createElement } from '../../src/util.js';

describe('createElement', () => {
	it('creates an element from an html string', () => {
			const html = '<div id="test" class="my-class">Hello World</div>';
			const element = createElement(html);
			expect(element).not.toBeNull();
			expect(element.localName).toBe('div');
			expect(element.id).toBe('test');
			expect(element.className).toBe('my-class');
			expect(element.textContent).toBe('Hello World');
	});

	it('creates nothing if no html is passed', () => {
			const element = createElement('');
			expect(element).toBeUndefined();
	});
});
