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
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        this.ask("Hello World! What's your name?", 'Please tell me your name.');
    },
    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});
//# sourceMappingURL=app.js.map