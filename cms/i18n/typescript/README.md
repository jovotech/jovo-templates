[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Template: True-or-False Game
## with i18n integration

Sample True-or-False Voice App

```sh
$ jovo new <directory> --template cms/i18n 
```

This project is a simple example for a True-or-False-Quiz.
It tells you different facts and you have to answer with "true" or "false". For every correct answer, you get a point, for every incorrect answer you lose one. Your total points will be saved and you can open the game again to collect more points.
___

This project uses the jovo i18n integration for supporting multiple languages. 
i18n works by separating the content (the text/speech) from the application logic. [Read more](https://www.jovo.tech/docs/v2/output/i18n#introduction-to-i18n "jovo docs i18n").

The speech responses are stored in the `/src/i18n/en.json` file. Add more languages through adding more json files like `en.json`, using the locale ID (e.g. `en-US.json`, `de-DE.json`, `en-GB.json`, etc.). `en.json` is for all english locale IDs.

The answers for the true-or-false-questions are stored in the `/src/answers.json` file.

With `this.t('REPROMPT')`, the key `REPROMPT` gets translated to its value, that is defined in `en.json`.  
For example here:
```javascript
this.$reprompt.addText(this.t('REPROMPT'));
```
