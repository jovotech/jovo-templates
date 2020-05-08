"use strict";
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
            pathToFile: './../../db/db.json',
        },
    },
};
module.exports = config;
//# sourceMappingURL=config.js.map