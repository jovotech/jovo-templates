[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Sample Voice App for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-templates"><strong>Templates </strong></a> -<a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Sample Voice App for Jovo

```javascript
app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.ask('Hello World! What is your name?', 'Please tell me your name.');
    },

    'MyNameIsIntent': function(name) {
        this.tell('Hey ' + name + ', nice to meet you!');
    },
});
```

[Jovo](https://www.jovo.tech "Jovo's website") is a development framework for cross-platform voice apps. Use this repository as a starting point to create a voice application for Amazon Alexa and Google Assistant.

> 🚀 Join our newsletter for free courses on voice app development: www.jovo.tech/newsletter 

## Table of Contents

* [Getting Started](#getting-started)
* [Tutorials](#tutorials)
* [How to Contribute](#how-to-contribute)


## Getting Started

In this guide, you will learn how to create a "Hello World" voice app for both Amazon Alexa and Google Assistant.

### Install the Jovo CLI

The [Jovo CLI](https://github.com/jovotech/jovo-cli) is the best way to get started with Jovo development:

```sh
$ npm install -g jovo-cli
```

To learn more, please find the [Getting Started Guide](https://www.jovo.tech/framework/docs/installation) in the Jovo Framework Docs.

### Create a new Project

```sh
$ jovo new <directory>
```

This will clone the Jovo Sample Voice App into a new directory with a name specified by you.

### Configure your App

You can configure the app and add to its logic in the `app` folder, where you can find a file [`app.js`](./app/app.js), which looks like this:

```javascript
'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.ask('Hello World! What is your name?', 'Please tell me your name.');
    },

    'MyNameIsIntent': function(name) {
        this.tell('Hey ' + name + ', nice to meet you!');
    },
});

module.exports.app = app;
```

### Configure the Language Model

You can change the language model in the `/models`folder and can use the [Jovo CLI](https://github.com/jovotech/jovo-cli) to build platform specific language models into a new `/platforms` folder, and then deploy the language model to the platforms.

For example, you can do it like so:

```sh
# Initialize a Platform (alexaSkill or googleAction)
$ jovo init alexaSkill

# Build platform specific language model into /platforms
$ jovo build

# Deploy language model
$ jovo deploy
```

There is also a super fast way to do everything at once:

```sh
# Long version
$ jovo new <directory> --build alexaSkill --deploy

# Short version
$ jovo new <directory> -b alexaSkill -d
```

To find other ways to deploy the language model, please take a look at the tutorials:

* [Build an Alexa Skill with Jovo](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/)
* [Build a Google Action with Jovo](https://www.jovo.tech/blog/google-action-tutorial-nodejs/)



### Run the Code

The [`index.js`](./index.js) file is responsible for the server configuration.

You can run this template in two ways:
* Webhook ([docs](https://www.jovo.tech/framework/docs/server/webhook)): Do `$ jovo run` and use a tool like [ngrok](https://www.ngrok.com) to point to the local webhook
* AWS Lambda ([docs](https://www.jovo.tech/framework/docs/server/aws-lambda)): Zip the folder and upload there

The file looks like this:

```javascript
'use strict';

const {Webhook} = require('jovo-framework');
const {app} = require('./app/app.js');

// =================================================================================
// Server Configuration
// =================================================================================

if (app.isWebhook()) {
    const port = process.env.PORT || 3000;
    Webhook.listen(port, () => {
        console.log(`Example server listening on port ${port}!`);
    });
    Webhook.post('/webhook', (req, res) => {
        app.handleWebhook(req, res);
    });
}

exports.handler = (event, context, callback) => {
    app.handleLambda(event, context, callback);
};

```