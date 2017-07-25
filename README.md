# Photod
An *experimental* photo gallery.

## Introduction
Photod (pronounced photo-*dee*) is web-based photo (and video) gallery. Media files are enrolled and processed using command-line tools. During processing, steps can extract metadata, render thumbnails, create filmstrips, geocode GPS data and more.

This project started as a *private* alternative to Google Photos, using the latest and available software tools available (don't expect support for browsers other than Chrome). It is an experimental photo gallary, meaning that it is easy to add new steps to extract more information.

There is a backend that is based on the Django Web Framework. It also provided the command-line interface for enrolling and processing of media files. The frontend is based on Webpack, React and UIkit.

## Screenshots
<img src="https://raw.githubusercontent.com/basilfx/Photod/master/docs/screenshots/login.png" width="256"><img src="https://raw.githubusercontent.com/basilfx/Photod/master/docs/screenshots/directories1.png" width="256"><img src="https://raw.githubusercontent.com/basilfx/Photod/master/docs/screenshots/directories2.png" width="256"><img src="https://raw.githubusercontent.com/basilfx/Photod/master/docs/screenshots/tags.png" width="256"><img src="https://raw.githubusercontent.com/basilfx/Photod/master/docs/screenshots/map.png" width="256"><img src="https://raw.githubusercontent.com/basilfx/Photod/master/docs/screenshots/search.png" width="256"><img src="https://raw.githubusercontent.com/basilfx/Photod/master/docs/screenshots/about.png" width="256">

## Installation
Refer to [`INSTALLATION.md`](INSTALLATION.md) for information on how to install Photod.

## Contributing
Feel free to submit a pull request. All pull requests must be made against the `development` branch.

Python code should follow the PEP-8 conventions and the JavaScript code should comply with the included ESLint style rules.

## License
See the [`LICENSE.md`](LICENSE.md) file (MIT license).
