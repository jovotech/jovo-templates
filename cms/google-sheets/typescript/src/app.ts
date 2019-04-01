import {App} from 'jovo-framework';
import {Alexa, AlexaSpeechBuilder} from 'jovo-platform-alexa';
import {JovoDebugger} from 'jovo-plugin-debugger';
import {FileDb} from 'jovo-db-filedb';
import {GoogleSheetsCMS} from 'jovo-cms-googlesheets';
import {GoogleAssistant} from 'jovo-platform-googleassistant';
import {Jovo} from 'jovo-core';
import {GoogleActionSpeechBuilder} from 'jovo-platform-googleassistant/dist/src/core/GoogleActionSpeechBuilder';

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
        addAudio(this, this.t('SOUND.INTRO').toString());
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
        const answer = parseBoolean(input || '');
        console.log(`input answer:   ${answer}`);
        const correctAnswerStr = this.$cms.answers[`STATEMENT_${this.$user.$data.index}`]; // get answer as string
        const correctAnswer = parseBoolean(correctAnswerStr);
        console.log(`correct answer: ${correctAnswer}`);
        if (answer === correctAnswer) {
            this.$user.$data.currentPoints++;
            addAudio(this, this.t('SOUND.CORRECT').toString());
        } else {
            this.$user.$data.currentPoints--;
            addAudio(this, this.t('SOUND.INCORRECT').toString());
            this.$speech.addText(
                this.t('INCORRECT', {
                    correctAnswer: correctAnswer,
                }));
        }
        this.$user.$data.index++;
        askQuestion(this);
    },

    Unhandled() {
        this.$reprompt.addText(this.t('REPROMPT'));
        this.ask(this.$reprompt, this.$reprompt);
    },

    END() {
        this.tell(this.t('GOODBYE').toString());
    },
});

function askQuestion(jovo: Jovo) {
    const index = jovo.$user.$data.index;
    console.log(`index: ${index}`);
    const currentStatement = jovo.t(`STATEMENT_${index}`);
    if (currentStatement.includes('STATEMENT')) { // no value found, end of list
        console.log(`end`);
        jovo.$user.$data.totalPoints += jovo.$user.$data.currentPoints; // count total points
        addAudio(jovo, jovo.t('SOUND.OUTRO').toString());
        jovo.$speech.addText(
            jovo.t('END', {
                currentPoints: jovo.$user.$data.currentPoints,
                totalPoints: jovo.$user.$data.totalPoints,
            }));
        jovo.tell(jovo.$speech);
        return;
    }
    addAudio(jovo, jovo.t('SOUND.FORWARD').toString());
    jovo.$speech.addText(
        jovo.t('QUESTION', {
            statement: currentStatement,
        }));
    jovo.$reprompt.addText(jovo.t('REPROMPT'));
    jovo.ask(jovo.$speech, jovo.$reprompt);
}

function parseBoolean(val: string) {
    switch (val.trim().toLowerCase()) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return false;
    }
}

function addAudio(jovo: Jovo, url: string) {
    if (jovo.$alexaSkill) {
        (jovo.$speech as AlexaSpeechBuilder).addAudio(url);
    } else if (jovo.$googleAction) {
        (jovo.$speech as GoogleActionSpeechBuilder).addAudio(url, '', true, 1);
    }
}

export {app};
