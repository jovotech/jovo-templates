
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
        if (!this.$alexaSkill.$dialog.isCompleted()) {
            this.$alexaSkill.$dialog.delegate();
        } else if (!this.$inputs.ticketCount.value) {
            this.$alexaSkill.$dialog.elicitSlot('ticketCount', 'How many tickets do you need?', 'How many tickets do you need?');
        } else if (this.$alexaSkill.$dialog.getIntentConfirmationStatus() !== 'CONFIRMED') {
            let speech = `So you are flying from ${this.$inputs.fromCity.value} to ${this.$inputs.toCity.value} on ${this.$inputs.date.value} and you need ${this.$inputs.ticketCount.value} tickets, right?`;
            let reprompt = speech;
            this.$alexaSkill.$dialog.confirmIntent(speech, reprompt);
        } else if (this.$alexaSkill.$dialog.getIntentConfirmationStatus() === 'CONFIRMED') {
            let flightData = {
                fromCity: this.$inputs.fromCity.value,
                toCity: this.$inputs.toCity.value,
                date: this.$inputs.date.value,
                ticketCount: this.$inputs.ticketCount.value,
            };
            this.$data.flightData = flightData;
            this.toIntent('FlightApiIntent');
        }
    },
    FlightApiIntent() {
        let flightData = this.$data.flightData;
        console.log(flightData);
        this.tell('Your flight is booked, thanks!');
    },
});


module.exports.app = app;
