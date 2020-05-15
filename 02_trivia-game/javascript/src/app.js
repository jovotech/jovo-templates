'use strict';

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

// prettier-ignore
app.use(
  new Alexa(), 
  new GoogleAssistant(), 
  new JovoDebugger(), 
  new FileDb(),
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

const GAME_LENGTH = 5;
const ANSWER_COUNT = 4;

app.setHandler({
  LAUNCH() {
    this.$speech
      .t('NEW_GAME_MESSAGE', { gameName: this.t('GAME_NAME') })
      .t('WELCOME_MESSAGE', { gameLength: GAME_LENGTH });

    this.$reprompt.t('ASK_MESSAGE_START');

    this.followUpState('StartState').ask(this.$speech, this.$reprompt);
  },

  StartState: {
    StartGameIntent() {
      // Select questions.
      const translatedQuestions = this.t('QUESTIONS');
      const gameQuestions = populateGameQuestions(translatedQuestions);

      // Generate a random index for the correct answer.
      const correctAnswerIndex = Math.round(Math.random() * (ANSWER_COUNT - 1));

      // Select and shuffle the answers for each question
      const currentQuestionIndex = 0;
      const gameAnswers = populateGameAnswers(gameQuestions, currentQuestionIndex, correctAnswerIndex);

      const questionOutput = gameQuestions[currentQuestionIndex].question;

      this.$speech.t('TELL_QUESTION_MESSAGE', { questionIndex: '1', question: questionOutput });

      for (let i = 0; i < ANSWER_COUNT; i++) {
        this.$speech.addText(`${i + 1}. ${gameAnswers[i]}. `);
      }

      this.setSessionAttributes({
        correctAnswerText: gameAnswers[correctAnswerIndex],
        correctAnswerIndex: correctAnswerIndex + 1,
        currentQuestionIndex: currentQuestionIndex,
        gameQuestions: gameQuestions,
        questionReprompt: this.$speech.toString(),
        questionSpeech: this.$speech.toString(),
        score: 0,
      });

      this.followUpState('TriviaState').ask(this.$speech, this.$speech);
    },

    YesIntent() {
      return this.toStateIntent('StartState', 'StartGameIntent');
    },

    NoIntent() {
      this.$speech.t('NO_MESSAGE');
      this.tell(this.$speech);
    },

    Unhandled() {
      this.toStateIntent('HelpState', 'HelpIntent');
    },
  },

  TriviaState: {
    AnswerIntent() {
      handleUserGuess.call(this, false);
    },

    DontKnowIntent() {
      handleUserGuess.call(this, true);
    },

    RepeatIntent() {
      const { questionSpeech, questionReprompt } = this.$session.$data;
      this.ask(questionSpeech, questionReprompt);
    },

    HelpIntent() {
      this.$data.newGame = false;
      return this.toStateIntent('HelpState', 'HelpUser');
    },

    StopIntent() {
      this.$speech.t('STOP_MESSAGE');
      this.followUpState('HelpState').ask(this.$speech);
    },

    CancelIntent() {
      this.$speech.t('CANCEL_MESSAGE');
      this.tell(this.$speech);
    },

    Unhandled() {
      this.$speech.t('TRIVIA_UNHANDLED', { answerCount: ANSWER_COUNT });
      this.ask(this.$speech);
    },

    END() {
      // this.getEndReason() only works for Alexa Skills currently.
      if (this.isAlexaSkill()) {
        console.log('Session ended in TriviaState: ' + this.getEndReason());
      } else {
        console.log('Session ended in TriviaState');
      }
    },
  },

  HelpState: {
    HelpUser() {
      let askMessage = '';
      if (this.$data.newGame) {
        askMessage = this.t('ASK_MESSAGE_START');
      } else {
        askMessage = this.t('REPEAT_QUESTION_MESSAGE') + this.t('STOP_MESSAGE');
      }
      this.$speech.t('HELP_MESSAGE', { gameLength: GAME_LENGTH }).addText(askMessage);
      this.$reprompt.t('HELP_REPROMPT').addText(askMessage);

      this.ask(this.$speech, this.$reprompt);
    },

    'AMAZON.StartOverIntent'() {
      this.$data.newGame = false;
      return this.toStateIntent('StartState', 'StartGameIntent');
    },

    RepeatIntent() {
      this.$data.newGame = !(
        this.getSessionAttribute('questionSpeech') && this.getSessionAttribute('questionReprompt')
      );
      return this.toStateIntent('HelpState', 'HelpUser');
    },

    HelpIntent() {
      this.$data.newGame = !(
        this.getSessionAttribute('questionSpeech') && this.getSessionAttribute('questionReprompt')
      );
      return this.toStateIntent('HelpState', 'HelpUser');
    },

    YesIntent() {
      if (this.getSessionAttribute('questionSpeech') && this.getSessionAttribute('questionReprompt')) {
        return this.toStateIntent('TriviaState', 'RepeatIntent');
      } else {
        this.$data.newGame = false;
        return this.toStateIntent('StartState', 'StartGameIntent');
      }
    },

    NoIntent() {
      this.$speech.t('NO_MESSAGE');
      this.tell(this.$speech);
    },

    Unhandled() {
      this.toIntent('HelpIntent');
    },

    StopIntent() {
      this.$speech.t('STOP_MESSAGE');
      this.ask(this.$speech);
    },

    END() {
      // this.getEndReason() only works for Alexa Skills currently.
      if (this.isAlexaSkill()) {
        console.log('Session ended in HelpState: ' + this.getEndReason());
      } else {
        console.log('Session ended in HelpState');
      }
    },
  },
});

// =================================================================================
// Helper Functions
// =================================================================================

/**
 * Selects {GAME_LENGTH} (e.g. 5) questions from i18n file.
 * @param {object} translatedQuestions - Questions from the i18n file.
 * @return {object} Questions which will be used in the game.
 */
function populateGameQuestions(translatedQuestions) {
  // Create copy of questions array, so original does not get altered.
  const gameQuestions = [];

  if (translatedQuestions.length < GAME_LENGTH) {
    throw new Error('Invalid Game Length. Not enough questions!');
  }

  for (let i = 0; i < GAME_LENGTH; i++) {
    // Create a random index from 0 to the number of available questions.
    const rand = Math.round(Math.random() * (translatedQuestions.length - 1));
    // Push the randomly selected question to the final array.
    gameQuestions.push(translatedQuestions.splice(rand, 1)[0]);
  }

  return gameQuestions;
}

/**
 * Get the answers for a given question, and place the correct answer at the spot marked by {correctAnswerIndex}.
 * Note that you can have as many answers as you want but only {ANSWER_COUNT} answers will be selected.
 * @param {object} questions - Questions which will be used in the game.
 * @param {number} currentQuestionIndex - Index used to get the current question out of {questions}.
 * @param {number} correctAnswerIndex - Location used to determine the spot where the correct answer will be placed.
 * @return {object} The shuffled answers for the current question, with the correctAnswer on {shuffledAnswers[correctAnswerIndex]}.
 * */
function populateGameAnswers(questions, currentQuestionIndex, correctAnswerIndex) {
  // Copy answers from the current question to shuffle them freely.
  const answers = questions[currentQuestionIndex].answers.slice();
  const shuffledAnswers = [];

  if (answers.length < ANSWER_COUNT) {
    throw new Error('Not enough answers for question.');
  }

  // Shuffle the answers and push only {ANSWER_COUNT} answers to the final array.
  for (let i = 0; i < ANSWER_COUNT; i++) {
    let index;
    if (i === correctAnswerIndex) {
      // Set index to the first and therefore correct answer for the current question.
      index = 0;
    } else {
      // Set index to random number.
      index = Math.round(Math.random() * (answers.length - 1));
    }

    // Get answer using the previously calculated index.
    const answer = answers.splice(index, 1)[0];
    shuffledAnswers.push(answer);
  }

  return shuffledAnswers;
}

/**
 * Checks if the answer given is a valid number.
 * @param {object} answer - User input.
 * @return {boolean} If {answer} is valid or not.
 */
function isAnswerSlotValid(answer) {
  return parseInt(answer, 10) <= ANSWER_COUNT && parseInt(answer, 10) > 0;
}

/**
 * Handles the user guess, either if the user gave an answer or gave up on the current question.
 * @param {boolean} userGaveUp - Determines if the user provided an answer or not.
 */
function handleUserGuess(userGaveUp) {
  // Get answer from input. If answer is undefined (user did not gave one), provide a default invalid value.
  const answer = this.$inputs.answer ? this.$inputs.answer.value : -1;
  // Get session variables.
  let { gameQuestions, correctAnswerIndex, score, currentQuestionIndex, correctAnswerText } = this.$session.$data;

  if (!userGaveUp) {
    this.$speech.t('ANSWER_IS_MESSAGE');
  }

  // If the user provided the correct answer, increment the score and confirm.
  if (isAnswerSlotValid(answer) && parseInt(answer, 10) === correctAnswerIndex) {
    score++;
    this.$speech.t('ANSWER_CORRECT_MESSAGE');
  } else {
    if (!userGaveUp) {
      this.$speech.t('ANSWER_WRONG_MESSAGE');
    }

    this.$speech.t('CORRECT_ANSWER_MESSAGE', {
      correctAnswerIndex: correctAnswerIndex,
      correctAnswerText: correctAnswerText,
    });
  }

  if (currentQuestionIndex === GAME_LENGTH - 1) {
    this.$speech.t('GAME_OVER_MESSAGE', {
      score: score,
      gameLength: GAME_LENGTH,
    });

    this.tell(this.$speech);
  } else {
    // Initiate next round.
    currentQuestionIndex++;
    // Generate a random index for the correct answer.
    const correctAnswerIndex = Math.round(Math.random() * (ANSWER_COUNT - 1));

    const gameAnswers = populateGameAnswers(gameQuestions, currentQuestionIndex, correctAnswerIndex);
    const questionOutput = gameQuestions[currentQuestionIndex].question;

    this.$reprompt.t('TELL_QUESTION_MESSAGE', {
      questionIndex: currentQuestionIndex + 1,
      question: questionOutput,
    });

    for (let i = 0; i < ANSWER_COUNT; i++) {
      this.$reprompt.addText(`${i + 1}. ${gameAnswers[i]}. `);
    }

    this.$speech.t('SCORE_IS_MESSAGE', { score: score }).addText(this.$reprompt.toString());

    // Set session data for new attributes.
    this.setSessionAttributes({
      correctAnswerIndex: correctAnswerIndex + 1,
      correctAnswerText: gameAnswers[correctAnswerIndex],
      currentQuestionIndex: currentQuestionIndex,
      gameQuestions: gameQuestions,
      questionReprompt: this.$reprompt.toString(),
      questionSpeech: this.$reprompt.toString(),
      score: score,
    });

    this.followUpState('TriviaState').ask(this.$speech, this.$reprompt);
  }
}

module.exports = { app };
