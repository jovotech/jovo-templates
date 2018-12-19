'use strict';
// const { App, Util } = require('jovo-framework');
// const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
jest.setTimeout(500);

for (const p of [new Alexa()]) {
    const testSuite = p.makeTestSuite();

    describe(`PLATFORM: ${p.constructor.name} INTENTS` , () => {
        test('should ask the user where they are flying to on LAUNCH', async () => {
            const conversation = testSuite.conversation();

            const launchRequest = await testSuite.requestBuilder.launch();
            const responseLaunchRequest = await conversation.send(launchRequest);
            
            expect(
                responseLaunchRequest.isAsk('Where are you flying to?', 'Where are you flying to?')
            ).toBe(true);

            await conversation.clearDb();
        });
    });
}
