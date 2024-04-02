import { createElement } from './util.js';

export default class Announcer {
	liveRegion: Element;
	liveRegionId: string = 'swup-announcer';
	liveRegionStyles: string = `
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
		this.liveRegion = this.getLiveRegion() ?? this.createLiveRegion();
	}

	getLiveRegion() {
		return document.getElementById(this.liveRegionId);
	}

	createLiveRegion() {
		const liveRegion = createElement(
			`<p aria-live="assertive" aria-atomic="true" id="${this.liveRegionId}" style="${this.liveRegionStyles}"></p>`
		);
		document.body.appendChild(liveRegion);
		return liveRegion;
	}

	announce(message: string) {
		setTimeout(() => {
			this.liveRegion.textContent = message;
		});
	}
}
