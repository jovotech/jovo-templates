
const logic = require('../logic/logic.js');
const http = require('http');

const SPREADSHEET_ID  = "1Rd3Fz-JoLLkBjHeaB9fy7HEi3MNrzv0FVuibDpeoiYM";
const SHEET_ID  = "responses";

module.exports = {

    get_content : function(jovo){

        const spreadsheet_url = `http://spreadsheets.google.com/feeds/list/${SPREADSHEET_ID}/od6/public/basic?alt=json`;

        http.get( spreadsheet_url, (response) => {
            const statusCode = response.statusCode;
            const contentType = response.headers['content-type'];

            let error;
            if (
                statusCode !== 200
            ) {
                error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
            } else if (
                !/^application\/json/.test(contentType)
            ) {
                error = new Error('Invalid content-type.\n' +
                `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.error(error.message);
                logic.error.connect(jovo);
            }

            response.setEncoding('utf8');
            let raw_data = '';
            response.on('data', (chunk) => { raw_data += chunk; });
            response.on('end', () => {
                try {
                    const parsed_data = JSON.parse(raw_data);
                    //console.log( `Google Spreadsheet Response : ${JSON.stringify( parsed_data, null, 4)}`);
                    let responses = {};
                    let keys = [];
                    let key;
                    let response;
                    for (let i = 0; i < parsed_data.feed.entry.length; i++){
                        key = parsed_data.feed.entry[ i].title.$t;
                        //console.log( `Key ${i} : ${key}`);
                        response = /^\s*response\s*:\s*(.*)$/.exec(parsed_data.feed.entry[ i].content.$t)[1];
                        //console.log( `Response ${i} : ${response}`);

                        if ( Object.keys(responses).indexOf(key) == -1 ){
                            responses[key] = [response]; 
                        } else {
                            responses[key].push(response); 
                        }                        
                    }
                    jovo.setSessionAttribute('responses', responses);
                    jovo = module.exports.load_responses(jovo);
                    logic.welcome(jovo);
                } catch (error) {
                    console.error(error.message);
                    logic.error.data(jovo);
                }
            });
        })
        .on('error', (error) => {
            console.error(`Error: ${error.message}`);
            logic.error.connect(jovo);
        });
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