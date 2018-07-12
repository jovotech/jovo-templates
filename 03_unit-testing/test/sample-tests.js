'use strict';

const expect = require('chai').expect;

const getPlatformRequestBuilder = require('jovo-framework').util.getPlatformRequestBuilder;
const {send} = require('jovo-framework').TestSuite;


for (let rb of getPlatformRequestBuilder('AlexaSkill', 'GoogleActionDialogFlowV2')) {
    describe(`PLATFORM: ${rb.type()}`, () => {
        // Test isolated intents, "deep invocations"
        describe('INTENTS', () => {
                // Invocation: "open my test app"
                it('should return a welcome message and ask for the name at "LAUNCH"', () => {
                    return send(rb.launch())
                        .then((res) => {
                            const matchesResponse = res.isAsk('Hello World! What\'s your name?', 'Please tell me your name.');
                            expect(matchesResponse).to.equal(true);
                        });
                });

                // Invocation: "tell my test app to say hello"
                it('should return a welcome message and ask for the name at "HelloWorldIntent"', () => {
                    return send(rb.intent('HelloWorldIntent').setSessionNew(true))
                        .then((res) => {
                            const matchesResponse = res.isAsk('Hello World! What\'s your name?', 'Please tell me your name.');
                            expect(matchesResponse).to.equal(true);
                        });
                });

                // Invocation: "tell my test app my name is Chris"
                it('should greet the user with their name at "MyNameIsIntent"', () => {
                    return send(rb.intent('MyNameIsIntent', {name: 'Chris'}).setSessionNew(true))
                        .then((res) => {
                            const matchesResponse = res.isTell('Hey Chris, nice to meet you!');
                            expect(matchesResponse).to.equal(true);
                        });
                });
        });

        describe('CONVERSATIONS', () => {
            // Launch -> MyNameIsIntent
            it('should run the whole conversation flow and greet the user with the correct name', () => {
                return send(rb.launch())
                    .then((res) => {
                        const matchesResponse = res.isAsk('Hello World! What\'s your name?', 'Please tell me your name.');
                        expect(matchesResponse).to.equal(true);
                        return send(rb.intent('MyNameIsIntent', {name: 'Chris'}));
                    })
                    .then((res) => {
                        const matchesResponse = res.isTell('Hey Chris, nice to meet you!');
                        expect(matchesResponse).to.equal(true);
                    });
            });

            // Launch -> HelloWorldIntent
            it('should ask for the name again if user responds with something else', () => {
                return send(rb.launch())
                    .then((res) => {
                        expect(res.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')).to.equal(true);
                        return send(rb.intent('HelloWorldIntent'));
                    })
                    .then((res) => {
                        const matchesResponse = res.isAsk('What\'s your name?');
                         expect(matchesResponse).to.equal(true);
                    });
            });
        });
    });
}

