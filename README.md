# Swup A11y Plugin

A [swup](https://swup.js.org) plugin for enhanced accessibility.

Loading new content via AJAX is a great experience for most users, but comes with serious
shortcomings for screen reader users. This plugin will improve that:

- **Announce page visits** to screenreaders by reading the new page title
- **Focus the main content area** after swapping out the content

## Installation

Install the plugin from npm and import it into your bundle.

```bash
npm install @swup/a11y-plugin
```

```js
import SwupA11yPlugin from '@swup/a11y-plugin';
```

Or include the minified production file from a CDN:

```html
<script src="https://unpkg.com/@swup/a11y-plugin@4"></script>
```

## Usage

To run this plugin, include an instance in the swup options.

```javascript
const swup = new Swup({
  plugins: [new SwupA11yPlugin()]
});
```

## Markup

The plugin should work out of the box if you use proper semantic markup for your
content, i.e. `main` for your content area and `h1` or `h2` for your headings.
See the options below for customizing what elements to look for.

```html
<header>
  Logo
</header>
<main> <!-- will be focussed -->
  <h1>Page Title</h1> <!-- will be announced -->
  <p>Lorem ipsum dolor sit amet</p>
</main>
```

If you want the announcement to be different from the text content, use `aria-label`:

```html
<h1 aria-label="Homepage">Project Title</h1> <!-- will announce 'Homepage' -->
```

## Styling

Browsers will display a visible outline around the main content area when it
receives focus after navigation. Make sure to remove the outline in your CSS
if that isn't the desired behavior.

```css
main:focus {
  outline: none;
}
```

## Options

All options with their default values:

```javascript
{
  contentSelector: 'main',
  headingSelector: 'h1, h2, [role=heading]',
  announcementTemplate: 'Navigated to: {title}',
  urlTemplate: 'New page at {url}'
}
```

### contentSelector

The selector for matching the main content area of the page.

This area will receive focus after a new page was loaded.

### headingSelector

The selector for finding headings **inside the main content area**.

The first heading's content will be read to screen readers after a new page was loaded.

### announcementTemplate

How to announce the new page title.

### urlTemplate

How to announce the new page url.

Only used as fallback if neither a title tag nor a heading were found.
