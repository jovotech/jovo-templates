// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

const config = {
    logging: true,

    intentMap: {
        'AMAZON.StopIntent': 'END',
        'AMAZON.PauseIntent': 'PauseIntent',
        'AMAZON.ResumeIntent': 'ResumeIntent',
    },

    db: {
        FileDb: {
            pathToFile: '../db/db.json',
        },
    },
};

export {config};
