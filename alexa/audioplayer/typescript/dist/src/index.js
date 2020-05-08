"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const jovo_framework_1 = require("jovo-framework");
// ------------------------------------------------------------------
// HOST CONFIGURATION
// ------------------------------------------------------------------
// ExpressJS (Jovo Webhook)
if (process.argv.indexOf('--webhook') > -1) {
    const port = process.env.JOVO_PORT || 3000;
    jovo_framework_1.Webhook.jovoApp = app_1.app;
    jovo_framework_1.Webhook.listen(port, () => {
        console.info(`Local server listening on port ${port}.`);
    });
    jovo_framework_1.Webhook.post('/webhook', async (req, res) => {
        await app_1.app.handle(new jovo_framework_1.ExpressJS(req, res));
    });
}
// AWS Lambda
exports.handler = async (event, context, callback) => {
    await app_1.app.handle(new jovo_framework_1.Lambda(event, context, callback));
};
//# sourceMappingURL=index.js.map