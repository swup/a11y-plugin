# Swup A11y Plugin

A [swup](https://swup.js.org) plugin for enhanced accessibility.

Loading new content via AJAX is a great experience for most users, but comes with serious
shortcomings for screen reader users. This plugin will improve that:

- **Announce page visits** to screenreaders by reading the new page title
- **Focus the main content area** after swapping out the content
- **Skip animations** for users with a preference for reduced motion

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

See these guides on [Controlling focus](https://web.dev/control-focus-with-tabindex/)
and [Styling focus](https://web.dev/style-focus/) for details and more examples.

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
  respectReducedMotion: false,
  announcements: {
    title: 'Navigated to: {title}',
    url: 'New page at {url}'
  }
}
```

### contentSelector

The selector for matching the main content area of the page.

This area will receive focus after a new page was loaded.

### headingSelector

The selector for finding headings **inside the main content area**.

The first heading's content will be read to screen readers after a new page was loaded.

### respectReducedMotion

Whether to respects users' preference for reduced motion.

Disable animated page transitions and animated scrolling if a user has enabled a
setting on their device to minimize the amount of non-essential motion. Learn more about
[prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

### announcements

How to announce the new page. If found, the title tag or main heading is announced. In case neither
is found, the new url will be announced as title instead.

```js
{
  announcements: {
    title: 'Navigated to: {title}',
    url: 'New page at {url}'
  }
}
```

#### Translations

For multi-language sites, pass in a nested object keyed by locale. The locale must match the
`html` element's [lang](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/lang) attribute
exactly. Use an asterisk `*` to declare fallback translations.

> **Note**: Swup will not update the lang attribute on its own. For that, you can either install the
[Head Plugin](https://swup.js.org/plugins/head-plugin/) to do it automatically, or you can do update
it yourself in the `content:replace` hook.

```js
{
  announcements: {
    'en-US': {
      title: 'Navigated to: {title}',
      url: 'New page at {url}'
    },
    'de-DE': {
      title: 'Navigiert zu: {title}',
      url: 'Neue Seite unter {url}'
    },
    'fr-FR': {
      title: 'Navigué vers : {title}',
      url: 'Nouvelle page à {url}'
    },
    '*': {
      title: '{title}',
      url: '{url}'
    }
  }
}
```

#### Deprecated options

The following two options are now grouped in the `announcements` object and deprecated.

- `announcementTemplate`: equivalent to `announcements.title`
- `urlTemplate`: equivalent to `announcements.url`

## Visit object

The plugin extends the visit object with a new `a11y` key that can be used to customize the
behavior on the fly.

```js
{
  from: { ... },
  to: { ... },
  a11y: {
    announcement: 'Navigated to: About',
    focus: 'main'
  }
}
```

### visit.a11y.announcement

The text to announce after the new page was loaded. This is the final text after choosing the
correct language from the [announcements](#announcements) option and filling in any placeholders.
Modify to read a custom announcement.

Since the text can only be populated once the new page was fetched and its contents are available,
so the only practical place to inspect or overwrite this would be right before the
`content:announce` hook:

```js
swup.hooks.before('content:announce', (visit) => {
  visit.a11y.announce = 'New page loaded';
});
```

### visit.a11y.focus

The element to receive focus after the new page was loaded. This is taken directly from the
`contentSelector` option passed into the plugin, but can be customized per visit. Set it to a
selector `string` to select an element, or set it to `false` to not move the focus on this visit.

## Hooks

The plugin adds two new hooks: `content:announce` and `content:focus`. Both run directly
after the internal `content:replace` handler, when the new content is already in the DOM.

### content:announce

Executes the announcement of the new page title.

```js
swup.hooks.on('content:announce', () => console.log('New content was announced'));
```

### content:focus

Executes the focussing of the new main content container.

```js
swup.hooks.on('content:focus', () => console.log('New content received focus'));
```
