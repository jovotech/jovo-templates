'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const GAME_LENGTH = 5;
const ANSWER_COUNT = 4;

const config = {
    logging: true,
    intentMap: {
        'AMAZON.YesIntent': 'YesIntent',
        'AMAZON.NoIntent': 'NoIntent',
        'AMAZON.RepeatIntent': 'RepeatIntent',
        'AMAZON.StopIntent': 'StopIntent',
        'AMAZON.HelpIntent': 'HelpIntent',
        'AMAZON.CancelIntent': 'CancelIntent',
    }
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        let speechOutput = "";
        speechOutput += this.t('NEW_GAME_MESSAGE', this.t('GAME_NAME')) + this.t('WELCOME_MESSAGE', GAME_LENGTH.toString());
        this.followUpState('StartState').ask(speechOutput);
    },
    'StartState': {
        'StartGameIntent': function(){
            let speechOutput = "";
            // Select questions
            const translatedQuestions = this.t('QUESTIONS');
            const gameQuestions = populateGameQuestions(translatedQuestions);
            // Generate a random index for the correct answer, from 0 to 3
            const correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
            // Select and shuffle the answers for each question
            const roundAnswers = populateRoundAnswers(gameQuestions, 0, correctAnswerIndex, translatedQuestions);
            const currentQuestionIndex = 0;
            const spokenQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];
            let repromptText = this.t('TELL_QUESTION_MESSAGE', '1', spokenQuestion);

            for (let i = 0; i < ANSWER_COUNT; i++){
                repromptText += `${i + 1}. ${roundAnswers[i]}. `;
            }

            speechOutput += repromptText;

            this.setSessionAttributes({
                questionSpeech: speechOutput,
                questionReprompt: repromptText,
                currentQuestionIndex: currentQuestionIndex, 
                correctAnswerIndex: correctAnswerIndex + 1,
                questions: gameQuestions,
                score: 0,
                correctAnswerText: translatedQuestions[gameQuestions[currentQuestionIndex]][Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0]][0]
            });

            this.followUpState('TriviaState').ask(speechOutput, repromptText);
        },
        'YesIntent': function() {
            this.toStateIntent('StartState', 'StartGameIntent');
        },
        'NoIntent': function() {
            this.tell(this.t('NO_MESSAGE'));
        }
    },
    'TriviaState': {
        'AnswerIntent': function() {
            handleUserGuess.call(this, false);
        },
        'DontKnowIntent': function() {
            handleUserGuess.call(this, true);
        },
        'AMAZON.StartOverIntent': function() {
            this.toStateIntent('StartState', 'StartGameIntent', false);
        },
        'RepeatIntent': function() {
            this.ask(this.getSessionAttribute('questionSpeech'), this.getSessionAttribute('questionReprompt'));
        },
        'HelpIntent': function() {
            this.toStateIntent('HelpState', 'HelpUser', false);
        },
        'StopIntent': function() {
            this.followUpState('HelpState').ask(this.t('STOP_MESSAGE'), this.t('STOP_MESSAGE'));
        },
        'CancelIntent': function() {
            this.tell(this.t('CANCEL_MESSAGE'));
        },
        'Unhandled': function() {
            let speechOutput = this.t('TRIVIA_UNHANDLED', ANSWER_COUNT.toString());
            this.ask(speechOutput, speechOutput);
        },
        'END': function() {
            // this.getEndReason() only works for Alexa Skills currently. 
            if (this.isAlexaSkill()){
                console.log('Session ended in TriviaState: ' + this.getEndReason());
            }
            else{
                console.log('Session ended in TriviaState');
            }
            this.endSession();
        }
    },
    'HelpState': {
        'HelpUser': function(newGame) {
            let askMessage = "";
            if (newGame){
                askMessage = this.t('ASK_MESSAGE_START');
            }
            else{
                askMessage = this.t('REPEAT_QUESTION_MESSAGE') + this.t('STOP_MESSAGE');
            }
            let speechOutput = this.t('HELP_MESSAGE', GAME_LENGTH) + askMessage;
            let repromptText = this.t('HELP_REPROMPT') + askMessage;
            this.ask(speechOutput, repromptText);
        },
        'AMAZON.StartOverIntent': function() {
            this.toStateIntent('StartState', 'StartGameIntent', false);
        },
        'RepeatIntent': function() {
            let newGame = !(this.getSessionAttribute('questionSpeech') && this.getSessionAttribute('questionReprompt'));
            this.toStateIntent('HelpState', 'HelpUser', newGame);
        },
        'HelpIntent': function() {
            let newGame = !(this.getSessionAttribute('questionSpeech') && this.getSessionAttribute('questionReprompt'));
            this.toStateIntent('HelpState', 'HelpUser', newGame);
        },
        'YesIntent': function() {
            if (this.getSessionAttribute('questionSpeech') && this.getSessionAttribute('questionReprompt')) {
                this.toStateIntent('TriviaState', 'RepeatIntent');
            }
            else {
                this.toStateIntent('StartState', 'StartGameIntent', false)
            }
        },
        'NoIntent': function() {
            this.tell(this.t('NO_MESSAGE'));
        },
        'StopIntent': function() {
            let speechOutput = this.t('STOP_MESSAGE');
            this.ask(speechOutput, speechOutput);
        },
        'END': function() {
            // this.getEndReason() only works for Alexa Skills currently. 
            if (this.isAlexaSkill()){
                console.log('Session ended in HelpState: ' + this.getEndReason());
            }
            else{
                console.log('Session ended in HelpState');
            }
            this.endSession();
        }
    }
});

