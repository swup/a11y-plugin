import { describe, expect, it } from 'vitest';
import { focusElement } from '../../src/focus.js';

describe('focus', () => {
	describe('focusElement', () => {
		it('focuses an element', () => {
			const element = document.createElement('button');
			document.body.appendChild(element);
			focusElement(element);
			expect(document.activeElement).toBe(element);
		});

		it('accepts an element selector', () => {
			const element = document.createElement('button');
			document.body.appendChild(element);
			focusElement('button');
			expect(document.activeElement).toBe(element);
		});

		it('fails silently for missing elements', () => {
			// @ts-expect-error invalid argument
			expect(() => focusElement(null)).not.toThrow();
			expect(() => focusElement('input')).not.toThrow();
		});

		it('sets a tab index', () => {
			const element = document.createElement('button');
			document.body.appendChild(element);
			focusElement(element);
			expect(element.tabIndex).toBe(-1);
		});

		it('restores the previous tabindex', () => {
			const element = document.createElement('button');
			element.tabIndex = 4;
			document.body.appendChild(element);
			focusElement(element);
			expect(element.tabIndex).toBe(4);
		});
	});
});
