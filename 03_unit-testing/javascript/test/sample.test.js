'use strict';

const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');

jest.setTimeout(500);

for (const p of [new Alexa(), new GoogleAssistant()]) {
  const testSuite = p.makeTestSuite();

  describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
    test('should return a welcome message and ask for the name at "LAUNCH"', async () => {
      const conversation = testSuite.conversation();

      const launchRequest = await testSuite.requestBuilder.launch();
      const response = await conversation.send(launchRequest);

      const isAsk = response.isAsk("Hello World! What's your name?", 'Please tell me your name.');
      expect(isAsk).toBeTruthy();
    });

    test('should return a welcome message and ask for the name at "HelloWorldIntent"', async () => {
      const conversation = testSuite.conversation();

      const intentRequest = await testSuite.requestBuilder.intent();

      // Set request data, such as the intent name.
      intentRequest.setIntentName('HelloWorldIntent');
      intentRequest.setNewSession(true);

      const response = await conversation.send(intentRequest);
      const isAsk = response.isAsk("Hello World! What's your name?", 'Please tell me your name.');
      expect(isAsk).toBeTruthy();

      await conversation.clearDb();
    });

    test('should greet the user with their name at "MyNameIsIntent"', async () => {
      const conversation = testSuite.conversation();

      // Intent and inputs can also be passed as arguments.
      const intentRequest = await testSuite.requestBuilder.intent('MyNameIsIntent', { name: 'Joe' });
      intentRequest.setNewSession(true);

      const response = await conversation.send(intentRequest);
      const isTell = response.isTell('Hey Joe, nice to meet you!');
      expect(isTell).toBeTruthy();

      await conversation.clearDb();
    });
  });

  describe(`PLATFORM: ${p.constructor.name} CONVERSATIONS`, () => {
    test('should run the whole conversation flow and greet the user with the correct name', async () => {
      const conversation = testSuite.conversation();

      // Send LaunchRequest.
      const launchRequest = await testSuite.requestBuilder.launch();
      const responseLaunchRequest = await conversation.send(launchRequest);
      expect(responseLaunchRequest.isAsk("Hello World! What's your name?", 'Please tell me your name.')).toBeTruthy();

      // Send IntentRequest.
      const intentRequest = await testSuite.requestBuilder.intent('MyNameIsIntent', { name: 'Joe' });
      const responseIntentRequest = await conversation.send(intentRequest);
      expect(responseIntentRequest.isTell('Hey Joe, nice to meet you!')).toBeTruthy();
    });

    test('should ask for the name again if user responds with something else', async () => {
      const conversation = testSuite.conversation();

      // Send LaunchRequest.
      const launchRequest = await testSuite.requestBuilder.launch();
      const responseLaunchRequest = await conversation.send(launchRequest);
      expect(responseLaunchRequest.isAsk("Hello World! What's your name?", 'Please tell me your name.')).toBeTruthy();

      // Send IntentRequest that should trigger Unhandled.
      const intentRequest = await testSuite.requestBuilder.intent('ShouldFailIntent');
      const responseIntentRequest = await conversation.send(intentRequest);
      expect(responseIntentRequest.isAsk("Hello World! What's your name?", 'Please tell me your name.')).toBeTruthy();
    });
  });
}
