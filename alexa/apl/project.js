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
							type: 'ALEXA_PRESENTATION_APL'
						}
					]
				}
			}
		}
    },
    googleAction: {
        nlu: 'dialogflow',
    },
    endpoint: `${JOVO_WEBHOOK_URL}`,
};