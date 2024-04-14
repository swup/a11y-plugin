import { vitest, describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { setMedia } from 'mock-match-media';

import Swup, { Visit } from 'swup';

import SwupA11yPlugin from '../../src/index.js';
import { Announcer } from '../../src/announcements.js';

vitest.mock('../../src/announcements.js');
vitest.mock('../../src/focus.js');

describe('SwupA11yPlugin', () => {
	let swup: Swup;
	let plugin: SwupA11yPlugin;
	let visit: Visit;

	beforeEach(() => {
		document.body.innerHTML = '<h1>Test</h1>';

		swup = new Swup();
		plugin = new SwupA11yPlugin();
		swup.use(plugin);

		// @ts-ignore - createVisit is marked internal
		visit = swup.createVisit({ url: '/' });
		visit.to.document = new window.DOMParser().parseFromString(
			'<html><head></head><body></body></html>',
			'text/html'
		);
	});

	afterEach(() => {
		swup.unuse(plugin);
		swup.destroy();
	});

	describe('hooks', () => {
		it('creates new hooks', async () => {
			expect(swup.hooks.exists('content:announce')).toBe(true);
			expect(swup.hooks.exists('content:focus')).toBe(true);
		});
	});

	describe('visit object', () => {
		it('adds an a11y key to the visit object', async () => {
			await swup.hooks.call('visit:start', visit, undefined);
			expect(visit).toMatchObject({
				a11y: {
					announce: undefined,
					focus: 'body'
				}
			});
		});
	});

	describe('busy', () => {
		it('marks page as busy during transitions', async () => {
			await swup.hooks.call('visit:start', visit, undefined);
			expect(document.documentElement.getAttribute('aria-busy')).toBe('true');

			await swup.hooks.call('visit:end', visit, undefined);
			expect(document.documentElement.getAttribute('aria-busy')).toBeNull();
		});
	});

	describe('reduced motion', () => {
		it('ignores animations when reduced motion is unset', async () => {
			await swup.hooks.call('visit:start', visit, undefined);
			expect(visit.animation).toMatchObject({ animate: true });
			expect(visit.scroll).not.toHaveProperty('animate');
		});

		it('disables animations when reduced motion is preferred', async () => {
			setMedia({ 'prefers-reduced-motion': 'reduce' });
			await swup.hooks.call('visit:start', visit, undefined);
			expect(visit.animation).toMatchObject({ animate: false });
			expect(visit.scroll).toMatchObject({ animate: false });
		});

		it('ignores animations when reduced motion setting is disabled', async () => {
			setMedia({ 'prefers-reduced-motion': 'reduce' });
			plugin.options.respectReducedMotion = false;
			await swup.hooks.call('visit:start', visit, undefined);
			expect(visit.animation).toMatchObject({ animate: true });
			expect(visit.scroll).not.toHaveProperty('animate');
		});
	});

	describe('content focus', async () => {
		let autofocusElementFound = false;
		const focus = await import('../../src/focus.js');
		focus.focusAutofocusElement = vitest.fn().mockImplementation(() => autofocusElementFound);
		focus.focusElement = vitest.fn();

		it('focuses element from visit:end hook', async () => {
			await swup.hooks.call('visit:start', visit, undefined);
			await swup.hooks.call('visit:end', visit, undefined);

			expect(focus.focusElement).toHaveBeenCalledWith(visit.a11y.focus);
		});

		it('triggers content:focus hook from visit:end hook', async () => {
			let triggered = false;
			await swup.hooks.call('visit:start', visit, undefined);
			swup.hooks.on('content:focus', () => (triggered = true));
			await swup.hooks.call('visit:end', visit, undefined);

			expect(triggered).toBe(true);
		});

		it('focuses custom focus selector', async () => {
			await swup.hooks.call('visit:start', visit, undefined);
			visit.a11y.focus = 'main';
			await swup.hooks.call('visit:end', visit, undefined);

			expect(focus.focusElement).toHaveBeenCalledWith('main');
		});

		it('ignores empty focus selector', async () => {
			await swup.hooks.call('visit:start', visit, undefined);
			visit.a11y.focus = '';
			await swup.hooks.call('visit:end', visit, undefined);

			expect(focus.focusElement).not.toHaveBeenCalled();
		});

		it('does not autofocus from visit:end by default', async () => {
			await swup.hooks.call('visit:start', visit, undefined);
			await swup.hooks.call('visit:end', visit, undefined);

			expect(focus.focusAutofocusElement).not.toHaveBeenCalled();
		});

		it('autofocuses from visit:end hook if configured', async () => {
			plugin.options.autofocus = true;
			await swup.hooks.call('visit:start', visit, undefined);
			await swup.hooks.call('visit:end', visit, undefined);

			expect(focus.focusAutofocusElement).toHaveBeenCalled();
			expect(focus.focusElement).toHaveBeenCalled();
		});

		it('skips normal focus if autofocus element was found', async () => {
			plugin.options.autofocus = true;
			autofocusElementFound = true;
			await swup.hooks.call('visit:start', visit, undefined);
			await swup.hooks.call('visit:end', visit, undefined);

			expect(focus.focusAutofocusElement).toHaveBeenCalled();
			expect(focus.focusElement).not.toHaveBeenCalled();
		});
	});

	describe('announcements', async () => {
		let announcerMock;
		const announcements = await import('../../src/announcements.js');
		announcements.getPageAnnouncement = vitest.fn().mockImplementation(() => 'Hello');

		beforeEach(() => {
			announcerMock = vi.spyOn(plugin.announcer, 'announce');
		});

		it('creates an announcer instance', async () => {
			expect(plugin.announcer).toBeInstanceOf(Announcer);
		});

		it('adds an announce method to swup', async () => {
			expect(swup.announce).toBeInstanceOf(Function);
			await swup.announce!('Hello');
			expect(announcerMock).toHaveBeenCalledWith('Hello');
		});

		it('announces content from visit:end hook', async () => {
			await swup.hooks.call('visit:start', visit, undefined);
			await swup.hooks.call('visit:end', visit, undefined);

			expect(announcerMock).toHaveBeenCalledWith(
				visit.a11y.announce,
				plugin.announcementDelay
			);
		});

		it('triggers content:announce hook from visit:end hook', async () => {
			let triggered = false;
			await swup.hooks.call('visit:start', visit, undefined);
			swup.hooks.on('content:announce', () => (triggered = true));
			await swup.hooks.call('visit:end', visit, undefined);

			expect(triggered).toBe(true);
		});

		it('fills announcement with current page title', async () => {
			await swup.hooks.call('visit:start', visit, undefined);
			await swup.hooks.call('visit:end', visit, undefined);

			expect(announcements.getPageAnnouncement).toHaveBeenCalledWith({
				headingSelector: plugin.options.headingSelector,
				announcements: plugin.options.announcements
			});
		});

		it('announces custom announcement string', async () => {
			await swup.hooks.call('visit:start', visit, undefined);
			visit.a11y.announce = 'Custom Message';
			await swup.hooks.call('visit:end', visit, undefined);

			expect(announcerMock).toHaveBeenCalledWith('Custom Message', plugin.announcementDelay);
		});

		it('ignores empty announcement string', async () => {
			await swup.hooks.call('visit:start', visit, undefined);
			visit.a11y.announce = '';
			await swup.hooks.call('visit:end', visit, undefined);

			expect(announcerMock).not.toHaveBeenCalled();
		});
	});

	describe('anchor focus', async () => {
		const focus = await import('../../src/focus.js');
		focus.focusElement = vitest.fn();

		it('focuses anchor target from scroll:anchor hook', async () => {
			document.body.innerHTML = '<a href="#target"></a><div id="target"></div>';
			await swup.hooks.call('scroll:anchor', visit, { hash: '#target', options: {} });

			expect(focus.focusElement).toHaveBeenCalledWith(expect.any(HTMLDivElement));
		});
	});
});
