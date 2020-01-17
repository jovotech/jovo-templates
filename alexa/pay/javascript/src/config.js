// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    logging: true,

    intentMap: {
        'AMAZON.StopIntent': 'END',
        'AMAZON.NoIntent': 'NoIntent',
        'AMAZON.YesIntent': 'YesIntent'
    },

    db: {
        FileDb: {
            pathToFile: '../db/db.json',
        },
    },
};
