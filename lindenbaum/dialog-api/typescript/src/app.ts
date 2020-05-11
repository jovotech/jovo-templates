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
    new NlpjsNlu(),
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

        this.$lindenbaumBot!.addData('user-name', name);
        this.tell('Hey ' + name + ', nice to meet you!');
    },

    async END() {
        const data = await this.$lindenbaumBot!.getDialogData('<your-reseller-token>');
        this.$user.$data.dialogData = data;
    }
});

export { app };