// =================================================================================
// Helper
// =================================================================================

function populateGameQuestions(translatedQuestions) {
    const gameQuestions = [];
    const indexList = [];

    let index = translatedQuestions.length;

    if (GAME_LENGTH > index){
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
        console.log(rand);
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

function isAnswerSlotValid(answer){
    console.log(answer.value);
    console.log(parseInt(answer.value));
    if (answer.value){
        return !isNaN(parseInt(answer.value, 10)) && parseInt(answer.value, 10) < (ANSWER_COUNT + 1) && parseInt(answer.value, 10) > 0;
    }
}

function handleUserGuess(userGaveUp){
    const answerSlotValid = isAnswerSlotValid(this.getInput('answer'));
    let speechOutput = '';
    let speechOutputAnalysis = '';
    const gameQuestions = this.getSessionAttribute('questions');
    let correctAnswerIndex = parseInt(this.getSessionAttribute('correctAnswerIndex'), 10);
    let currentScore = parseInt(this.getSessionAttribute('score'), 10);
    let currentQuestionIndex = parseInt(this.getSessionAttribute('currentQuestionIndex'), 10);
    const correctAnswerText = this.getSessionAttribute('correctAnswerText');
    const translatedQuestions = this.t('QUESTIONS');
    console.log(answerSlotValid);
    if (answerSlotValid && parseInt(this.getInput('answer').value, 10) === this.getSessionAttribute('correctAnswerIndex')){
        currentScore++;
        speechOutputAnalysis = this.t('ANSWER_CORRECT_MESSAGE');
    }
    else {
        if (!userGaveUp){
            speechOutputAnalysis = this.t('ANSWER_WRONG_MESSAGE');
        }

        speechOutputAnalysis += this.t('CORRECT_ANSWER_MESSAGE', correctAnswerIndex, correctAnswerText);
    }

    if (this.getSessionAttribute('currentQuestionIndex') === GAME_LENGTH - 1) {
        speechOutput = userGaveUp ? '' : this.t('ANSWER_IS_MESSAGE');
        speechOutput += speechOutputAnalysis + this.t('GAME_OVER_MESSAGE', currentScore.toString(), GAME_LENGTH.toString());

        this.tell(speechOutput);
    }
    else {
        currentQuestionIndex += 1;
        correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
        const spokenQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];
        const roundAnswers = populateRoundAnswers.call(this, gameQuestions, currentQuestionIndex, correctAnswerIndex, translatedQuestions);
        const questionIndexForSpeech = currentQuestionIndex + 1;
        let repromptText = this.t('TELL_QUESTION_MESSAGE', questionIndexForSpeech.toString(), spokenQuestion);

        for (let i = 0; i < ANSWER_COUNT; i++) {
            repromptText += `${i + 1}. ${roundAnswers[i]}. `;
        }

        speechOutput += userGaveUp ? '' : this.t('ANSWER_IS_MESSAGE');
        speechOutput += speechOutputAnalysis + this.t('SCORE_IS_MESSAGE', currentScore.toString()) + repromptText;

        this.setSessionAttributes({
            questionSpeech: repromptText,
            questionReprompt: repromptText,
            currentQuestionIndex: currentQuestionIndex,
            correctAnswerIndex: correctAnswerIndex + 1,
            questions: gameQuestions,
            score: currentScore,
            correctAnswerText: translatedQuestions[gameQuestions[currentQuestionIndex]][Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0]][0]
        });
        this.followUpState('TriviaState').ask(speechOutput, repromptText);
    }
}

module.exports.app = app;