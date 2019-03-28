// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

import {App} from 'jovo-framework';
import {Alexa} from 'jovo-platform-alexa';
import {JovoDebugger} from 'jovo-plugin-debugger';
import {FileDb} from 'jovo-db-filedb';
import {GoogleAssistant} from 'jovo-platform-googleassistant';
import {Input, Jovo} from 'jovo-core';

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
);

// ------------------------------------------------------------------
// APP TYPES
// ------------------------------------------------------------------
export interface Question {
    [question: string]: string[];
}


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
            const loadedTranslatedQuestions: unknown = this.t('QUESTIONS');
            const translatedQuestions: Question[] = loadedTranslatedQuestions as Question[];
            const gameQuestions: number[] = populateGameQuestions(translatedQuestions);

            // Generate a random index for the correct answer, from 0 to 3
            const correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));

            // Select and shuffle the answers for each question
            const roundAnswers: string[] = populateRoundAnswers(gameQuestions, 0, correctAnswerIndex, translatedQuestions);
            const currentQuestionIndex = 0;
            const spokenQuestion: string = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];

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
            return this.toStateIntent('StartState', 'StartGameIntent');
        },
        NoIntent() {
            this.$speech.t('NO_MESSAGE');
            this.tell(this.$speech);
        },
    },
    TriviaState: {
        AnswerIntent() {
            handleUserGuess(this, false);
        },
        DontKnowIntent() {
            handleUserGuess(this, true);
        },
        RepeatIntent() {
            this.$speech = this.getSessionAttribute('questionSpeech');
            this.$reprompt = this.getSessionAttribute('questionReprompt');
            this.ask(this.$speech, this.$reprompt);
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
            this.$speech.t('TRIVIA_UNHANDLED', {answerCount: ANSWER_COUNT.toString()});
            this.ask(this.$speech);
        },
        END() {
            // this.getEndReason() only works for Alexa Skills currently.
            if (this.isAlexaSkill()) {
                console.log('Session ended in TriviaState: ' + this.$alexaSkill!.getEndReason());
            } else {
                console.log('Session ended in TriviaState');
            }
        },
    },
    HelpState: {
        HelpUser() {
            let askMessage: string = '';
            if (this.$data.newGame) {
                askMessage = String(this.t('ASK_MESS`AGE_START'));
            } else {
                askMessage = String(this.t('REPEAT_QUESTION_MESSAGE')) + String(this.t('STOP_MESSAGE'));
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
            this.$data.newGame = false;
            return this.toStateIntent('StartState', 'StartGameIntent');
        },
        RepeatIntent() {
            this.$data.newGame = !(this.getSessionAttribute('questionSpeech') && this.getSessionAttribute('questionReprompt'));
            return this.toStateIntent('HelpState', 'HelpUser');
        },
        HelpIntent() {
            this.$data.newGame = !(this.getSessionAttribute('questionSpeech') && this.getSessionAttribute('questionReprompt'));
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
        StopIntent() {
            this.$speech.t('STOP_MESSAGE');
            this.ask(this.$speech);
        },
        END() {
            // this.getEndReason() only works for Alexa Skills currently.
            if (this.isAlexaSkill()) {
                console.log('Session ended in HelpState: ' + this.$alexaSkill!.getEndReason());
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
function populateGameQuestions(translatedQuestions: Question[]): number[] {
    const gameQuestions: number[] = [];
    const indexList: number[] = [];

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

        const temp: number = indexList[index];
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
function populateRoundAnswers(gameQuestionIndexes: number[], correctAnswerIndex: number, correctAnswerTargetLocation: number, translatedQuestions: Question[]): string[] {
    const answers: string[] = [];
    const answersCopy: string[] = translatedQuestions[gameQuestionIndexes[correctAnswerIndex]][Object.keys(translatedQuestions[gameQuestionIndexes[correctAnswerIndex]])[0]].slice();
    let index = answersCopy.length;

    if (index < ANSWER_COUNT) {
        throw new Error('Not enough answers for question.');
    }

    // Shuffle the answers, excluding the first element which is the correct answer.
    for (let j = 1; j < answersCopy.length; j++) {
        const rand = Math.floor(Math.random() * (index - 1)) + 1;
        index -= 1;
        const swapTemp1: string = answersCopy[index];
        answersCopy[index] = answersCopy[rand];
        answersCopy[rand] = swapTemp1;
    }

    // Swap the correct answer into the target location
    for (let i = 0; i < ANSWER_COUNT; i++) {
        answers[i] = answersCopy[i];
    }
    const swapTemp2: string = answers[0];
    answers[0] = answers[correctAnswerTargetLocation];
    answers[correctAnswerTargetLocation] = swapTemp2;
    return answers;
}

/**
 * @param {object} answer user input
 * @return {boolean}
 */
function isAnswerSlotValid(answer: Input): boolean {
    if (answer) {
        const parsed = parseInt(answer.value, 10);
        return !isNaN(parsed) && parsed < (ANSWER_COUNT + 1) && parsed > 0;
    } else {
        return false;
    }
}

/**
 * @param instance
 * @param {boolean} userGaveUp
 */
function handleUserGuess(instance: Jovo, userGaveUp: boolean) {
    let answer: Input = instance.$inputs.answer;
    const answerSlotValid = isAnswerSlotValid(answer);
    const speechOutputAnalysis = instance.getSpeechBuilder();
    const gameQuestions = instance.getSessionAttribute('questions');
    let correctAnswerIndex = instance.getSessionAttribute('correctAnswerIndex');
    let currentScore = instance.getSessionAttribute('score');
    let currentQuestionIndex = instance.getSessionAttribute('currentQuestionIndex');
    const correctAnswerText = instance.getSessionAttribute('correctAnswerText');
    const loadedTranslatedQuestions: unknown = instance.t('QUESTIONS');
    const translatedQuestions: Question[] = loadedTranslatedQuestions as Question[];

    if (answerSlotValid && parseInt(instance.$inputs.answer.value, 10) === correctAnswerIndex) {
        currentScore++;
        speechOutputAnalysis!.t('ANSWER_CORRECT_MESSAGE');
    } else {
        if (!userGaveUp) {
            speechOutputAnalysis!.t('ANSWER_WRONG_MESSAGE');
        }

        speechOutputAnalysis!.t('CORRECT_ANSWER_MESSAGE', {
            correctAnswerIndex: correctAnswerIndex,
            correctAnswerText: correctAnswerText,
        });
    }

    if (instance.getSessionAttribute('currentQuestionIndex') === GAME_LENGTH - 1) {
        instance.$speech
            .addText(userGaveUp ? '' : instance.t('ANSWER_IS_MESSAGE'))
            .addText(speechOutputAnalysis!.toString())
            .t('GAME_OVER_MESSAGE', {currentScore: currentScore.toString(), gameLength: GAME_LENGTH.toString()});

        instance.tell(instance.$speech);
    } else {
        currentQuestionIndex += 1;
        correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
        const spokenQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];
        const roundAnswers = populateRoundAnswers(gameQuestions, currentQuestionIndex, correctAnswerIndex, translatedQuestions);
        const questionIndexForSpeech = currentQuestionIndex + 1;
        instance.$reprompt
            .t('TELL_QUESTION_MESSAGE', {questionNumber: questionIndexForSpeech.toString(), question: spokenQuestion});

        for (let i = 0; i < ANSWER_COUNT; i++) {
            instance.$reprompt.addText(`${i + 1}. ${roundAnswers[i]}. `);
        }

        instance.$speech
            .addText(userGaveUp ? '' : instance.t('ANSWER_IS_MESSAGE'))
            .addText(speechOutputAnalysis!.toString())
            .t('SCORE_IS_MESSAGE', {currentScore: currentScore.toString()})
            .addText(instance.$reprompt.toString());

        instance.setSessionAttributes({
            questionSpeech: instance.$reprompt.toString(),
            questionReprompt: instance.$reprompt.toString(),
            currentQuestionIndex: currentQuestionIndex,
            correctAnswerIndex: correctAnswerIndex + 1,
            questions: gameQuestions,
            score: currentScore,
            correctAnswerText: translatedQuestions[gameQuestions[currentQuestionIndex]][Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0]][0],
        });
        instance.followUpState('TriviaState').ask(instance.$speech, instance.$reprompt);
    }
}

export {app};
