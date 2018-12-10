[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Template: True-or-False Game
## with public Google Spreadsheet integration


This project is a simple example for a True-or-False-Quiz.
It tells you different facts and you have to answer with "true" or "false". For every correct answer, you get a point, for every incorrect answer you lose one. Your total points will be saved and you can open the game again to collect more points.
___


We had one example of this project without any i18n or CMS, one with the jovo i18n integration, and now we used the new jovo Google spreadsheet integration. 

Different than in the jovo i18n example, this one has the whole content/text outsourced in a google spreadsheet. You can take look at it [here](https://docs.google.com/spreadsheets/d/1dSM_4n7zUgZwLevo8QwGS_ZKcWADHk1kvmscI0tEu24/edit#gid=0 "spreadsheet 'True or False Game'").

You can add more languages here by adding more columns to the sheet and name them by the locale ID (e.g. `en-US`, `de-DE`, `en-GB`, etc.).

The `/i18n` folder with the `en.json` and the `answers.json` was removed, we do not need it anymore.

The `cms` configurations were added to the `config.js`:
```javascript
cms: {
        GoogleSheetsCMS: {
            sheets: [
                {
                    spreadsheetId: '1dSM_4n7zUgZwLevo8QwGS_ZKcWADHk1kvmscI0tEu24',
                    name: 'responses',
                    access: 'public',
                    type: 'Responses',
                    position: 1,
                },
                {
                    spreadsheetId: '1dSM_4n7zUgZwLevo8QwGS_ZKcWADHk1kvmscI0tEu24',
                    name: 'answers',
                    access: 'public',
                    type: 'KeyValue',
                    position: 2,
                }
            ]
        }
    },
```
You can find the spreadsheet ID in the URL of your spreadsheet. Your spreadsheet must be public - for publishing go to 'File' > 'Publish to the web'. Later, when you want to use a private spreadsheet for your project, you need to follow our tutorial for private spreadsheet integration (coming soon!) But for now, we use the public spreadsheet.

As you can see in the `config.js`, the `responses`-sheet has the `type: 'Responses'`. This sheet type is for translation to different languages, the `this.t('KEY')` function uses this one for translation. 

The `answers`-sheet has the `type: 'KeyValue'`. This one is just for getting the value of a certain key. In our case, it is used for storing the answers 'true' or 'false' for the statements.

Getting a value from the CMS looks like this:
```javascript
const answer = this.$cms.answers[`STATEMENT_3`]; // returns 'FALSE'
```
