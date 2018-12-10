// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    logging: true,

    intentMap: {
      'AMAZON.StopIntent': 'END',
      'AMAZON.CancelIntent': 'END',
    },

    cms: {
        GoogleSheetsCMS: {
            sheets: [
                {
                    spreadsheetId: '1dSM_4n7zUgZwLevo8QwGS_ZKcWADHk1kvmscI0tEu24',
                    name: 'responses',
                    access: 'public',
                    type: 'Responses',
                    position: 1,
                },
                {
                    spreadsheetId: '1dSM_4n7zUgZwLevo8QwGS_ZKcWADHk1kvmscI0tEu24',
                    name: 'answers',
                    access: 'public',
                    type: 'KeyValue',
                    position: 2,
                }
            ]
        }
    },

    db: {
        FileDb: {
            pathToFile: '../db/db.json',
        }
    },
};
