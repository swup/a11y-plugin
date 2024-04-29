import { HookHandler, Visit } from 'swup';
import Plugin from '@swup/plugin';

import 'focus-options-polyfill';

import { Announcer, getPageAnnouncement } from './announcements.js';
import { focusAutofocusElement, focusElement } from './focus.js';
import { prefersReducedMotion } from './util.js';

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
export type Announcements = {
	/** How to announce the new page. */
	visit: string;
	/** How to read a page url. Used as fallback if no heading was found. */
	url: string;
};

/** Translations of announcements, keyed by language. */
export type AnnouncementTranslations = {
	[lang: string]: Announcements;
};

export type Options = {
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

	/**
	 * The announcer instance for reading new page content.
	 */
	announcer: Announcer;

	/**
	 * The delay before announcing new page content.
	 * Why 100ms? see research at https://github.com/swup/a11y-plugin/pull/50
	 */
	announcementDelay: number = 100;

	/**
	 * The selector for the main content area of the page, to focus after navigation.
	 */
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

		// Move focus start point when clicking on-page anchors
		this.on('scroll:anchor', this.handleAnchorScroll);

		// Disable transition and scroll animations if user prefers reduced motion
		this.before('visit:start', this.disableAnimations);
		this.before('link:self', this.disableAnimations);
		this.before('link:anchor', this.disableAnimations);

		// Announce something programmatically
		this.swup.announce = this.announce.bind(this);
	}

	unmount() {
		this.swup.announce = undefined;
	}

	async announce(message: string): Promise<void> {
		await this.announcer.announce(message);
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
				visit.a11y.announce = this.getPageAnnouncement();
			}

			if (!visit.a11y.announce) return;

			this.announcer.announce(visit.a11y.announce, this.announcementDelay);
		});
	}

	focusContent(visit: Visit) {
		this.swup.hooks.callSync('content:focus', visit, undefined, (visit) => {
			if (!visit.a11y.focus) return;

			// Found and focused [autofocus] element? Return early
			if (this.options.autofocus && focusAutofocusElement() === true) return;

			// Otherwise, find and focus actual content container
			focusElement(visit.a11y.focus);
		});
	}

	handleAnchorScroll: HookHandler<'scroll:anchor'> = (visit, { hash }) => {
		const anchor = this.swup.getAnchorElement(hash);
		if (anchor instanceof HTMLElement) {
			focusElement(anchor);
		}
	};

	getPageAnnouncement(): string | undefined {
		const { headingSelector, announcements } = this.options;
		return getPageAnnouncement({ headingSelector, announcements });
	}

	disableAnimations(visit: Visit) {
		if (this.options.respectReducedMotion && prefersReducedMotion()) {
			visit.animation.animate = false;
			// @ts-expect-error: animate is undefined unless Scroll Plugin installed
			visit.scroll.animate = false;
		}
	}
}
