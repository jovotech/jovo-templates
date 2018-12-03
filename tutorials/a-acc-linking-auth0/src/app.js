
const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const rp = require('request-promise');

const app = new App();
Util.consoleLog();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);

app.setHandler({
    async LAUNCH() {
        if (!this.$request.session.user.accessToken) {
            this.showAccountLinkingCard();
            this.tell('Please link you Account');
        } else {
            let token = this.$request.session.user.accessToken;
            let options = {
                method: 'GET',
                uri: 'https://jovo-blog.auth0.com/userinfo', // You can find your URL on Client --> Settings --> 
                // Advanced Settings --> Endpoints --> OAuth User Info URL
                headers: {
                    authorization: 'Bearer ' + token,
                }
            };

            await rp(options).then((body) => {
                let data = JSON.parse(body);
                /*
                To see how the user data was stored,
                go to Auth -> Users -> Click on the user you authenticated earlier -> Raw JSON
                */
                this.tell(data.name + ', ' + data.email); // Output: Kaan Kilic, email@jovo.tech
            });
        }
    },
});


module.exports.app = app;
