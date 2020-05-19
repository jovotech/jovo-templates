'use strict';

const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');

jest.setTimeout(1000);

for (const p of [new Alexa(), new GoogleAssistant()]) {
  const testSuite = p.makeTestSuite();

  describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
    test('should return a welcome message and ask for the name at "LAUNCH"', async () => {
      const conversation = testSuite.conversation();

      const launchRequest = await testSuite.requestBuilder.launch();
      const response = await conversation.send(launchRequest);
      expect(
        response.isAsk(
          /**
           * Amazon Alexa and Google Assistant have a different audio tag syntax
           * Alexa: <audio src="foo"/>
           * Google: <audio src="foo">bar</audio>
           */
          [
            '<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_intro_01">undefined</audio> Welcome to \'True or False\'. I will tell you a fact, and you will say if it is true or false. Lets go! <audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01">undefined</audio> True or false: Mount Everest is the tallest mountain in the world.',
            '<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_intro_01"/> Welcome to \'True or False\'. I will tell you a fact, and you will say if it is true or false. Lets go! <audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01"/> True or false: Mount Everest is the tallest mountain in the world.',
          ],
          "Please answer with 'true' or 'false'! "
        )
      ).toBeTruthy();

      await conversation.clearDb();
    });
  });
}
