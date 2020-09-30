import { GoogleAssistant } from 'jovo-platform-googleassistant';

jest.setTimeout(500);

for (const p of [new GoogleAssistant()]) {
  const testSuite = p.makeTestSuite();

  describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
    test('should ask the user how they like the song', async () => {
      const conversation = testSuite.conversation();

      const launchRequest = await testSuite.requestBuilder.launch();
      const response = await conversation.send(launchRequest);

      expect(response.isAsk('How do you like my new song?', 'How do you like my new song?')).toBeTruthy();

      await conversation.clearDb();
    });
  });
}
