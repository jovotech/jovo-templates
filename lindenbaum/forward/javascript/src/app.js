'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Lindenbaum } = require('jovo-platform-Lindenbaum');
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
        return this.ask('Do you want me to hand over the conversation to a human?');
    },

    YesIntent() {
        return this.$lindenbaumBot.addForward('<your-phone-number>');
    },

    NoIntent() {
        return this.tell('Ok, maybe next time');
    },
});

module.exports.app = app;
