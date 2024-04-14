import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Announcer, getPageAnnouncement } from '../../src/announcements.js';

describe('announcer', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	describe('live region', () => {
		it('creates an empty live region', () => {
			const announcer = new Announcer();
			const region = announcer.region;

			expect(region).toBeInstanceOf(HTMLElement);
			expect(region.id).toBe('swup-announcer');
			expect(region.getAttribute('aria-live')).toBe('assertive');
			expect(region.parentNode).toBe(document.body);
			expect(region.textContent).toBe('');
		});

		it('creates an invisible live region', () => {
			const announcer = new Announcer();
			const region = announcer.region;

			expect(region.style.position).toBe('absolute');
			expect(region.style.top).toBe('0px');
			expect(region.style.left).toBe('0px');
		});

		it('reuses existing live region', () => {
			const existingRegion = document.createElement('div');
			existingRegion.id = 'swup-announcer';
			document.body.appendChild(existingRegion);

			const announcer = new Announcer();
			expect(announcer.region).toBe(existingRegion);
		});
	});

	describe('announce', () => {
		it('returns a promise',  () => {
			const announcer = new Announcer();
			expect(announcer.announce('Hello')).toBeInstanceOf(Promise);
		});

		it('adds the announcement to the live region', async () => {
			const announcer = new Announcer();
			await announcer.announce('Hello');
			expect(announcer.region.textContent).toBe('Hello');
		});

		it('modifies the announcement to allow duplicate messages', async () => {
			const announcer = new Announcer();
			const region = announcer.region;

			await announcer.announce('Hello');
			expect(region.textContent).toBe('Hello');
			await announcer.announce('Hello');
			expect(region.textContent).toBe('Hello.');
			await announcer.announce('Hello');
			expect(region.textContent).toBe('Hello');
		});
	});
});

describe('getPageAnnouncement', () => {
	const announcements = {
		visit: 'Loaded {title}',
		url: 'page at {url}'
	};

	const multiLangAnnouncements = {
		en: {
			visit: 'Loaded {title}',
			url: 'page at {url}'
		},
		de: {
			visit: '{title} geladen',
			url: 'Seite unter {url}'
		},
		'*': {
			visit: '{title}',
			url: '{url}'
		}
	};

	const defaults = { headingSelector: 'h1', announcements };

	describe('headings', () => {
		it('gets heading title', () => {
			document.body.innerHTML = '<h1>Title</h1>';
			const announcement = getPageAnnouncement(defaults);
			expect(announcement).toBe('Loaded Title');
		});

		it('prefers heading label', () => {
			document.body.innerHTML = '<h1 aria-label="Label">Title</h1>';
			const announcement = getPageAnnouncement(defaults);
			expect(announcement).toBe('Loaded Label');
		});

		it('uses heading selector', () => {
			document.body.innerHTML = '<h2>Section</h2><h1>Title</h1>';
			const announcement = getPageAnnouncement(defaults);
			expect(announcement).toBe('Loaded Title');
		});

		it('makes heading selector configurable', () => {
			document.body.innerHTML = '<h1>Title</h1><h2>Section</h2>';
			const announcement = getPageAnnouncement({ ...defaults, headingSelector: 'h2' });
			expect(announcement).toBe('Loaded Section');
		});
	});

	describe('fallbacks', () => {
		it('uses document title if no heading is found', () => {
			document.title = 'Document';
			document.body.innerHTML = '';
			const announcement = getPageAnnouncement(defaults);
			expect(announcement).toBe('Loaded Document');
		});

		it('uses url if no title is found', () => {
			document.body.innerHTML = '';
			document.title = '';
			const announcement = getPageAnnouncement(defaults);
			expect(announcement).toBe('Loaded page at /');
		});
	});
});
