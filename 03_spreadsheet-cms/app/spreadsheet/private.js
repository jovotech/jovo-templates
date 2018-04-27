
const logic = require('../logic/logic.js');

const SPREADSHEET_ID  = "1Rd3Fz-JoLLkBjHeaB9fy7HEi3MNrzv0FVuibDpeoiYM";
const SHEET_ID  = "responses";

const key = require('./credentials_sheetreader.json');

const { google } = require('googleapis');
const sheets = google.sheets('v4');

module.exports = {

    get_content : function(app){

        const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            ['https://www.googleapis.com/auth/spreadsheets'],
            null
        );

        jwtClient.authorize( 
            function (error, tokens) {
                if (error) {
                    console.error(`Error at authorization: ${error.message}`);
                    logic.error.connect(app);
                };

                sheets.spreadsheets.values.get(
                    {
                        auth: jwtClient,
                        spreadsheetId: SPREADSHEET_ID,
                        range: SHEET_ID + '!A:B',
                    }, function(error, response) {
                        if ( error) {
                            console.error(`Error at retrieving data: ${error.message}`);
                            logic.error.data(app);
                        }
                        const rows = response.data.values;

                        if (rows.length == 0) {
                            console.log( 'No data found.');
                            logic.error.connect(app);
                        } else if (rows.length == 1) {
                            console.log( 'Only header found.');
                            logic.error.connect(app);
                        } else {
                            let responses = {};
                            let keys = [];
                            let key;
                            let response;
                            for ( let i = 1; i < rows.length; i++){
                                key = rows[ i][ 0];
                                //console.log( `Key ${i} : ${key}`);
                                response = rows[ i][ 1];
                                //console.log( `Response ${i} : ${response}`);
        
                                if ( Object.keys(responses).indexOf(key) == -1 ){
                                    responses[key] = [response]; 
                                } else {
                                    responses[key].push(response); 
                                }   
                            }
                            app.setSessionAttribute('responses', responses);
                            app = module.exports.load_responses(app);
                            logic.welcome(app);
                        }
                    }
                )
            }
        );
    },

    load_responses : function(app){
        const responses = app.getSessionAttribute('responses');
        let i18n_config = {
            'resources' : {},
            'returnObjects' : true
        }
        i18n_config.resources[app.getLocale()] = {
            'translation' : responses
        };
        app.app.setI18n(i18n_config);
        return app;
    }
}