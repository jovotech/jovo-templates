import { App } from 'jovo-framework';
import { Lindenbaum } from 'jovo-platform-lindenbaum';
import { NlpjsNlu } from 'jovo-nlu-nlpjs';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

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
        return this.$lindenbaumBot!.addForward('<your-phone-number>');
    },

    NoIntent() {
        return this.tell('Ok, maybe next time');
    },
});

export { app };
