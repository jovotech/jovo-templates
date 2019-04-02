// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

const config = {
    logging: true,

    intentMap: {
        'AMAZON.StopIntent': 'END',
    },

    db: {
        FileDb: {
            pathToFile: './../../db/db.json',
        }
    },

    user: {
        context: true,
    },
};
export = config;
