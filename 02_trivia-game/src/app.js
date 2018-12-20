'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

const GAME_LENGTH = 5;
const ANSWER_COUNT = 4;

app.setHandler({
    LAUNCH() {
        this.$speech
            .t('NEW_GAME_MESSAGE', {gameName: this.t('GAME_NAME')})
            .t('WELCOME_MESSAGE', {gameLength: GAME_LENGTH.toString()});
        this.followUpState('StartState').ask(this.$speech, this.$speech);
    },
    HelloWorldIntent() {
        this.tell('hello world!');
    },
    StartState: {
        StartGameIntent() {
            // Select questions
            const translatedQuestions = this.t('QUESTIONS');
            const gameQuestions = populateGameQuestions(translatedQuestions);

            // Generate a random index for the correct answer, from 0 to 3
            const correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));

            // Select and shuffle the answers for each question
            const roundAnswers = populateRoundAnswers(gameQuestions, 0, correctAnswerIndex, translatedQuestions);
            const currentQuestionIndex = 0;
            const spokenQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];

            this.$speech.t('TELL_QUESTION_MESSAGE', {questionNumber: '1', question: spokenQuestion});

            for (let i = 0; i < ANSWER_COUNT; i++) {
                this.$speech.addText(`${i + 1}. ${roundAnswers[i]}. `);
            }

            this.setSessionAttributes({
                questionSpeech: this.$speech.toString(),
                questionReprompt: this.$speech.toString(),
                currentQuestionIndex: currentQuestionIndex,
                correctAnswerIndex: correctAnswerIndex + 1,
                questions: gameQuestions,
                score: 0,
                correctAnswerText: translatedQuestions[gameQuestions[currentQuestionIndex]][Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0]][0],
            });

            this.followUpState('TriviaState').ask(this.$speech, this.$speech);
        },
        YesIntent() {
            this.toStateIntent('StartState', 'StartGameIntent');
        },
        NoIntent() {
            this.$speech.t('NO_MESSAGE')
            this.tell(this.$speech);
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
            this.$speech = this.getSessionAttribute('questionSpeech');
            this.$reprompt = this.getSessionAttribute('questionReprompt');
            this.ask(this.$speech, this.$reprompt);
        },
        HelpIntent() {
            this.toStateIntent('HelpState', 'HelpUser', false);
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
            this.$speech.t('TRIVIA_UNHANDLED', {answerCount: ANSWER_COUNT.toString()});
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
        HelpUser(newGame) {
            let askMessage = '';
            if (newGame) {
                askMessage = this.t('ASK_MESSAGE_START');
            } else {
                askMessage = this.t('REPEAT_QUESTION_MESSAGE') + this.t('STOP_MESSAGE');
            }
            this.$speech
                .t('HELP_MESSAGE', {gameLength: GAME_LENGTH})
                .addText(askMessage);
            this.$reprompt
                .t('HELP_REPROMPT')
                .addText(askMessage);

            this.ask(this.$speech, this.$reprompt);
        },
        'AMAZON.StartOverIntent'() {
            this.toStateIntent('StartState', 'StartGameIntent', false);
        },
        RepeatIntent() {
            let newGame = !(this.getSessionAttribute('questionSpeech') && this.getSessionAttribute('questionReprompt'));
            this.toStateIntent('HelpState', 'HelpUser', newGame);
        },
        HelpIntent() {
            let newGame = !(this.getSessionAttribute('questionSpeech') && this.getSessionAttribute('questionReprompt'));
            this.toStateIntent('HelpState', 'HelpUser', newGame);
        },
        YesIntent() {
            if (this.getSessionAttribute('questionSpeech') && this.getSessionAttribute('questionReprompt')) {
                this.toStateIntent('TriviaState', 'RepeatIntent');
            } else {
                this.toStateIntent('StartState', 'StartGameIntent', false);
            }
        },
        NoIntent() {
            this.$speech.t('NO_MESSAGE')
            this.tell(this.$speech);
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
// Helper
// =================================================================================

/**
 * Selects 5 (GAME_LENGTH) questions from i18n file.
 * @param {object} translatedQuestions questions from the i18n file
 * @return {object} gameQuestions questions which will be used in the game
 */
function populateGameQuestions(translatedQuestions) {
    const gameQuestions = [];
    const indexList = [];

    let index = translatedQuestions.length;

    if (GAME_LENGTH > index) {
        throw new Error('Invalid Game Length. Not enough questions');
    }
    for (let i = 0; i < translatedQuestions.length; i++) {
        indexList.push(i);
    }

    for (let j = 0; j < GAME_LENGTH; j++) {
        const rand = Math.floor(Math.random() * index);
        index--;

        const temp = indexList[index];
        indexList[index] = indexList[rand];
        indexList[rand] = temp;
        gameQuestions.push(indexList[index]);
    }
    return gameQuestions;
}

/**
 * Get the answers for a given question, and place the correct answer at the spot marked by the
 * correctAnswerTargetLocation variable. Note that you can have as many answers as you want but
 * only ANSWER_COUNT will be selected.
 * @param {object} gameQuestionIndexes questions which will be used in the game
 * @param {number} correctAnswerIndex current spot of the correct answer
 * @param {number} correctAnswerTargetLocation used to determine future spot of the correct answer
 * @param {object} translatedQuestions questions from the i18n file
 * @return {object}
 * */
function populateRoundAnswers(gameQuestionIndexes, correctAnswerIndex, correctAnswerTargetLocation, translatedQuestions) {
    const answers = [];
    const answersCopy = translatedQuestions[gameQuestionIndexes[correctAnswerIndex]][Object.keys(translatedQuestions[gameQuestionIndexes[correctAnswerIndex]])[0]].slice();
    let index = answersCopy.length;

    if (index < ANSWER_COUNT) {
        throw new Error('Not enough answers for question.');
    }

    // Shuffle the answers, excluding the first element which is the correct answer.
    for (let j = 1; j < answersCopy.length; j++) {
        const rand = Math.floor(Math.random() * (index - 1)) + 1;
        index -= 1;
        const swapTemp1 = answersCopy[index];
        answersCopy[index] = answersCopy[rand];
        answersCopy[rand] = swapTemp1;
    }

    // Swap the correct answer into the target location
    for (let i = 0; i < ANSWER_COUNT; i++) {
        answers[i] = answersCopy[i];
    }
    const swapTemp2 = answers[0];
    answers[0] = answers[correctAnswerTargetLocation];
    answers[correctAnswerTargetLocation] = swapTemp2;
    return answers;
}

/**
 * @param {object} answer user input
 * @return {boolean}
 */
function isAnswerSlotValid(answer) {
    if (answer) {
        return !isNaN(parseInt(answer.value, 10)) && parseInt(answer.value, 10) < (ANSWER_COUNT + 1) && parseInt(answer.value, 10) > 0;
    } else {
        return false;
    }
}

/**
 * @param {boolean} userGaveUp
 */
function handleUserGuess(userGaveUp) {
    let answer = this.$inputs.answer;
    console.log('handleUserGuess');
    console.log('inputs: ' + answer);
    const answerSlotValid = isAnswerSlotValid(answer);
    console.log('answerSlotValid: ' + answerSlotValid);
    const speechOutputAnalysis = this.getSpeechBuilder();
    const gameQuestions = this.getSessionAttribute('questions');
    let correctAnswerIndex = this.getSessionAttribute('correctAnswerIndex');
    let currentScore = this.getSessionAttribute('score');
    let currentQuestionIndex = this.getSessionAttribute('currentQuestionIndex');
    const correctAnswerText = this.getSessionAttribute('correctAnswerText');
    const translatedQuestions = this.t('QUESTIONS');

    if (answerSlotValid && parseInt(this.$inputs.answer.value, 10) === correctAnswerIndex) {
        currentScore++;
        speechOutputAnalysis.t('ANSWER_CORRECT_MESSAGE');
    } else {
        if (!userGaveUp) {
            speechOutputAnalysis.t('ANSWER_WRONG_MESSAGE');
        }

        speechOutputAnalysis.t('CORRECT_ANSWER_MESSAGE', {correctAnswerIndex: correctAnswerIndex, correctAnswerText: correctAnswerText});
    }

    if (this.getSessionAttribute('currentQuestionIndex') === GAME_LENGTH - 1) {
        this.$speech
            .addText(userGaveUp ? '' : this.t('ANSWER_IS_MESSAGE'))
            .addText(speechOutputAnalysis.toString())
            .t('GAME_OVER_MESSAGE', {currentScore: currentScore.toString(), gameLength: GAME_LENGTH.toString()});

        this.tell(this.$speech);
    } else {
        currentQuestionIndex += 1;
        correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
        const spokenQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];
        const roundAnswers = populateRoundAnswers.call(this, gameQuestions, currentQuestionIndex, correctAnswerIndex, translatedQuestions);
        const questionIndexForSpeech = currentQuestionIndex + 1;
        this.$reprompt
            .t('TELL_QUESTION_MESSAGE', {questionNumber: questionIndexForSpeech.toString(), question: spokenQuestion});

        for (let i = 0; i < ANSWER_COUNT; i++) {
            this.$reprompt.addText(`${i + 1}. ${roundAnswers[i]}. `);
        }

        this.$speech
            .addText(userGaveUp ? '' : this.t('ANSWER_IS_MESSAGE'))
            .addText(speechOutputAnalysis.toString())
            .t('SCORE_IS_MESSAGE', {currentScore: currentScore.toString()})
            .addText(this.$reprompt.toString());

        this.setSessionAttributes({
            questionSpeech: this.$reprompt.toString(),
            questionReprompt: this.$reprompt.toString(),
            currentQuestionIndex: currentQuestionIndex,
            correctAnswerIndex: correctAnswerIndex + 1,
            questions: gameQuestions,
            score: currentScore,
            correctAnswerText: translatedQuestions[gameQuestions[currentQuestionIndex]][Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0]][0],
        });
        this.followUpState('TriviaState').ask(this.$speech, this.$reprompt);
    }
}

module.exports.app = app;
