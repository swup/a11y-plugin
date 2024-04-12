export function createElement(html: string): Element {
	const template = document.createElement('template');
	template.innerHTML = html;
	return template.content.children[0];
}

export function parseTemplate(str: string, replacements: Record<string, string>): string {
	return Object.keys(replacements).reduce((str, key) => {
		return str.replace(`{${key}}`, replacements[key] || '');
	}, str || '');
}
