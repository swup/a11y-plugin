import { Location } from 'swup';
import { AnnouncementTranslations, Options } from './index.js';
import { createElement, parseTemplate } from './util.js';

export class Announcer {
	id: string = 'swup-announcer';
	style: string = `position:absolute;top:0;left:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;word-wrap:normal;width:1px;height:1px;`;
	region: HTMLElement;

	constructor() {
		this.region = this.getRegion() ?? this.createRegion();
	}

	getRegion(): HTMLElement | null {
		return document.getElementById(this.id);
	}

	createRegion(): HTMLElement {
		const liveRegion = createElement(
			`<p aria-live="assertive" aria-atomic="true" id="${this.id}" style="${this.style}"></p>`
		);
		document.body.appendChild(liveRegion);
		return liveRegion;
	}

	announce(message: string, delay: number = 0): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(() => {
				// // Fix screen readers not announcing the same message twice
				if (this.region.textContent === message) {
					message = `${message}.`;
				}
				// Clear before announcing
				this.region.textContent = '';
				this.region.textContent = message;

				resolve();
			}, delay);
		});
	}
}

type PageAnnouncementOptions = Pick<Options, 'headingSelector' | 'announcements'>;

export function getPageAnnouncement({
	headingSelector = 'h1',
	announcements = {}
}: PageAnnouncementOptions): string | undefined {
	const lang = document.documentElement.lang || '*';
	const { href, url, pathname: path } = Location.fromUrl(window.location.href);

	const templates = (announcements as AnnouncementTranslations)[lang] || announcements;
	if (typeof templates !== 'object') return;

	// Look for first heading on page
	const headingEl = document.querySelector(headingSelector);
	if (!headingEl) {
		console.warn(`SwupA11yPlugin: No main heading (${headingSelector}) found on new page`);
	}

	// Get page heading from aria attribute or text content
	const heading = headingEl?.getAttribute('aria-label') || headingEl?.textContent;

	// Fall back to document title, then url if no title was found
	const title = heading || document.title || parseTemplate(templates.url, { href, url, path });

	// Replace {variables} in template
	return parseTemplate(templates.visit, { title, href, url, path });
}
