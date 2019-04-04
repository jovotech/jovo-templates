import {Alexa} from 'jovo-platform-alexa';
import {GoogleAssistant} from 'jovo-platform-googleassistant';

jest.setTimeout(500);

for (const p of [new Alexa(), new GoogleAssistant()]) {
    const testSuite = p.makeTestSuite();

    describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
        test('should return a welcome message and ask if the user is ready to play', async () => {
            const conversation = testSuite.conversation();

            const launchRequest = await testSuite.requestBuilder.launch();
            const responseLaunchRequest = await conversation.send(launchRequest);

            let speech = 'Welcome to Jovo Trivia. I will ask you 5 questions, try to get as many right as you can. Just say the number of the answer. Are you ready?';
            expect(
                responseLaunchRequest.isAsk(speech, speech),
            ).toBe(true);

            await conversation.clearDb();
        });
    });
}
