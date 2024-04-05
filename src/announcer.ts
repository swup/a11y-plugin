import { createElement } from './util.js';

export default class Announcer {
	id: string = 'swup-announcer';
	style: string = `position:absolute;top:0;left:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;word-wrap:normal;width:1px;height:1px;`;
	region: Element;

	constructor() {
		this.region = this.getRegion() ?? this.createRegion();
	}

	getRegion(): HTMLElement | null {
		return document.getElementById(this.id);
	}

	createRegion(): Element {
		const liveRegion = createElement(
			`<p aria-live="assertive" aria-atomic="true" id="${this.id}" style="${this.style}"></p>`
		);
		document.body.appendChild(liveRegion);
		return liveRegion;
	}

	announce(message: string, delay: number = 0) {
		setTimeout(() => {
			this.region.textContent = message;
		}, delay);
	}
}
