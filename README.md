# karmatic-nightmare

This is a fork of [Karmatic](https://github.com/developit/karmatic) which uses [Nightmare](https://github.com/segmentio/nightmare) as its browser instead of Chrome headless.

Options and usage more-or-less match karmatic; see its repo for more info.

## Differences from Karmatic

* Uses Nightmare instead of Puppeteer (runs in Electron instead of Chrome)
* Uses Jest's `expect` instead of Jasmine's
* You can use `electron.require` in your tests to require using electron (normal `require`s are compiled using Webpack)
* You can use the `--dev-tools` CLI option to open Electron's Dev Tools UI
* You can use the `--test-setup-script` CLI option to define a test setup file that runs before all tests run (eg `--test-setup-script ./src/test-setup.js`)
* Has a fancy jest-style reporter
