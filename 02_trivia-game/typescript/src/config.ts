import * as enUsTranslationFile from './i18n/en-US.json';
import * as deDeTranslationFile from './i18n/de-DE.json';

// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

const config = {
	logging: true,

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
			pathToFile: './../../db/db.json',
		},
	},

	i18n: {
		resources: {
			'en-US': enUsTranslationFile,
			'de-DE': deDeTranslationFile,
		},
	},
};

export = config;
