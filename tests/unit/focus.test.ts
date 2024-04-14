import { describe, expect, it, vi } from 'vitest';
import { focusAutofocusElement, focusElement, getAutofocusElement } from '../../src/focus.js';

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

		it('prevents scroll on focus', () => {
			const [element] = create('<button></button>');
			const focusMock = vi.spyOn(element, 'focus');
			focusElement(element);
			expect(focusMock).toHaveBeenCalledWith({ preventScroll: true });
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

	describe('getAutofocusElement', () => {
		it('finds the first autofocus element', () => {
			const [first] = create('<button autofocus></button><input autofocus>');
			expect(getAutofocusElement()).toBe(first);
		});

		it('ignores elements in inert containers', () => {
			create('<div inert><button autofocus></button></div>');
			expect(getAutofocusElement()).toBeUndefined();
		});

		it('ignores elements in aria-disabled containers', () => {
			create('<div aria-disabled><button autofocus></button></div>');
			expect(getAutofocusElement()).toBeUndefined();
		});

		it('ignores elements in aria-hidden containers', () => {
			create('<div aria-hidden="true"><button autofocus></button></div>');
			expect(getAutofocusElement()).toBeUndefined();
		});
	});

	describe('focusAutofocusElement', () => {
		it('focuses the autofocus element', () => {
			const [element] = create('<button autofocus></button>');
			const focusMock = vi.spyOn(element, 'focus');
			focusAutofocusElement();
			expect(focusMock).toHaveBeenCalledWith();
		});
	});
});
