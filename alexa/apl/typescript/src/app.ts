import {App} from 'jovo-framework';
import {Alexa} from 'jovo-platform-alexa';
import {JovoDebugger} from 'jovo-plugin-debugger';
import {FileDb} from 'jovo-db-filedb';
import {main} from './apl';
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
                document: main, // Plain "Hello World" template
                datasources: {},
            });
        }
    },
    ShowTemplateIntent() {
        const template = this.$inputs.template;

        if (this.isAlexaSkill()) {
            // Retrieve document and data from folder
            this.$alexaSkill!.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                // document: require(`./apl/${template.id}/document.json`),
                document: () => import(`./apl/${template.id}/document.json`),
                // datasources: require(`./apl/${template.id}/data-sources.json`),
                datasources: () => import(`./apl/${template.id}/data-sources.json`),
            });
        }
    },
});


export {app};
