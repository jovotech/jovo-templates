'use strict';
// const { App, Util } = require('jovo-framework');
// const { GoogleAssistant } = require('jovo-platform-googleassistant');
const {Alexa} = require('jovo-platform-alexa');
jest.setTimeout(500);

for (const p of [new Alexa()]) {
    const testSuite = p.makeTestSuite();

    describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
        test('should tell the user what they can do on LAUNCH', async () => {
            const conversation = testSuite.conversation();

            const launchRequest = await testSuite.requestBuilder.launch();
            const responseLaunchRequest = await conversation.send(launchRequest);

            expect(
                responseLaunchRequest.isAsk(
                    'You can buy an item saying: buy "product name", or refund an item saying: refund "product name". What would you like to do?',
                    'You can buy an item saying: buy "product name", or refund an item saying: refund "product name". What would you like to do?'),
            ).toBe(true);

            await conversation.clearDb();
        });
    });
}
