import {App} from 'jovo-framework';
import {Alexa} from 'jovo-platform-alexa';
import {JovoDebugger} from 'jovo-plugin-debugger';
import {FileDb} from 'jovo-db-filedb';
import {GoogleAssistant} from 'jovo-platform-googleassistant';
import {HandleRequest} from 'jovo-core';
// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

console.log('This template uses an outdated version of the Jovo Framework. We strongly recommend upgrading to Jovo v4. Learn more here: https://www.jovo.tech/docs/migration-from-v3');

const app = new App();

class CustomLogging {
    output: string;

    constructor() {
        this.output = '';
    }

    /**
     * Called when the App-instance attempts to install this plugin.
     * @param app
     */
    install(app: App) {
        app.middleware('platform.output')!.use(this.saveOutput.bind(this));
        app.middleware('platform.nlu')!.use(this.log.bind(this));
    }

    /**
     * Called when the App-instance attempts to uninstall this plugin.
     * @param app
     */
    uninstall(app: App) {

    }


    /**
     * Called when the request gets to the `platform.output` middleware
     * @param handleRequest
     */
    saveOutput(handleRequest: HandleRequest) {
        if (handleRequest.jovo!.constructor.name === 'GoogleAction') {
            const speech = handleRequest.jovo!.$response!.getSpeech()!.replace(/<\/?speak\/?>/g, '');
            let reprompt;
            if (handleRequest.jovo && handleRequest.jovo.$response && handleRequest.jovo.$response.getReprompt()) {
                reprompt = handleRequest.jovo.$response.getReprompt()!.replace(/<\/?speak\/?>/g, '');
            }
            const state = handleRequest.jovo!.getState() || '-';
            this.output = `\nspeech: ${speech} | reprompt: ${reprompt}\n`;
            this.output += `\nState: ${state} | `;
        }
    }


    /**
     * Called when the request gets to the `platform.nlu` middleware
     * @param handleRequest
     */
    log(handleRequest: HandleRequest) {
        if (handleRequest.jovo!.constructor.name === 'GoogleAction') {
            const intentName = handleRequest.jovo!.$request!.getIntentName();
            if (intentName === 'Default Fallback Intent') {
                this.output += ` Raw Text: ${handleRequest.jovo!.$request!.toJSON().queryResult.queryText}\n`;
                console.log(this.output);
                this.output = '';
            }
        }
    }
}

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
    new CustomLogging(),
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },
    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
    Unhandled() {
        this.tell('Unhandled');
    },
    END() {
        this.tell('Done');
    },
});

export {app};
