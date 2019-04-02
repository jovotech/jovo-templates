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
            spreadsheetId: '1dSM_4n7zUgZwLevo8QwGS_ZKcWADHk1kvmscI0tEu24',
            access: 'public',
            sheets: [
                {
                    name: 'responses',
                    type: 'Responses',
                    position: 1,
                },
                {
                    name: 'answers',
                    type: 'KeyValue',
                    position: 2,
                },
            ],
        },
    },

    db: {
        FileDb: {
            pathToFile: '../../db/db.json',
        },
    },
};
