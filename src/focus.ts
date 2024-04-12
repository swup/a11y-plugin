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
		// Removing the tabindex will reset screen reader position, so we'll keep it
		// el.removeAttribute('tabindex');
	}
}
