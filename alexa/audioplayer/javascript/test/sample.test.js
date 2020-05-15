'use strict';

const { Alexa } = require('jovo-platform-alexa');

jest.setTimeout(500);

for (const p of [new Alexa()]) {
  const testSuite = p.makeTestSuite();

  describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
    test('should tell "Hello World!" on LAUNCH', async () => {
      const conversation = testSuite.conversation();

      const launchRequest = await testSuite.requestBuilder.launch();
      const response = await conversation.send(launchRequest);

      expect(response.isTell('Hello World!')).toBeTruthy();

      await conversation.clearDb();
    });
  });
}
