'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Lindenbaum } = require('jovo-platform-lindenbaum');
const { NlpjsNlu } = require('jovo-nlu-nlpjs');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

const lindenbaum = new Lindenbaum();
lindenbaum.use(
    new NlpjsNlu({
        languages: ['de', 'en'],
    }),
);

app.use(
    lindenbaum,
    new JovoDebugger(),
    new FileDb(),
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?');
    },

    MyNameIsIntent() {
        const name = this.$inputs.name.value;

        this.$lindenbaumBot.addData('user-name', name);
        this.tell('Hey ' + name + ', nice to meet you!');
    },

    async END() {
        const data = await this.$lindenbaumBot.getDialogData('<your-reseller-token>');
        this.$user.$data.dialogData = data;
    }
});

module.exports.app = app;
