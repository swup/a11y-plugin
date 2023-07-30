declare module 'on-demand-live-region' {
	export default class OnDemandLiveRegion {
		constructor(options?: {
			level?: 'polite' | 'assertive';
			parent?: string | HTMLElement;
			idPrefix?: string;
			delay?: number;
		});

		say(message: string, delay?: number): this;
	}
}
