# bagger-js

An experiment with a pure JavaScript implementation of the Bag-It specification
and a simple web application which allows bagging and transferring local content


## Major Features

* [x] File drag and drop or selection
* [ ] [Recursive directory drag and drop or selection](https://github.com/loc-rdc/bagger-js/pull/1)
* [x] Incremental hashing
* [ ] Multi-threading
* [ ] Uploads to S3
* [ ] Ability to resume interrupted transfers
* [ ] Ability to download the generated bag rather than individual files

## Docker

To build and run via [Docker](https://www.docker.com) v1.5+(exclude sudo if running on mac):

    % sudo docker build --tag bagger:dev .
    % sudo docker run -p 8000:8000 -d -t bagger:dev

## Quickstart
### setup.sh Script
For easy setup run setup.sh. This will configure your development environment using ansible. Ansible needs to be installed before running (unless using an Apple computer).

### Manual setup
The build system requires [npm](https://npmjs.org) and [gulp](http://gulpjs.com). If you don't already have Gulp installed:

    % npm install -g gulp


#### Install dependencies

    % npm install

#### Compile the sources

    % gulp

At this point the compiled JavaScript, CSS and HTML is in the `dist/` directory and ready for use.

### Run the local webserver on http://127.0.0.1:8000/

    % npm start

### Run the test suite

    % npm test

### Have Gulp watch for file changes and re-compile the sources

    % gulp develop


## Contributor Guidelines

The included .jshintrc documents the basic JavaScript requirements. Use of a Git pre-commit hook such as
https://gist.github.com/acdha/8717683/ is recommended to ensure that JSHint is already run (setup.sh automatically includes these hooks locally).
