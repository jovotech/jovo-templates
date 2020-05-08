[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Template: Hello World

This template contains a Jovo Sample Voice App with a simple "Hello World!" greeting, asking for the user's name and returning a personalised message. This is the default template for the `jovo new` command.

## Quick Start

To use the Jovo Templates, you'll need the Jovo CLI. You can install it globally with NPM.

```sh
$ npm install -g jovo-cli
```

After successfully installing the Jovo CLI, you can install the template using one of the following commands:

```sh
$ jovo new <directory>

## Alternative
$ jovo new <directory> --template helloworld
```

> Read more about `jovo new` [here](https://www.jovo.tech/marketplace/jovo-cli#jovo-new).

Change your working directory into your newly created project directory and run your voice app:

```sh
# Change working directory to your previously specified directory.
$ cd <directory>

# Run voice app, optionally with a --watch flag to restart on code changes.
$ jovo run [-w]
```

> Read more about `jovo run` [here](https://www.jovo.tech/marketplace/jovo-cli#jovo-run).

![Debugger Example](./debugger.gif)

## Next Steps

Now that you got the template running on the Jovo Debugger, it is time to deploy your skill to the Alexa Skills Console. You can find a tutorial for building a complete skill [here](https://www.jovo.tech/tutorials/alexa-skill-tutorial-nodejs).

To see what else you can do with the Jovo Framework, take a look at the [Jovo Documentation](https://www.jovo.tech/docs/).

## About Jovo

Jovo is the most popular development framework for voice, including platforms like Alexa, Google Assistant, mobile apps, and Raspberry Pi.
