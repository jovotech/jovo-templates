// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------
import {App} from 'jovo-framework';
import {Alexa} from 'jovo-platform-alexa';
import {JovoDebugger} from 'jovo-plugin-debugger';
import {FileDb} from 'jovo-db-filedb';

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
        this.ask('Where are you flying to?', 'Where are you flying to?');
    },
    SearchFlightIntent() {
        if (this.$alexaSkill && this.$alexaSkill.$dialog) {
            if (!this.$alexaSkill.$dialog.isCompleted()) {
                return this.$alexaSkill.$dialog.delegate();
            } else if (!this.$inputs.ticketCount.value) {
                return this.$alexaSkill.$dialog.elicitSlot('ticketCount', 'How many tickets do you need?', 'How many tickets do you need?');
            } else if (this.$alexaSkill.$dialog.getIntentConfirmationStatus() !== 'CONFIRMED') {
                let speech = `So you are flying from ${this.$inputs.fromCity.value} to ${this.$inputs.toCity.value} on ${this.$inputs.date.value} and you need ${this.$inputs.ticketCount.value} tickets, right?`;
                return this.$alexaSkill.$dialog.confirmIntent(speech, speech);
            } else if (this.$alexaSkill.$dialog.getIntentConfirmationStatus() === 'CONFIRMED') {
                this.$data.flightData = {
                    fromCity: this.$inputs.fromCity.value,
                    toCity: this.$inputs.toCity.value,
                    date: this.$inputs.date.value,
                    ticketCount: this.$inputs.ticketCount.value,
                };
                return this.toIntent('FlightApiIntent');
            }
        }
        return;
    },
    FlightApiIntent() {
        let flightData = this.$data.flightData;
        console.log(flightData);
        this.tell('Your flight is booked, thanks!');
    },
});


export {app};
