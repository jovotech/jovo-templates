"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const jovo_platform_alexa_1 = require("jovo-platform-alexa");
const jovo_plugin_debugger_1 = require("jovo-plugin-debugger");
const jovo_db_filedb_1 = require("jovo-db-filedb");
// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------
const app = new jovo_framework_1.App();
exports.app = app;
app.use(new jovo_platform_alexa_1.Alexa(), new jovo_plugin_debugger_1.JovoDebugger(), new jovo_db_filedb_1.FileDb());
// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------
app.setHandler({
    LAUNCH() {
        const document = require('./apl/main.json');
        this.$alexaSkill.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.0',
            document: document,
            datasources: {},
        });
    },
    ShowTemplateIntent() {
        // ToDo: IDs not working in Jovo Debugger?
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
//# sourceMappingURL=app.js.map