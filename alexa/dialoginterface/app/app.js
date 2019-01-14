'use strict';

console.log('This template uses an outdated version of the Jovo Framework. Please update your Jovo CLI to the latest version. Learn more here: https://www.jovo.tech/docs/installation/v1-migration');

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.ask('Where are you flying to?');
    },
    'SearchFlightIntent': function(fromCity, toCity, date, ticketCount) {
        if (!this.alexaSkill().isDialogCompleted()) {
            this.alexaSkill().dialogDelegate();
        } else if (!this.alexaSkill().hasSlotValue('ticketCount')) {
            this.alexaSkill().dialogElicitSlot('ticketCount', 'How many tickets do you need?');
        } else if (this.alexaSkill().getIntentConfirmationStatus() !== 'CONFIRMED') {
            this.alexaSkill().dialogConfirmIntent(
                'So you are flying from ' + fromCity.value +
                ' to ' + toCity.value +
                ' on ' + date.value +
                ' and you need ' + ticketCount.value + ' tickets, right?'
            );
        } else if (this.alexaSkill().getIntentConfirmationStatus() === 'CONFIRMED') {
            let flightData = {
                fromCity: fromCity.value,
                toCity: toCity.value,
                date: date.value,
                ticketCount: ticketCount.value,
            };
            this.toIntent('FlightApiIntent', flightData);
        }
    },
    'FlightApiIntent': function(flightData) {
        console.log(flightData);
        this.tell('Your flight is booked, thanks!');
    },
});

module.exports.app = app;
