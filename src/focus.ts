export function getAutofocusElement(): HTMLElement | undefined {
	const focusEl = document.querySelector<HTMLElement>('body [autofocus]');
	if (focusEl && !focusEl.closest('inert, [aria-disabled], [aria-hidden="true"]')) {
		return focusEl;
	}
}

export function focusAutofocusElement(): boolean {
	const autofocusEl = getAutofocusElement();
	if (!autofocusEl) return false;

	if (autofocusEl !== document.activeElement) {
		// Only focus if not already focused
		// No preventScroll flag here, as probably intended with autofocus
		autofocusEl.focus();
	}
	return true;
}

export function focusElement(elementOrSelector: string | HTMLElement) {
	let el: HTMLElement | null;
	if (typeof elementOrSelector === 'string') {
		el = document.querySelector<HTMLElement>(elementOrSelector);
	} else {
		el = elementOrSelector;
	}

	if (!(el instanceof HTMLElement)) return;

	// Set and restore tabindex to allow focusing non-focusable elements
	const tabindex = el.getAttribute('tabindex');
	el.setAttribute('tabindex', '-1');
	el.focus({ preventScroll: true });
	if (tabindex !== null) {
		el.setAttribute('tabindex', tabindex);
	} else {
		el.removeAttribute('tabindex');
	}
}

export function setFocusStartingPoint(element: HTMLElement) {
	element.focus({ preventScroll: true });

	// Exit here if the element was successfully focused
	if (element.matches(':focus')) return;

	// Not focussed? Probably not a link/button/input
	// In this case, we insert a focussable child into the element, focus it, and remove it again
	const focusElement = createInvisibleFocusElement();
	element.prepend(focusElement);
	focusElement.focus({ preventScroll: true });
	focusElement.remove();
}

export function createInvisibleFocusElement() {
	const element = document.createElement('div');
	element.setAttribute('tabindex', '-1');
	element.style.position = 'absolute';
	element.style.width = '1px';
	element.style.height = '1px';
	element.style.overflow = 'hidden';
	element.style.clip = 'rect(1px, 1px, 1px, 1px)';
	element.style.clipPath = 'inset(50%)';
	element.style.outline = 'none';
	return element;
}
