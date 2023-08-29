import { Visit, nextTick } from 'swup';
import Plugin from '@swup/plugin';
import OnDemandLiveRegion from 'on-demand-live-region';

import 'focus-options-polyfill';

export interface VisitA11y {
	/** The element to focus after content is replaced */
	focus: string | HTMLElement | false;
}

declare module 'swup' {
	export interface Visit {
		/** Accessibility settings for this visit */
		a11y: VisitA11y;
	}
	export interface HookDefinitions {
		'content:focus': undefined;
	}
}

type Options = {
	/** The selector for matching the main content area of the page. */
	contentSelector: string;
	/** The selector for finding headings inside the main content area. */
	headingSelector: string;
	/** How to announce the new page title. */
	announcementTemplate: string;
	/** How to announce the new page url. Used as fallback if no heading was found. */
	urlTemplate: string;
	/** Whether to skip animations for users that prefer reduced motion. */
	respectReducedMotion: boolean;
};

export default class SwupA11yPlugin extends Plugin {
	name = 'SwupA11yPlugin';

	requires = { swup: '>=4' };

	defaults: Options = {
		contentSelector: 'main',
		headingSelector: 'h1, h2, [role=heading]',
		announcementTemplate: 'Navigated to: {title}',
		urlTemplate: 'New page at {url}',
		respectReducedMotion: false
	};

	options: Options;

	liveRegion: OnDemandLiveRegion;

	constructor(options: Partial<Options> = {}) {
		super();
		this.options = { ...this.defaults, ...options };
		this.liveRegion = new OnDemandLiveRegion();
	}

	mount() {
		this.swup.hooks.create('content:focus');

		// Prepare visit by adding a11y settings to visit object
		this.before('visit:start', this.prepareVisit);

		// Mark page as busy during transitions
		this.on('visit:start', this.markAsBusy);
		this.on('visit:end', this.unmarkAsBusy);

		// Announce new page and focus container after content is replaced
		this.on('content:replace', this.handleNewPageContent);

		// Disable transition and scroll animations if user prefers reduced motion
		if (this.options.respectReducedMotion) {
			this.before('visit:start', this.disableTransitionAnimations);
			this.before('visit:start', this.disableScrollAnimations);
			this.before('link:self', this.disableScrollAnimations);
			this.before('link:anchor', this.disableScrollAnimations);
		}
	}

	markAsBusy() {
		document.documentElement.setAttribute('aria-busy', 'true');
	}

	unmarkAsBusy() {
		document.documentElement.removeAttribute('aria-busy');
	}

	prepareVisit(visit: Visit) {
		visit.a11y = {
			focus: this.options.contentSelector
		};
	}

	async handleNewPageContent() {
		await nextTick();
		this.announcePageName();
		await this.focusPageContent();
	}

	announcePageName() {
		const { contentSelector, headingSelector, urlTemplate, announcementTemplate } =
			this.options;

		// Default: announce new /path/of/page.html
		let pageName: string = urlTemplate.replace('{url}', window.location.pathname);

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
				pageName = heading.getAttribute('aria-label') || heading.textContent || pageName;
			}
		}

		const announcement = announcementTemplate.replace('{title}', pageName.trim());
		this.liveRegion.say(announcement);
	}

	async focusPageContent() {
		await this.swup.hooks.call('content:focus', undefined, (visit) => {
			let content: string | HTMLElement | false | null = visit.a11y.focus;
			if (typeof content === 'string') {
				content = document.querySelector<HTMLElement>(content);
			}
			if (content instanceof HTMLElement) {
				if (this.needsTabindex(content)) {
					content.setAttribute('tabindex', '-1');
				}
				content.focus({ preventScroll: true });
			}
		});
	}

	disableTransitionAnimations(visit: Visit) {
		visit.animation.animate = this.shouldAnimate();
	}

	disableScrollAnimations(visit: Visit) {
		// @ts-ignore: animate property is not defined unless Scroll Plugin installed
		visit.scroll.animate = this.shouldAnimate();
	}

	shouldAnimate(): boolean {
		return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	needsTabindex(el: HTMLElement): boolean {
		return !el.matches('a, button, input, textarea, select, details, [tabindex]');
	}
}
