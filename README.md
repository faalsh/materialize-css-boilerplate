[![Build Status](https://travis-ci.org/faalsh/materialize-css-boilerplate.svg?branch=master)](https://travis-ci.org/faalsh/materialize-css-boilerplate) [![Dependencies Status](https://david-dm.org/faalsh/materialize-css-boilerplate.svg)](https://david-dm.org/faalsh/materialize-css-boilerplate.svg
)

# materialize-css-boilerplate
Powerful yet simple boilerplate to get you started quickly with materialize-css to build responsive websites with a seamless development experience

Checkout [materialize-css] to learn more about this responsive framework

## Features

This boilerplate include my favorite tools and components

* Javascripts and CSS files are uglyfied and minified for the production version
* Javascripts and CSS files are injected automatically into the html
* The sources are compiled into two differnt versions (development and release)
* The sources are build using Gulp
* Watches the files and refresh the browser automatically
* More effeicient coding with Jade, SASS and CoffeeScript
* Front-End dependencies are managed with Bower


## Requirements

* [Node.js](https://nodejs.org/)
* [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* SASS and Compass
```
gem install sass
```
```
gem install compass
```

* Gulp
```
npm install -g gulp
```

* Bower
```
npm install -g bower
```

## Setup

To setup the project and install all dependencies, run 

```
npm install 
```

To run 

```
gulp watch
```

Then the browser will automatically open [http://localhost:3000](http://localhost:3000)

To release 

```
gulp
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
