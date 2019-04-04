import {App} from 'jovo-framework';
import {Alexa} from 'jovo-platform-alexa';
import {JovoDebugger} from 'jovo-plugin-debugger';
import {FileDb} from 'jovo-db-filedb';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        if (this.isAlexaSkill()) {
            this.$alexaSkill!.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: require(`alexa/apl/javascript/src/apl/main`), // Plain "Hello World" template
                datasources: {},
            });
        }
    },
    ShowTemplateIntent() {
        let template = this.$inputs.template;

        if (this.isAlexaSkill()) {
            // Retrieve document and data from folder
            this.$alexaSkill!.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: require(`./apl/${template.id}/document.json`),
                datasources: require(`./apl/${template.id}/data-sources.json`),
            });
        }
    },
});


export {app};
