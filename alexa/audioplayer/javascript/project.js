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
    endpoint: '${JOVO_WEBHOOK_URL}',
};
