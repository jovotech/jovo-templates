'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
    requestLoggingObjects: [ 'request'],
    responseLoggingObjects: [ 'response']
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

const spreadsheet = require( './spreadsheet/public.js');  // Use for public Google Spreadsheet CMS
//const spreadsheet = require( './spreadsheet/private.js'); // Use for private Google Spreadsheet CMS

const logic = require( './logic/logic.js');

app.setHandler({

    'ON_REQUEST' : function() {
        load_responses(this);
    },

    'NEW_SESSION': function() {
        spreadsheet.get_content( this);
    },

    'Unhandled': function(name) {
        logic.goodbye(this);
    }
});

module.exports.app = app;

function load_responses(app){;
    if (app.getSessionAttribute('responses')){
        spreadsheet.load_responses(app);
    }
}