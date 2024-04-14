import { vitest, describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { setMedia } from 'mock-match-media';

import Swup, { Visit } from 'swup';

import SwupA11yPlugin from '../../src/index.js';
import { Announcer } from '../../src/announcements.js';

vitest.mock('../../src/announcements.js');
vitest.mock('../../src/focus.js');

const page = { page: { html: '', url: '/' } };

describe('SwupA11yPlugin', () => {
	let swup: Swup;
	let plugin: SwupA11yPlugin;
	let visit: Visit;

	beforeEach(() => {
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

	describe('announcements', () => {
		it('creates an announcer instance', async () => {
			expect(plugin.announcer).toBeInstanceOf(Announcer);
		});

		it('adds an announce method to swup', async () => {
			expect(swup.announce).toBeInstanceOf(Function);
			const announcerMock = vi.spyOn(plugin.announcer, 'announce');
			await swup.announce!('Hello');
			expect(announcerMock).toHaveBeenCalledWith('Hello');
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

	describe('focus', async () => {
		let autofocusElementFound = false;
		const focus = await import('../../src/focus.js');
		focus.focusAutofocusElement = vitest.fn().mockImplementation(() => autofocusElementFound);
		focus.focusElement = vitest.fn();

		it('calls focusElement from visit:end hook', async () => {
			await swup.hooks.call('visit:start', visit, undefined);
			await swup.hooks.call('visit:end', visit, undefined);

			expect(focus.focusElement).toHaveBeenCalledWith(visit.a11y.focus);
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

});
