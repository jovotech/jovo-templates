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

    'NEW_SESSION': function() {
        spreadsheet.get_content( this);
    },

    'ON_REQUEST' : function() {
        const responses = this.getSessionAttribute('responses');
        if (responses){
            let i18n_config = {
                'resources' : {},
                'returnObjects' : true
            }
            i18n_config.resources[this.getLocale()] = {
                'translation' : responses
            };
            this.app.setI18n(i18n_config);
        }
    },

    'Unhandled': function(name) {
        logic.goodbye(this);
    }
});

module.exports.app = app;
