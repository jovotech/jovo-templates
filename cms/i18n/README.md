# jovo-sample-true-false 
## with i18n integration


This project is a simple example for a True-or-False-Quiz.
It tells you different facts and you have to answer with "true" or "false". For every correct answer, you get a point, for every incorrect answer you lose one. Your total points will be saved and you can open the game again to collect more points.
___

Different than in the example project with the plain-text output speech in the code, this project uses the jovo i18n integration.

With the jovo i18n integration you can build voice applications that support multiple languages. 
i18n works by separating the content (the text/speech) from the application logic, to make it easier to switch languages.
Read more [here](https://www.jovo.tech/docs/v2/output/i18n#introduction-to-i18n "jovo docs i18n").

Starting from the first example without any CMS or internationalization, the folder `/i18n` with an `en.json` file was added into the `/src` folder.

**The complete `en.json` file looks like this:** 
```javascript
{
	"translation": {
		"WELCOME": [
			"Welcome to 'True or False'. I will tell you a fact, and you will say if it is true or false. Lets go! ",
			"Welcome to 'True or False'. Now I will tell you a fact, and you will say if it is true or false. Lets go! "
		],
		"QUESTION": "True or false: {{statement}} ",
		"INCORRECT": "No, it's {{correctAnswer}}! ",
		"REPROMPT": "Please answer with 'true' or 'false'! ",
		"GOODBYE": "Good bye, see you soon! ",
		"END": [
			"Nice! You got {{currentPoints}} points! Your total points are: {{totalPoints}}. Bye, see you next time!",
			"Cool! You reached {{currentPoints}} points! Your total points are now: {{totalPoints}}. Good bye, see you soon!"
		],
		"SOUND": {
			"INTRO": "soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_intro_01",
			"CORRECT": "soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02",
			"INCORRECT": "soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_negative_response_02",
			"FORWARD": "soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01",
			"OUTRO": "soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_outro_01"
		},
		"STATEMENT": {
			"0": "Mount Everest is the tallest mountain in the world.",
			"1": "The Atlantic Ocean is the biggest ocean on Earth.",
			"2": "The study of plants is known as botany.",
			"3": "Venus is the closest planet to our Sun.",
			"4": "Spiders have six legs.",
			"5": "Dolphins are mammals.",
			"6": "Earthworms do not have eyes.",
			"7": "The human body has four lungs."
		}
	}
}
```

**The `answers.json` file** is just for storing the answers 'true' or 'false' for the statements by number:
```javascript
{
	"0": true,
	"1": false,
	"2": true,
	"3": false,
	"4": false,
	"5": true,
	"6": true,
	"7": false
}
```

All other changes happened in the `app.js` file. 

before without i18n:
```javascript
this.$reprompt.addText('Please answer with "true" or "false"!');
```
now with i18n:
```javascript
this.$reprompt.addText(this.t('REPROMPT'));
```
Instead of giving the `addText()` function a plain-text string, you can give `this.t('REPROMPT')`. The key `REPROMPT` gets translated to its value, that is defined in `en.json`.  
Now the complete speech content is seperated from the application logic and you can easily change the speech texts and add more languages through adding more json files like `en.json`, using the locale ID (e.g. `en-US.json`, `de-DE.json`, `en-GB.json`, etc.). `en.json` is for all english locale IDs.

In the next step ...
