import {Alexa} from 'jovo-platform-alexa';

jest.setTimeout(500);

for (const p of [new Alexa()]) {
    const testSuite = p.makeTestSuite();

    describe(`PLATFORM: ${p.constructor.name} INTENTS` , () => {
        test('should ask the user how they like the song', async () => {
            const conversation = testSuite.conversation();

            const launchRequest = await testSuite.requestBuilder.launch();
            const responseLaunchRequest = await conversation.send(launchRequest);
            
            expect(
                responseLaunchRequest.isTell('Please link your Account')
            ).toBe(true);

            // TODO maybe enable again after it detects db-files inside dist
            //await conversation.clearDb();
        });
    });
}
