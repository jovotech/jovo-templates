// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    alexaSkill: {
        nlu: 'alexa',
        manifest: {
			events: {
				endpoint: {
					uri: 'YOUR ENDPOINT'
				},
				subscriptions: [
					{
						eventName: 'SKILL_ENABLED'
					},
					{
						eventName: 'SKILL_DISABLED'
					},
					{
						eventName: 'SKILL_PERMISSION_ACCEPTED'
					},
					{
						eventName: 'SKILL_PERMISSION_CHANGED'
					},
					{
						eventName: 'SKILL_ACCOUNT_LINKED'
					}
				]
			}
		}
    },
    endpoint: '${JOVO_WEBHOOK_URL}',
};