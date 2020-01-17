// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

const config = {
    logging: true,

    intentMap: {
        'AMAZON.StopIntent': 'END',
        'AMAZON.NoIntent': 'NoIntent',
        'AMAZON.YesIntent': 'YesIntent'
    },

    db: {
        FileDb: {
            pathToFile: './../../db/db.json',
        },
    },
};

export = config;
