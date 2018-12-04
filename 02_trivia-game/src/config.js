module.exports = {
    logging: true,
    v1: {
        logging: true,
    },

    intentMap: {
        'AMAZON.YesIntent': 'YesIntent',
        'AMAZON.NoIntent': 'NoIntent',
        'AMAZON.RepeatIntent': 'RepeatIntent',
        'AMAZON.StopIntent': 'StopIntent',
        'AMAZON.HelpIntent': 'HelpIntent',
        'AMAZON.CancelIntent': 'CancelIntent',
    },
    db: {
        FileDb: {
            pathToFile: './db/db.json'
        }
    },
};
