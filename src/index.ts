import { HookDefaultHandler, HookHandler, Location, Visit, nextTick } from 'swup';
import Plugin from '@swup/plugin';
import OnDemandLiveRegion from 'on-demand-live-region';

import 'focus-options-polyfill';

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
} & {
	[key in keyof Announcements]: string;
};

type Options = {
	/** The selector for matching the main content area of the page. */
	contentSelector: string;
	/** The selector for finding headings inside the main content area. */
	headingSelector: string;
	/** Whether to skip animations for users that prefer reduced motion. */
	respectReducedMotion: boolean;
	/** How to announce the new page title and url. */
	announcements: Announcements | AnnouncementTranslations;
	/** Whether to focus elements with an [autofocus] attribute after navigation. */
	autofocus: boolean;

	/** How to announce the new page. @deprecated Use the `announcements` option.  */
	announcementTemplate?: string;
	/** How to announce a url. @deprecated Use the `announcements` option. */
	urlTemplate?: string;
};

export default class SwupA11yPlugin extends Plugin {
	name = 'SwupA11yPlugin';

	requires = { swup: '>=4' };

	defaults: Options = {
		contentSelector: 'main',
		headingSelector: 'h1, h2, [role=heading]',
		respectReducedMotion: false,
		autofocus: false,
		announcements: {
			visit: 'Navigated to: {title}',
			url: 'New page at {url}'
		}
	};

	options: Options;

	liveRegion: OnDemandLiveRegion;

	constructor(options: Partial<Options> = {}) {
		super();

		// Merge deprecated announcement templates into new structure
		options.announcements = {
			...this.defaults.announcements,
			visit: options.announcementTemplate ?? this.defaults.announcements.visit,
			url: options.urlTemplate ?? this.defaults.announcements.url,
			...options.announcements
		};

		// Merge default options with user defined options
		this.options = { ...this.defaults, ...options };

		// Create live region for announcing new page content
		this.liveRegion = new OnDemandLiveRegion();
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

		// Prepare announcement by reading new page heading
		this.on('content:replace', this.prepareAnnouncement);

		// Announce new page and focus container after content is replaced
		this.on('content:replace', this.handleNewPageContent);

		// Move focus start point when clicking on-page anchors
		this.on('scroll:anchor', this.handleAnchorScroll);

		// Disable transition and scroll animations if user prefers reduced motion
		if (this.options.respectReducedMotion) {
			this.before('visit:start', this.disableTransitionAnimations);
			this.before('visit:start', this.disableScrollAnimations);
			this.before('link:self', this.disableScrollAnimations);
			this.before('link:anchor', this.disableScrollAnimations);
		}

		// Announce something programmatically
		this.swup.announce = this.announce;
	}

	unmount() {
		this.swup.announce = undefined;
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
			focus: this.options.contentSelector
		};
	}

	prepareAnnouncement(visit: Visit) {
		// Allow customizing announcement before this hook
		if (typeof visit.a11y.announce !== 'undefined') return;

		const { contentSelector, headingSelector, announcements } = this.options;
		const { href, url, pathname: path } = Location.fromUrl(window.location.href);
		const lang = document.documentElement.lang || '*';

		// @ts-expect-error: indexing is messy
		const templates: Announcements = announcements[lang] || announcements['*'] || announcements;
		if (typeof templates !== 'object') return;

		// Look for first heading in content container
		const heading = document.querySelector(`${contentSelector} ${headingSelector}`);
		// Get page title from aria attribute or text content
		let title = heading?.getAttribute('aria-label') || heading?.textContent;
		// Fall back to document title, then url if no title was found
		title = title || document.title || this.parseTemplate(templates.url, { href, url, path });
		// Replace {variables} in template
		const announcement = this.parseTemplate(templates.visit, { title, href, url, path });

		visit.a11y.announce = announcement;
	}

	parseTemplate(str: string, replacements: Record<string, string>): string {
		return Object.keys(replacements).reduce((str, key) => {
			return str.replace(`{${key}}`, replacements[key] || '');
		}, str || '');
	}

	handleNewPageContent() {
		// We can't `await` nextTick() here because it would block ViewTransition callbacks
		// Apparently, during ViewTransition updates there is no microtask queue
		nextTick().then(async () => {
			this.swup.hooks.call('content:announce', undefined, undefined, (visit) => {
				this.announcePageName(visit);
			});
			this.swup.hooks.call('content:focus', undefined, undefined, (visit) => {
				this.focusPageContent(visit);
			});
		});
	}

	announcePageName(visit: Visit) {
		if (visit.a11y.announce) {
			this.liveRegion.say(visit.a11y.announce);
		}
	}

	announce = (message: string): void => {
		this.liveRegion.say(message);
	};

	async focusPageContent(visit: Visit) {
		// Focus disabled for this visit?
		if (!visit.a11y.focus) return;

		// Found [autofocus] element?
		if (this.options.autofocus) {
			const autofocusEl = this.getAutofocusElement();
			if (autofocusEl && autofocusEl !== document.activeElement) {
				this.swup.hooks.once('visit:end', (v) => {
					if (v.id !== visit.id) return;
					autofocusEl.focus();
				});
				return;
			}
		}

		// Otherwise, find content container and focus it
		const content = document.querySelector<HTMLElement>(visit.a11y.focus);
		if (content instanceof HTMLElement) {
			if (this.needsTabindex(content)) {
				content.setAttribute('tabindex', '-1');
			}
			content.focus({ preventScroll: true });
		}
	}

	getAutofocusElement(): HTMLElement | undefined {
		const focusEl = document.querySelector<HTMLElement>('body [autofocus]');
		if (focusEl && !focusEl.closest('inert, [aria-disabled], [aria-hidden="true"]')) {
			return focusEl;
		}
	}

	handleAnchorScroll: HookHandler<'scroll:anchor'> = (visit, { hash }) => {
		const anchor = this.swup.getAnchorElement(hash);
		if (anchor && anchor instanceof HTMLElement) {
			this.setFocusStartPoint(anchor);
		}
	};

	setFocusStartPoint(element: HTMLElement) {
		const tabindex = element.getAttribute('tabindex');

		element.setAttribute('tabindex', '-1');
		element.focus();
		element.blur();

		if (tabindex) {
			element.setAttribute('tabindex', tabindex);
		} else {
			element.removeAttribute('tabindex');
		}
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

	needsTabindex(el: HTMLElement): boolean {
		return !el.matches('a, button, input, textarea, select, details, [tabindex]');
	}
}
