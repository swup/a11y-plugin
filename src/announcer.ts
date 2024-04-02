import { createElement } from './util.js';

export default class Announcer {
	region: Element;

	id: string = 'swup-announcer';

	style: string = `
		position: absolute;
		top: 0;
		left: 0;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		overflow: hidden;
		white-space: nowrap;
		word-wrap: normal;
		width: 1px;
		height: 1px;
	`;

	constructor() {
		this.region = this.get() ?? this.create();
	}

	protected get(): HTMLElement | null {
		return document.getElementById(this.id);
	}

	protected create(): Element {
		const liveRegion = createElement(
			`<p aria-live="assertive" aria-atomic="true" id="${this.id}" style="${this.style}"></p>`
		);
		document.body.appendChild(liveRegion);
		return liveRegion;
	}

	announce(message: string) {
		setTimeout(() => {
			this.region.textContent = message;
		});
	}
}
