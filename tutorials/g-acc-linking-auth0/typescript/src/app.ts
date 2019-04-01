import {App} from 'jovo-framework';
import {JovoDebugger} from 'jovo-plugin-debugger';
import {FileDb} from 'jovo-db-filedb';
import {GoogleAssistant} from 'jovo-platform-googleassistant';
import * as rp from 'request-promise';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------
const app = new App();

app.use(
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    async LAUNCH() {
        if (!this.$request!.getAccessToken()) {
            this.showAccountLinkingCard();
        } else {
            this.tell('You are already logged in!');
        }
    },
    async ON_SIGN_IN() {
        if (this.$googleAction && this.$googleAction.getSignInStatus() === 'OK') {
            const token = this.$request!.getAccessToken();
            const options = {
                method: 'GET',
                uri: 'https://jovo-blog.auth0.com/userinfo', // You can find your URL on Client --> Settings --> 
                // Advanced Settings --> Endpoints --> OAuth User Info URL
                headers: {
                    authorization: 'Bearer ' + token,
                }
            };

            await rp(options).then((body: string) => {
                const data = JSON.parse(body);
                /*
                To see how the user data was stored,
                go to Auth -> Users -> Click on the user you authenticated earlier -> Raw JSON
                */
                this.tell(data.name + ', ' + data.email); // Output: Kaan Kilic, email@jovo.tech
            });
        } else {
            this.tell('There was an error. We could not sign in you in.');
        }
    }
});


export {app};
