// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    logging: true,

    intentMap: {
      'AMAZON.StopIntent': 'END',
      'AMAZON.CancelIntent': 'END',
    },

    db: {
        FileDb: {
            pathToFile: '../db/db.json',
        }
    },
};
