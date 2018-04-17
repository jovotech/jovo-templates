[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Jovo Templates

The examples in this repository are a great starting point to learn about specific features of the [Jovo Framework](https://github.com/jovotech/jovo-framework-nodejs).

To access the templates, you first need to install the [Jovo CLI](https://github.com/jovotech/jovo-cli) with `$ npm install -g jovo-cli`. Then, you can create a new project from your command line with the following command:

```sh
# Standard version
$ jovo new <directory> --template <name>

# Short version
$ jovo new <directory> -t <name>
``` 

The following templates are currently available:

Name | Description 
:--- | :---
[`helloworld`](./01_helloworld) | `Default`. Jovo Sample Voice App with a simple "Hello World!" + asking for the user's name 
[`alexa-audioplayer`](./alexa/audioplayer) | Sample Alexa Audioplayer Skill that plays a longform audio file with the Audioplayer directive
[`trivia-game`](./03_trivia-game) | Trivia game voice app that makes use of states, helper functions, and i18n
[`google-mediaresponse`](./google/mediaresponse) | Sample Google Action media response app that plays longform audio file
[`alexa-dialoginterface`](alexa/dialoginterface) | Sample implementation of the Alexa dialog interface
