'use strict';

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

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
    const document = require(`./apl/main`);

    this.$alexaSkill.addDirective({
      type: 'Alexa.Presentation.APL.RenderDocument',
      version: '1.0',
      document: document, // Insert plain "Hello World" template.
      datasources: {},
    });
  },

  ShowTemplateIntent() {
    const template = this.$inputs.template;
    // Retrieve document and datasources from respective folder.
    const document = require(`./apl/${template.id}/document.json`);
    const dataSources = require(`./apl/${template.id}/data-sources.json`);

    this.$alexaSkill.addDirective({
      type: 'Alexa.Presentation.APL.RenderDocument',
      version: '1.0',
      document: document,
      datasources: dataSources,
    });
  },
});

module.exports = { app };
