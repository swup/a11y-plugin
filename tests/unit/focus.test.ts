import { describe, expect, it } from 'vitest';
import { focusElement, getAutofocusElement } from '../../src/focus.js';

function create(html: string): HTMLElement[] {
	document.body.innerHTML = html;
	return Array.from(document.body.children) as HTMLElement[];
}

describe('focus', () => {
	describe('focusElement', () => {
		it('focuses an element', () => {
			const [element] = create('<button></button>');
			focusElement(element);
			expect(document.activeElement).toBe(element);
		});

		it('accepts an element selector', () => {
			const [element] = create('<button></button>');
			focusElement('button');
			expect(document.activeElement).toBe(element);
		});

		it('fails silently for missing elements', () => {
			// @ts-expect-error invalid argument
			expect(() => focusElement(null)).not.toThrow();
			expect(() => focusElement('input')).not.toThrow();
		});

		it('sets a tab index', () => {
			const [element] = create('<button></button>');
			focusElement(element);
			expect(element.tabIndex).toBe(-1);
		});

		it('restores the previous tabindex', () => {
			const [element] = create('<button tabindex="4"></button>');
			focusElement(element);
			expect(element.tabIndex).toBe(4);
		});
	});
});
