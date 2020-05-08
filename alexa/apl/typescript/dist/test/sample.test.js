"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_platform_alexa_1 = require("jovo-platform-alexa");
jest.setTimeout(500);
for (const p of [new jovo_platform_alexa_1.Alexa()]) {
    const testSuite = p.makeTestSuite();
    describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
        test('should return a welcome message and ask for the name at "LAUNCH"', async () => {
            const conversation = testSuite.conversation();
            const launchRequest = await testSuite.requestBuilder.launch();
            const responseLaunchRequest = (await conversation.send(launchRequest));
            const helloWorldAplDirective = {
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: {
                    type: 'APL',
                    version: '1.0',
                    import: [
                        {
                            name: 'alexa-layouts',
                            version: '1.0.0',
                        },
                    ],
                    mainTemplate: {
                        parameters: ['payload'],
                        items: [
                            {
                                type: 'Text',
                                text: 'Hello World',
                            },
                        ],
                    },
                },
                datasources: {},
            };
            expect(responseLaunchRequest.response.directives[0]).toEqual(helloWorldAplDirective);
        });
    });
}
//# sourceMappingURL=sample.test.js.map