"use strict";
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
};
module.exports = config;
//# sourceMappingURL=config.js.map