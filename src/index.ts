import { Location, Visit, nextTick } from 'swup';
import Plugin from '@swup/plugin';

import 'focus-options-polyfill';

import Announcer from './announcer.js';
import { getAutofocusElement, parseTemplate } from './util.js';

export interface VisitA11y {
	/** How to announce the new content after it inserted */
	announce: string | false | undefined;
	/** The element to focus after the content is replaced */
	focus: string | false;
}

declare module 'swup' {
	export interface Visit {
		/** Accessibility settings for this visit */
		a11y: VisitA11y;
	}
	export interface HookDefinitions {
		'content:announce': undefined;
		'content:focus': undefined;
	}
	export interface Swup {
		/**
		 * Announce something programmatically
		 */
		announce?: SwupA11yPlugin['announce'];
	}
}

/** Templates for announcements of the new page content. */
type Announcements = {
	/** How to announce the new page. */
	visit: string;
	/** How to read a page url. Used as fallback if no heading was found. */
	url: string;
};

/** Translations of announcements, keyed by language. */
type AnnouncementTranslations = {
	[lang: string]: Announcements;
};

type Options = {
	/** The selector for finding headings inside the main content area. */
	headingSelector: string;
	/** Whether to skip animations for users that prefer reduced motion. */
	respectReducedMotion: boolean;
	/** How to announce the new page title and url. */
	announcements: Announcements | AnnouncementTranslations;
	/** Whether to focus elements with an [autofocus] attribute after navigation. */
	autofocus: boolean;
};

export default class SwupA11yPlugin extends Plugin {
	name = 'SwupA11yPlugin';

	requires = { swup: '>=4' };

	defaults: Options = {
		headingSelector: 'h1',
		respectReducedMotion: true,
		autofocus: false,
		announcements: {
			visit: 'Navigated to: {title}',
			url: 'New page at {url}'
		}
	};

	options: Options;

	announcer: Announcer;

	rootSelector: string = 'body';

	constructor(options: Partial<Options> = {}) {
		super();

		// Merge default options with user defined options
		this.options = { ...this.defaults, ...options };

		// Create announcer instance for announcing new page content
		this.announcer = new Announcer();
	}

	mount() {
		// Prepare new hooks
		this.swup.hooks.create('content:announce');
		this.swup.hooks.create('content:focus');

		// Prepare visit by adding a11y settings to visit object
		this.before('visit:start', this.prepareVisit);

		// Mark page as busy during transitions
		this.on('visit:start', this.markAsBusy);
		this.on('visit:end', this.unmarkAsBusy);

		// Focus new page content after visit completes
		this.on('visit:end', this.focusContent);

		// Announce new page title after visit completes
		this.on('visit:end', this.announceContent);

		// Disable transition and scroll animations if user prefers reduced motion
		if (this.options.respectReducedMotion) {
			this.before('visit:start', this.disableTransitionAnimations);
			this.before('visit:start', this.disableScrollAnimations);
			this.before('link:self', this.disableScrollAnimations);
			this.before('link:anchor', this.disableScrollAnimations);
		}

		// Announce something programmatically
		this.swup.announce = this.announce.bind(this);
	}

	unmount() {
		this.swup.announce = undefined;
	}

	announce(message: string): void {
		this.announcer.announce(message);
	}

	markAsBusy() {
		document.documentElement.setAttribute('aria-busy', 'true');
	}

	unmarkAsBusy() {
		document.documentElement.removeAttribute('aria-busy');
	}

	prepareVisit(visit: Visit) {
		visit.a11y = {
			announce: undefined,
			focus: this.rootSelector
		};
	}

	announceContent(visit: Visit) {
		this.swup.hooks.callSync('content:announce', visit, undefined, (visit) => {
			// Allow customizing announcement before this hook
			if (typeof visit.a11y.announce === 'undefined') {
				visit.a11y.announce = this.getPageTitle();
			}

			// Announcement disabled for this visit?
			if (!visit.a11y.announce) return;

			// Why the 100ms delay? see research at https://github.com/swup/a11y-plugin/pull/50
			this.announcer.announce(visit.a11y.announce, 100);
		});
	}

	focusContent(visit: Visit) {
		this.swup.hooks.callSync('content:focus', visit, undefined, (visit) => {
			// Focus disabled for this visit?
			if (!visit.a11y.focus) return;

			// Found and focused [autofocus] element? Return early
			if (this.focusAutofocusElement() === true) return;

			// Otherwise, find and focus actual content container
			this.focusContentElement(visit.a11y.focus);
		});
	}

	getPageTitle(): string | undefined {
		const { headingSelector, announcements } = this.options;
		const { href, url, pathname: path } = Location.fromUrl(window.location.href);
		const lang = document.documentElement.lang || '*';

		const templates: Announcements =
			(announcements as AnnouncementTranslations)[lang] || announcements;
		if (typeof templates !== 'object') return;

		// Look for first heading on page
		const headingEl = document.querySelector(headingSelector);
		if (!headingEl) {
			console.warn(
				`SwupA11yPlugin: No main heading (${headingSelector}) found in incoming document`
			);
		}

		// Get page heading from aria attribute or text content
		const heading = headingEl?.getAttribute('aria-label') || headingEl?.textContent;

		// Fall back to document title, then url if no title was found
		const title =
			heading || document.title || parseTemplate(templates.url, { href, url, path });

		// Replace {variables} in template
		const announcement = parseTemplate(templates.visit, { title, href, url, path });

		return announcement;
	}

	focusContentElement(selector: string) {
		const el = document.querySelector<HTMLElement>(selector);
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

	focusAutofocusElement(): boolean {
		if (!this.options.autofocus) return false;

		const autofocusEl = getAutofocusElement();
		if (autofocusEl) {
			if (autofocusEl !== document.activeElement) {
				autofocusEl.focus(); // no preventScroll flag here, as probably intended
			}
			return true;
		}

		return false;
	}

	disableTransitionAnimations(visit: Visit) {
		visit.animation.animate = visit.animation.animate && this.shouldAnimate();
	}

	disableScrollAnimations(visit: Visit) {
		// @ts-ignore: animate property is not defined unless Scroll Plugin installed
		visit.scroll.animate = visit.scroll.animate && this.shouldAnimate();
	}

	shouldAnimate(): boolean {
		return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}
}
