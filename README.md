# Jovo v3 Templates

> This repository only contains templates for Jovo `v3`. You can find the Jovo `v4` templates here: [TypeScript](https://github.com/jovotech/jovo-v4-template), [JavaScript](https://github.com/jovotech/jovo-v4-template-js).

The examples in this repository are a great starting point to learn about specific features of the [Jovo Framework](https://github.com/jovotech/jovo-framework-nodejs).

To access the templates, you first need to install the [Jovo CLI](https://github.com/jovotech/jovo-cli) with `$ npm install -g jovo-cli`. Then, you can create a new project from your command line with the following command:

```sh
# Standard version
$ jovo3 new <directory> --template <name>

# Short version
$ jovo3 new <directory> -t <name>
``` 

The following templates are currently available:

Name | Description 
:--- | :---
[`helloworld`](./01_helloworld) | `Default`. Jovo Sample Voice App with a simple "Hello World!" + asking for the user's name 
[`trivia-game`](./02_trivia-game) | Trivia game voice app that makes use of states, helper functions, and i18n
[`alexa/audioplayer`](./alexa/audioplayer) | Sample Alexa Audioplayer Skill that plays a longform audio file with the Audioplayer directive
[`alexa/dialoginterface`](alexa/dialoginterface) | Sample implementation of the Alexa Dialog Interface
[`alexa/skillevents`](./alexa/skillevents) | Sample implementation of the Alexa Skill Events.
[`google/mediaresponse`](./google/mediaresponse) | Sample Google Action media response app that plays longform audio file
