
const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);

app.setHandler({
    LAUNCH() {
        this.ask('Where are you flying to?', 'Where are you flying to?');
    },
    SearchFlightIntent() {
        console.log(this.$inputs);
        if (!this.$alexaSkill.$dialog.isCompleted()) {
            this.$alexaSkill.$dialog.delegate();
        } else if (!this.$inputs.ticketCount.value) {
            this.$alexaSkill.$dialog.elicitSlot('ticketCount', 'How many tickets do you need?');
        } else if (this.$alexaSkill.$dialog.getIntentConfirmationStatus() !== 'CONFIRMED') {
            let speech = `So you are flying from ${this.$inputs.fromCity.value} to ${this.$inputs.toCity.value}
                        on ${this.$inputs.date.value} and you need ${this.$inputs.ticketCount.value} tickets, right?`;
            this.$alexaSkill.$dialog.confirmIntent(speech, speech);
        } else if (this.$alexaSkill.$dialog.getIntentConfirmationStatus() === 'CONFIRMED') {
            let flightData = {
                fromCity: this.$inputs.fromCity.value,
                toCity: this.$inputs.toCity.value,
                date: this.$inputs.date.value,
                ticketCount: this.$inputs.ticketCount.value,
            };
            this.toIntent('FlightApiIntent', flightData);
        }
    },
    FlightApiIntent(flightData) {
        console.log(flightData);
        this.tell('Your flight is booked, thanks!');
    },
});


module.exports.app = app;
