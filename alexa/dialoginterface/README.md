[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Template: Alexa Dialog Interface

Jovo Sample Alexa Skill that uses the Alexa Dialog Interface.

```sh
$ jovo new <directory> --template alexa-dialoginterface
```

# Search Flight Intent

First the dialog is delegated to Alexa to fill the {fromCity}, {toCity} and {date} slot.
After that the dialog is considered completed.

We manually check, if there is a value for {count}. If not, the skill will ask the user for the ticket count.

All the slots are filled and we ask the user to confirm the whole intent.
After the confirmation we route the user to another intent, which we pass the data to.
