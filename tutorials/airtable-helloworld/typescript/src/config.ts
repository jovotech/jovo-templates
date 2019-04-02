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
            pathToFile: '../../db/db.json',
        }
    },
    
    cms: {
        AirtableCMS: {
            apiKey: '<api-key>',
            baseId: '<base-id>',
            tables: [
                {
                    name: 'responses',
                    table: 'Responses',
                    type: 'Responses'
                },
            ]
        }
    },
};

export = config;
