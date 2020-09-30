// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  alexaSkill: {
    nlu: 'alexa',
    manifest: {
      permissions: [
        {
          name: 'payments:autopay_consent',
        },
      ],
    },
  },
  endpoint: '${JOVO_WEBHOOK_URL}',
};
