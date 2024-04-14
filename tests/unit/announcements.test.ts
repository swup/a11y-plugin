import { afterEach, describe, expect, it } from 'vitest';
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
