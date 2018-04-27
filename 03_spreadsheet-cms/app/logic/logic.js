
module.exports = {

    welcome : function( app){
        console.log( 'logic.welcome()');
        app.ask(
            app.speech.t('welcome')
        );    
    },

    goodbye : function( app){
        console.log( 'logic.goodbye()');
        app.tell(
            app.speech.t('goodbye')
        );    
    },

    error : {
        connect : function( app){
            console.log( 'logic.error.connect()');
            app.tell(
                "Sorry, I couldn't connect to the spreadsheet. "
            );
        },

        data : function( app){
            console.log( 'logic.error.data()');
            app.tell(
                "Sorry, I couldn't retireve data from the spreadsheet. "
            );
        },
    }
}