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

    cms: {
        GoogleSheetsCMS: {
            // Find the spreadsheet here:
            // https://docs.google.com/spreadsheets/d/19pRsPiW79nAcHNybD43thY2kAE5X3EpIz5WZb21yGh4
            spreadsheetId: '19pRsPiW79nAcHNybD43thY2kAE5X3EpIz5WZb21yGh4',
            access: 'public',
            sheets: [
                {
                    name: 'responses',
                    type: 'Responses',
                    position: 1,
                },
            ]
        }
    }
};
export = config;
