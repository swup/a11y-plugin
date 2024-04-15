import { afterEach, vi } from 'vitest';
import { matchMedia, cleanupMedia } from 'mock-match-media';

window.matchMedia = matchMedia;

afterEach(() => {
	document.body.innerHTML = '';
	vi.clearAllMocks();
	cleanupMedia();
});
