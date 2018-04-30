
module.exports = {

    welcome : function( jovo){
        console.log( 'logic.welcome()');
        jovo.ask(
            jovo.speech.t('welcome')
        );    
    },

    goodbye : function( jovo){
        console.log( 'logic.goodbye()');
        jovo.tell(
            jovo.speech.t('goodbye')
        );    
    },

    error : {
        connect : function( jovo){
            console.log( 'logic.error.connect()');
            jovo.tell(
                "Sorry, I couldn't connect to the spreadsheet. "
            );
        },

        data : function( jovo){
            console.log( 'logic.error.data()');
            jovo.tell(
                "Sorry, I couldn't retrieve data from the spreadsheet. "
            );
        },
    }
}