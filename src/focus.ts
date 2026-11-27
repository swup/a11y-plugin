export function focusElement(elementOrSelector: string | HTMLElement) {
	let el: HTMLElement | null;
	if (typeof elementOrSelector === 'string') {
		el = document.querySelector<HTMLElement>(elementOrSelector);
	} else {
		el = elementOrSelector;
	}

	if (!(el instanceof HTMLElement) || el.matches(':disabled')) return;

	/** Make implicit `tabindex === -1` explicit as an attribute */
	if (el.tabIndex === -1) {
		el.setAttribute('tabindex', '-1');
	}

	/** Try focussing */
	el.focus({ preventScroll: true });

	/** Focus worked or failed even though the element already has a tabindex attribute */
	if (document.activeElement === el || el.hasAttribute('tabindex')) return;

	/**
	 * Handle elements that report a tabindex of 0 but are still not
	 * focussable natively (e.g. <a name="foo"> without a href)
	 */
	el.setAttribute('tabindex', '-1');
	el.focus({ preventScroll: true });
	if (document.activeElement !== el) el.removeAttribute('tabindex');
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

export function getAutofocusElement(): HTMLElement | undefined {
	const focusEl = document.querySelector<HTMLElement>('body [autofocus]');
	if (focusEl && !focusEl.closest('[inert], [aria-disabled], [aria-hidden="true"]')) {
		return focusEl;
	}
}
