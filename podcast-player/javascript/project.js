// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    alexaSkill: {
        nlu: 'alexa',
        manifest: {
            apis: {
                custom: {
                    interfaces: [
                        {
                            type: 'AUDIO_PLAYER',
                        },
                    ],
                },
            },
        },
    },
    googleAction: {
        nlu: 'dialogflow',
    },
    endpoint: '${JOVO_WEBHOOK_URL}',
};
