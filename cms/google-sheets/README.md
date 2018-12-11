[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Template: True-or-False Game
## with public Google Spreadsheet integration

Sample True-or-False Voice App

```sh
$ jovo new <directory> --template cms/google-sheets
```

This project is a simple example for a True-or-False-Quiz.
It tells you different facts and you have to answer with "true" or "false". For every correct answer, you get a point, for every incorrect answer you lose one. Your total points will be saved and you can open the game again to collect more points.
___

This project uses the jovo Google Spreadsheet integration, the whole content/text is outsourced in a google spreadsheet. Take a look at it [here](https://docs.google.com/spreadsheets/d/1dSM_4n7zUgZwLevo8QwGS_ZKcWADHk1kvmscI0tEu24/edit#gid=0 "spreadsheet 'True or False Game'").

More languages can be added by adding more columns to the sheet and name them by the locale ID (e.g. `en-US`, `de-DE`, `en-GB`, etc.).

These are the `cms` configurations in `config.js`:
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
The spreadsheet ID can be found in its URL. This spreadsheet is public. 
For using a private spreadsheet, follow our tutorial for private spreadsheet integration (coming soon).

The `responses`-sheet has the `type: 'Responses'`. This sheet type is for translation to different languages, the `this.t('KEY')` function uses this one for translating the key. 

The `answers`-sheet has the `type: 'KeyValue'`. This one is just for getting the value of a certain key. In this case, it is used for storing the answers 'true' or 'false' for the statements.
