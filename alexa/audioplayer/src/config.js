module.exports = {
    logging: true,
    // v1: {
    //    logging: true,
    // },
    //
    intentMap: {
        'AMAZON.StopIntent': 'END',
        'AMAZON.PauseIntent': 'PauseIntent',
        'AMAZON.ResumeIntent': 'ResumeIntent',
    },
    db: {
        FileDb: {
            pathToFile: './db/db.json'
        }
    },

};
