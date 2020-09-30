// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

const config = {
  logging: true,

  intentMap: {
    'Default Fallback Intent': 'Unhandled',
  },

  db: {
    FileDb: {
      pathToFile: './../../db/db.json',
    },
  },
};

export = config;
