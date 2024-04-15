export function createElement(html: string): HTMLElement {
	const template = document.createElement('template');
	template.innerHTML = html;
	return template.content.children[0] as HTMLElement;
}

export function parseTemplate(str: string, replacements: Record<string, string>): string {
	return Object.keys(replacements).reduce((str, key) => {
		return str.replace(`{${key}}`, replacements[key] || '');
	}, str || '');
}

export function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
