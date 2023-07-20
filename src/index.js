import Plugin from '@swup/plugin';
import OnDemandLiveRegion from 'on-demand-live-region';

import 'focus-options-polyfill';

export default class SwupA11yPlugin extends Plugin {
	name = 'SwupA11yPlugin';

	requires = { swup: '>=4' };

	defaults = {
		contentSelector: 'main',
		headingSelector: 'h1, h2, [role=heading]',
		announcementTemplate: 'Navigated to: {title}',
		urlTemplate: 'New page at {url}'
	};

	constructor(options = {}) {
		super();

		this.options = { ...this.defaults, ...options };

		this.liveRegion = new OnDemandLiveRegion();
	}

	mount() {
		this.on('visit:start', this.markAsBusy);
		this.on('visit:end', this.unmarkAsBusy);
		this.on('content:replace', this.announceVisit);
	}

	markAsBusy() {
		document.documentElement.setAttribute('aria-busy', 'true');
	}

	unmarkAsBusy() {
		document.documentElement.removeAttribute('aria-busy');
	}

	announceVisit() {
		requestAnimationFrame(() => {
			this.announcePageName();
			this.focusPageContent();
		})
	}

	announcePageName() {
		const { contentSelector, headingSelector, urlTemplate, announcementTemplate } =
			this.options;

		// Default: announce new /path/of/page.html
		let pageName = urlTemplate.replace('{url}', window.location.pathname);

		// Check for title tag
		if (document.title) {
			pageName = document.title;
		}

		// Look for first heading in content container
		const content = document.querySelector(contentSelector);
		if (content) {
			const headings = content.querySelectorAll(headingSelector);
			if (headings && headings.length) {
				const [heading] = headings;
				pageName = heading.getAttribute('aria-label') || heading.textContent;
			}
		}

		const announcement = announcementTemplate.replace('{title}', pageName.trim());
		this.liveRegion.say(announcement);
	}

	focusPageContent() {
		const content = document.querySelector(this.options.contentSelector);
		if (content) {
			content.setAttribute('tabindex', '-1');
			content.focus({ preventScroll: true });
		}
	}
}
