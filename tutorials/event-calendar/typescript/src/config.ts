// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

const config = {
    logging: true,

    intentMap: {
        'AMAZON.StopIntent': 'END',
        'AMAZON.YesIntent': 'YesIntent',
        'AMAZON.NoIntent': 'NoIntent',
    },

    db: {
        FileDb: {
            pathToFile: '../../db/db.json',
        },
    },

    cms: {
        GoogleSheetsCMS: {
            spreadsheetId: '1QC9RsBds8Z8hHG9sLAsP3-o_-v0SYFQYCXr5EDLhPMY',
            access: 'public',
            sheets: [
                {
                    name: 'events',
                    position: 1,
                },
                {
                    name: 'responses',
                    type: 'Responses',
                    position: 2,
                },
            ],
        },
    },
};

export = config;
