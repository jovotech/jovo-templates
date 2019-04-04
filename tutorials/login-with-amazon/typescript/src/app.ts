import {App} from 'jovo-framework';
import {Alexa} from 'jovo-platform-alexa';
import {JovoDebugger} from 'jovo-plugin-debugger';
import {FileDb} from 'jovo-db-filedb';
import * as rp from 'request-promise';

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
    async LAUNCH() {
        if (!this.$request!.getAccessToken()) {
            this.showAccountLinkingCard();
            this.tell('Please link your Account');
        } else {
            const url = `https://api.amazon.com/user/profile?access_token=${this.$request!.getAccessToken()}`;

            await rp(url).then((body: string) => {
                const data = JSON.parse(body);
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


export {app};
