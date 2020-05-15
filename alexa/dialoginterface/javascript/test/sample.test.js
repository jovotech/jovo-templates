'use strict';

const { Alexa } = require('jovo-platform-alexa');

jest.setTimeout(500);

for (const p of [new Alexa()]) {
  const testSuite = p.makeTestSuite();

  describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
    test('should ask the user where they are flying to on LAUNCH', async () => {
      const conversation = testSuite.conversation();

      const launchRequest = await testSuite.requestBuilder.launch();
      const response = await conversation.send(launchRequest);

      expect(response.isAsk('Where are you flying to?', 'Where are you flying to?')).toBeTruthy();

      await conversation.clearDb();
    });
  });
}
