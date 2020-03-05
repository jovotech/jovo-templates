import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { Bixby } from 'jovo-platform-bixby';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
	new Alexa(),
	new GoogleAssistant(),
	new Bixby(),
	new JovoDebugger(),
	new FileDb()
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	},

	PlayAudioIntent() {
		this.$bixbyCapsule!.$audioPlayer!.play({
			title: 'Example Audio',
			stream: { url: 'https://s3.amazonaws.com/jovo-songs/song1.mp3' }
		});
	},

	AUDIOPLAYER: {
		'BixbyCapsule.AudioPlaying'() {
			console.log('BixbyCapsule.AudioPlaying');

			this.tell('Playing audio.');
		}
	}
});

export { app };
