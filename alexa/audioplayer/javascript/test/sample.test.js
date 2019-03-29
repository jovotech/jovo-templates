'use strict';
const {Alexa} = require('jovo-platform-alexa');
jest.setTimeout(500);

for (const p of [new Alexa()]) {
    const testSuite = p.makeTestSuite();

    describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
        test('should tell "Hello World!" on LAUNCH', async () => {
            const conversation = testSuite.conversation();

            const launchRequest = await testSuite.requestBuilder.launch();
            const responseLaunchRequest = await conversation.send(launchRequest);

            expect(
                responseLaunchRequest.isTell('Hello World!'),
            ).toBe(true);

            await conversation.clearDb();
        });
    });
}
