# karmatic-nightmare

This is a fork of [Karmatic](https://github.com/developit/karmatic) which uses [Nightmare](https://github.com/segmentio/nightmare) as its browser instead of Chrome headless.

Options and usage more-or-less match karmatic; see its repo for more info.

## Differences from Karmatic
* Uses Nightmare instead of Puppeteer (runs in Electron instead of Chrome)
* Headless option is not supported
* You can use `electronRequire` in your tests to require using electron (normal `require`s are compiled using Webpack)
