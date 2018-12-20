// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    alexaSkill: {
        nlu: 'alexa',
		manifest: {
			publishingInformation: {
				gadgetSupport: {
					maxGadgetButtons: 4,
					numPlayersMax: 1,
					minGadgetButtons: 1,
					requirement: 'REQUIRED',
					numPlayersMin: 1
				}
			},
			apis: {
				custom: {
					interfaces: [
						{
							type: 'GAME_ENGINE'
						},
						{
							type: 'GADGET_CONTROLLER'
						}
					]
				}
			}
		}
    },
    endpoint: `${JOVO_WEBHOOK_URL}`,
};