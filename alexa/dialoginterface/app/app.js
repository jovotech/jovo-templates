'use strict';

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
        this.ask('Would you like to book a flight?');
    },
    'SearchFlightIntent': function(fromCity, toCity, date, count) {
        if (!this.alexaSkill().isDialogCompleted()) {
            this.alexaSkill().dialogDelegate();
        } else if (!this.alexaSkill().hasSlotValue('count')) {
            this.alexaSkill().dialogElicitSlot('count', 'How many tickets do you need?');
        } else if (this.alexaSkill().getIntentConfirmationStatus() !== 'CONFIRMED') {
            this.alexaSkill().dialogConfirmIntent(
                'So you are flying from ' + fromCity.value +
                ' to ' + toCity.value +
                ' on ' + date.value +
                ' and you need ' + count.value + ' tickets, right?'
            );
        } else if (this.alexaSkill().getIntentConfirmationStatus() === 'CONFIRMED') {
            let flightData = {
                fromCity: fromCity.value,
                toCity: toCity.value,
                date: date.value,
                count: count.value,
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
