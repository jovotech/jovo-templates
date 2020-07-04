'use strict';

const { App } = require('jovo-framework');
const { Autopilot } = require('jovo-platform-twilioautopilot');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
  new Autopilot(), 
  new JovoDebugger(), 
  new FileDb(),
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  LAUNCH() {
    return this.toIntent('HelloWorldIntent');
  },

  HelloWorldIntent() {
    return this.ask('Hi, how can I help you?');
  },

  OpeningHoursIntent() {
    return this.ask('We\'re open from 12 pm to 10 pm every day, except Sundays where we are open from 12 pm to 4 pm only.');
  },

  AddressIntent() {
    return this.ask('You can find us on Alexanderplatz 2, 10178 Berlin.');
  },

  RecommendationIntent() {
    return this.ask('Most people get a doner kebab with cucumber, tomatoes, lettuce, onion, red cabbage, peperoni, goat cheese, and yogurt sauce on top.');
  }
});

module.exports = { app };
