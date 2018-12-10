[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Template: True-or-False Game
## with plain-text content

This project is a simple example for a True-or-False-Quiz Voice App.

It tells you different facts and you have to answer with "true" or "false". For every correct answer, you get a point, for every incorrect answer you lose one. Your total points will be saved and you can open the game again to collect more points.

In this project the output speech is just plain-text in the code, it does not use a CMS. 
And the quiz statements are stored in a global two-dimensional array, which has for each statement a string and a boolean value.

In the next step, the jovo i18n integration will be added, so you can easily manage the speech content and switch languages.
