'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.alexaSkill().addDirective({
              type: 'Alexa.Presentation.APL.RenderDocument',
              version: '1.0',
              document: require(`./apl/main.json`), // Plain "Hello World" template
              datasources: {},
        });

        this.ask('What template would you like to see?');
    },

    'ShowTemplateIntent': function() {
        let template = this.getInput('template');

        // Retrieve document and data from folder
        this.alexaSkill().addDirective({
              type: 'Alexa.Presentation.APL.RenderDocument',
              version: '1.0',
              document: require(`./apl/${template.id}/document.json`),
              datasources: require(`./apl/${template.id}/data-sources.json`),
        });

        this.tell(`Showing ${template.value}.`);
    },
});

module.exports.app = app;
