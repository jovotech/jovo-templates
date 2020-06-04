import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';

jest.setTimeout(500);

for (const p of [new Alexa(), new GoogleAssistant()]) {
  const testSuite = p.makeTestSuite();

  describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
    test('should return a welcome message and ask for the name at "LAUNCH"', async () => {
      const conversation = testSuite.conversation();

      const launchRequest = await testSuite.requestBuilder.launch();
      const response = await conversation.send(launchRequest);

      expect(response.isAsk("Hello World! What's your name?", 'Please tell me your name.')).toBeTruthy();
    });
  });
}
