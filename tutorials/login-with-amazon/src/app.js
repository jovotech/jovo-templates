
const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const rp = require('request-promise');

const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);

app.setHandler({
    async LAUNCH() {
        if (!this.$request.getAccessToken()) {
            this.showAccountLinkingCard();
            this.tell('Please link your Account');
        } else {
            let url = `https://api.amazon.com/user/profile?access_token=${this.$request.getAccessToken()}`;

            await rp(url).then((body) => {
                let data = JSON.parse(body);
                /*
                * Depending on your scope you have access to the following data:
                * data.user_id : "amzn1.account.XXXXYYYYZZZ"
                * data.email : "email@jovo.tech"
                * data.name : "Kaan Kilic"
                * data.postal_code : "12345"
                */
                this.tell(data.name + ', ' + data.email); // Output: Kaan Kilic, email@jovo.tech
            });
        }
    },
});


module.exports.app = app;
