export function createElement(html: string): Element {
	const template = document.createElement('template');
	template.innerHTML = html;
	return template.content.children[0];
}
