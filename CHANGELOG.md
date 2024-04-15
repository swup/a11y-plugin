# Changelog

## [5.0.0] - 2024-04-15

This is a complete overhaul of the plugin, based on extensive feedback and testing in screen
readers. Some breaking changes have been made to improve the defaults. If you haven't customized the
plugin options, it's safe to upgrade, otherwise consult the readme.

- Rethink announcements: use assertive live region and announce after a delay (@ScoobyDid)
- Focus `body` on navigation instead of `main`
- Only use `h1` for announcements by default, ignore `h2`
- Disable animations by default if users prefer reduced motion
- Correctly exclude `inert` elements from autofocus
- Tested in VoiceOver, JAWS and NVDA

## [4.5.1] - 2024-04-02

- Fix the type signature of `AnnouncementTranslations`

## [4.5.0] - 2023-11-21

- Add option to focus `autofocus` elements

## [4.4.2] - 2023-10-26

- Add new method `swup.announce` for programmatically announcing something

## [4.4.1] - 2023-09-25

- Use `@swup/cli` for bundling

## [4.4.0] - 2023-09-19

- Add support for multi-language page announcements

## [4.3.0] - 2023-08-30

- Allow overriding or disabling focus selector per visit
- Fix issue where reduced motion feature would animate history visits

## [4.2.0] - 2023-08-20

- Allow disabling animations if users prefer reduced motion

## [4.1.0] - 2023-07-30

- Port to TypeScript

## [4.0.0] - 2023-07-26

- Update for swup 4 compatibility

## [3.0.0] - 2023-03-10

- Switch to microbundle
- Export native ESM module

## [2.1.0] - 2022-08-21

- Set `aria-busy` on html element during transitions

## [2.0.0] - 2021-03-15

- Fix bundle name

## [1.0.0] - 2020-08-10

- Initial release

[5.0.0]: https://github.com/swup/a11y-plugin/releases/tag/5.0.0
[4.5.1]: https://github.com/swup/a11y-plugin/releases/tag/4.5.1
[4.5.0]: https://github.com/swup/a11y-plugin/releases/tag/4.5.0
[4.4.2]: https://github.com/swup/a11y-plugin/releases/tag/4.4.2
[4.4.1]: https://github.com/swup/a11y-plugin/releases/tag/4.4.1
[4.4.0]: https://github.com/swup/a11y-plugin/releases/tag/4.4.0
[4.3.0]: https://github.com/swup/a11y-plugin/releases/tag/4.3.0
[4.2.0]: https://github.com/swup/a11y-plugin/releases/tag/4.2.0
[4.1.0]: https://github.com/swup/a11y-plugin/releases/tag/4.1.0
[4.0.0]: https://github.com/swup/a11y-plugin/releases/tag/4.0.0
[3.0.0]: https://github.com/swup/a11y-plugin/releases/tag/3.0.0
[2.1.0]: https://github.com/swup/a11y-plugin/releases/tag/2.1.0
[2.0.0]: https://github.com/swup/a11y-plugin/releases/tag/2.0.0
[1.0.0]: https://github.com/swup/a11y-plugin/releases/tag/1.0.0
