# Photod
An experimental photo gallery.

## Introduction
Photod (pronounced photo-dee) is web-based photo gallery. Images are enrolled en processed using commandline tools. During processing, different steps can extract metadata, calculate thumbnails, create filmstrips, geocode GPS data and more.

This project started as a *private* alternative to Google Photos, using the latest and available software tools available (don't expect support for browsers other than Chrome). It is an experimental photo gallary, meaning that it is easy to add new steps to extract more information.

There is a backend based on Django Web Framework, that also provided commandline interface for enrolling photos. The frontend is based on Webpack, React and UIkit.

## Screenshots

## Installation
Refer to [`INSTALLATION.md`](INSTALLATION.md) for information on how to install Photod.

## Contributing
Feel free to submit a pull request. All pull requests must be made against the `development` branch.

Python code should follow the PEP-8 conventions and the JavaScript code should comply with the included ESLint style rules.

## License
See the [`LICENSE.md`](LICENSE.md) file (MIT license).
