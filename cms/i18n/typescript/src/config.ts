// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

const config = {
  logging: true,

  intentMap: {
    'AMAZON.StopIntent': 'END',
    'AMAZON.CancelIntent': 'END',
  },

  db: {
    FileDb: {
      pathToFile: './../../db/db.json',
    },
  },
};

export = config;
