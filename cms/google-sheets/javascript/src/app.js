'use strict';

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { GoogleSheetsCMS } = require('jovo-cms-googlesheets');

console.log('This template uses an outdated version of the Jovo Framework. We strongly recommend upgrading to Jovo v4. Learn more here: https://www.jovo.tech/docs/migration-from-v3');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
  new Alexa(), 
  new GoogleAssistant(), 
  new JovoDebugger(), 
  new FileDb(), 
  new GoogleSheetsCMS(),
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  LAUNCH() {
    this.$user.$data.index = 0;
    this.$user.$data.currentPoints = 0;
    console.log(this.$cms.responses);
    console.log(this.$cms.answers);
    this.$speech.addAudio(this.t('SOUND.INTRO'));
    this.$speech.addText(this.t('WELCOME'));
    askQuestion(this);
  },

  NEW_USER() {
    this.$user.$data = {
      index: 0,
      totalPoints: 0,
      currentPoints: 0,
    };
  },

  TrueOrFalseIntent() {
    const input = this.$inputs.answer.id;
    const answer = parseBoolean(input);
    console.log(`input answer:   ${answer}`);
    const correctAnswerStr = this.$cms.answers[`STATEMENT_${this.$user.$data.index}`]; // get answer as string
    const correctAnswer = parseBoolean(correctAnswerStr);
    console.log(`correct answer: ${correctAnswer}`);
    if (answer === correctAnswer) {
      this.$user.$data.currentPoints++;
      this.$speech.addAudio(this.t('SOUND.CORRECT'));
    } else {
      this.$user.$data.currentPoints--;
      this.$speech.addAudio(this.t('SOUND.INCORRECT'));
      this.$speech.addText(
        this.t('INCORRECT', {
          correctAnswer: correctAnswer,
        })
      );
    }
    this.$user.$data.index++;
    askQuestion(this);
  },

  Unhandled() {
    this.$reprompt.addText(this.t('REPROMPT'));
    this.ask(this.$reprompt, this.$reprompt);
  },

  END() {
    this.tell(this.t('GOODBYE'));
  },
});

function askQuestion(jovo) {
  const index = jovo.$user.$data.index;
  console.log(`index: ${index}`);
  const currentStatement = jovo.t(`STATEMENT_${index}`);
  if (currentStatement.includes('STATEMENT')) {
    // no value found, end of list
    console.log(`end`);
    jovo.$user.$data.totalPoints += jovo.$user.$data.currentPoints; // count total points
    jovo.$speech.addAudio(jovo.t('SOUND.OUTRO'));
    jovo.$speech.addText(
      jovo.t('END', {
        currentPoints: jovo.$user.$data.currentPoints,
        totalPoints: jovo.$user.$data.totalPoints,
      })
    );
    jovo.tell(jovo.$speech);
    return;
  }
  jovo.$speech.addAudio(jovo.t('SOUND.FORWARD'));
  jovo.$speech.addText(
    jovo.t('QUESTION', {
      statement: currentStatement,
    })
  );
  jovo.$reprompt.addText(jovo.t('REPROMPT'));
  jovo.ask(jovo.$speech, jovo.$reprompt);
}

function parseBoolean(string) {
  switch (string.trim().toLowerCase()) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return false;
  }
}

module.exports = { app };
