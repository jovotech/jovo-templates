[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/.github/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Template: Unit Testing

This template comes with some sample unit tests that work for both Alexa Skills and Google Actions. You can find them in `sample-tests.js` file in the `test` folder.

```sh
$ jovo new <directory> --template unit-testing

## Short version
$ jovo new <directory> -t unit-testing
```

## Setup

After dowloading the template, go into the project's root directory and run the Jovo development server. You can then run the tests in a new tab.

```sh
# Run development server
$ jovo run

## In a new tab, run the mocha npm script
$ npm test
```

Initially, there should be two tests that fail.
If you then go into the `app/app.js` and remove the comments around the `"Unhandled"` intent block, it should work.

Just change this:

```javascript
app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.followUpState('IntroductionState')
            .ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    'IntroductionState': {
        'MyNameIsIntent': function(name) {
            this.toStatelessIntent('MyNameIsIntent', name);
        },

        // // Test fails if this is commented out
        // 'Unhandled': function (name) {
        //     this.ask('What\'s your name?');
        // },
    },

    'MyNameIsIntent': function(name) {
        this.tell('Hey ' + name.value + ', nice to meet you!');
    },

});
```

To that:

```javascript
app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.followUpState('IntroductionState')
            .ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    'IntroductionState': {
        'MyNameIsIntent': function(name) {
            this.toStatelessIntent('MyNameIsIntent', name);
        },

        // Test fails if this is commented out
        'Unhandled': function (name) {
            this.ask('What\'s your name?');
        },
    },

    'MyNameIsIntent': function(name) {
        this.tell('Hey ' + name.value + ', nice to meet you!');
    },

});
```
