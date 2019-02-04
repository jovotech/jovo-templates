'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { GoogleSheetsCMS } = require('jovo-cms-googlesheets');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
    new GoogleSheetsCMS()
);

const NAME_INDEX = 0;
const LOCATION_INDEX = 1;
const DATE_INDEX = 2;

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        this.$session.$data.eventIndex = 1;
        return this.toIntent('EventInfoIntent');
    },

    EventInfoIntent() {
        let eventIndex = this.$session.$data.eventIndex;

        const name = this.$cms.events[eventIndex][NAME_INDEX];
        const location = this.$cms.events[eventIndex][LOCATION_INDEX];
        const date = this.$cms.events[eventIndex][DATE_INDEX];

        this.$speech.t('event.information', {name, location, date});

        eventIndex++;

        if (eventIndex === this.$cms.events.length) {
            // No event left in the sheet. End session
            this.$speech.t('last.event');
            this.tell(this.$speech);
        } else {
            this.$session.$data.eventIndex = eventIndex;
            // Events left. Ask, if user wants to hear more about next event
            this.$speech.t('next.event');
            this.ask(this.$speech);
        }
    },

    YesIntent() {
        return this.toIntent('EventInfoIntent');
    },

    NoIntent() {
        return this.toIntent('END');
    },

    END() {
        this.tell(this.t('end'));
    }
});

module.exports.app = app;
