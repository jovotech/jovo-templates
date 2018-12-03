
const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();
Util.consoleLog();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);

app.setHandler({
    LAUNCH() {
        this.$alexaSkill.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.0',
            document: require(`./apl/main.json`), // Plain "Hello World" template
            datasources: {},
        })
    },
    ShowTemplateIntent() {
        let template = this.getInput('template');

        // Retrieve document and data from folder
        this.$alexaSkill.addDirective({
              type: 'Alexa.Presentation.APL.RenderDocument',
              version: '1.0',
              document: require(`./apl/${template.id}/document.json`),
              datasources: require(`./apl/${template.id}/data-sources.json`),
        });
    }
});


module.exports.app = app;
