[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Template: Alexa Buttons Demo

Jovo Sample Alexa Skill that uses the [Game Engine](https://developer.amazon.com/docs/custom-skills/game-engine-interface-reference.html) and [Gadget Controller Interfaces](https://developer.amazon.com/docs/custom-skills/gadget-controller-interface-reference.html) of the Gadgets Skill API.

Actual Echo Buttons are not required to run this template, as they can be simulated in the Alexa developer console.

This template contains:

* A language model (`models/en-US.json`) corresponding to the default one of a custom Skill, with the invocation name `button demo`
* App logic (`app/app.js`) that uses the Jovo implementation of the Gadgets Skill API for Amazon Alexa
* A demo implementation of:
  *  an input handler directive to define Gadget events
  *  a handler function to respond to these events
  *  gadget controller directives to control the LED lights of the Buttons
* A full [roll call](https://developer.amazon.com/docs/gadget-skills/discover-echo-buttons.html) is not in the scope of this template


How to make it work:

(#template-alexa-buttons-demo)
- [Create Project](#create-project)
- [Deploy project](#deploy-project)
- [Run Jovo Webhook](#run-jovo-webhook)
- [Understand the Code](#understand-the-code)
    - [Setting up the game engine](#setting-up-the-game-engine)
    - [Seting up the gadget controller](#seting-up-the-gadget-controller)
    - [Responding to game engine events](#responding-to-game-engine-events)


## Create Project

Create a new project from this template:

```sh
$ jovo new <directory> --template alexa/buttons
```

Go into the project directory and build the platform-specific configuration for an Alexa Skill with Echo Buttons:

```sh
$ cd <directory>

# Initialize Alexa Platform
$ jovo build -p alexaSkill
```

## Deploy project

The Skill is ready to be deployed to the Amazon Developer console:

```sh
$ jovo deploy

# Alternative
$ jovo deploy alexaSkill
```

## Run Jovo Webhook

The Skill is configured to use the Jovo Webhook as its HTTPS endpoint, so your Jovo Webhook needs to be active in order to process requests.

```sh
# Run Jovo Webhook
$ jovo run
```

You can now test the Skill:

* Invocation name "button demo"
* If you have actual Echo Buttons, you can use them to test the Skill on the device that they are paired with
* If you don't have Echo Buttons, you can test the Skill in the Amazon Developer console's test tab

## Understand the Code

The logic of the Skill has three main parts:
* Defining which Gadget events to receive (i.e. setting up the game engine)
* Defining the light effects of the buttons up to where the pre-defined events happen (i.e. setting up the gadget controller)
* Reacting to Button presses (i.e. the events defined by the game engine)

### Setting up the game engine

The details of how the code works can be found in the comments of `app.js`, and here's a general outline.
Upon launching Skill, we define which button events we want to receive. Technically, this means we have to set the input handler for the **game engine interface** using the `jovo.alexaSkill().gameEngine()` class.

First, we define a **recognizer** to recognize one type of button event. In this template, we only have one recognizer `buttonDownRecognizer` to recognize when a button is pressed down:

```js
const buttonDownRecognizer = this.alexaSkill().gameEngine()
    .getPatternRecognizerBuilder('buttonDownRecognizer')
    .anchorEnd()
    .fuzzy(false)
    .pattern([
      {'action': 'down',}
    ]);
```
Now we can use this recognizer to define an **event** `buttonDownEvent` that we want to receive from the Button (i.e. the Game Engine interface):

```js
const buttonDownEvent = this.alexaSkill().gameEngine()
    .getEventsBuilder('buttonDownEvent')
    .meets(['buttonDownRecognizer'])
    .reportsMatches()
    .shouldEndInputHandler(false)
    .build();
```

We also need a **timeout event** `timeoutEvent` to know when the designated time to press buttons has ended. This one uses the built-in `timed out` recognizer and ends the input handler, so that we recieve no more Button events in this seesion.

```js
const timeoutEvent = this.alexaSkill().gameEngine()
    .getEventsBuilder('timeoutEvent')
    .meets(['timed out'])
    .reportsNothing()
    .shouldEndInputHandler(true)
    .build();
```

Finally, we need to register our recognizer and the two events with the game engine. The `timeout` and `proxies` aren't relevant at this point.
```js
this.alexaSkill().gameEngine()
    .setEvents([buttonDownEvents, timeoutEvents])
    .setRecognizers([buttonDownRecognizer])
    .startInputHandler(timeout, proxies);
```

### Seting up the gadget controller

For the lights, we need to set up one gadget controller object for each of the three events `'buttonUp'`, `'buttonDown'` and `none` (for when the button is not pressed). Note that these events do no correspond to the events defined for the game engine above, and cannot be configured!

For the easiest case of the button being pressed (`'buttonDown'` event), we want it to simply light up for one second in bright white color, without repetition:
```js
this.alexaSkill().gadgetController()
    .setTriggerEvent('buttonDown')
    .setAnimations(
        [{
            "repeat": 1,
            "targetLights": ["1"],
            "sequence": [{
                "durationMs": 1000,
                "color": "ffffff",
                "blend": true
            }]
        }]
    )
    .setLight([], 0, []); // Let's ignore these parameters for now
```
We define exactly the same animation for the `'buttonUp'` event, to replace a default blue flash animation.

For when the button is idle, i.e. not (yet) pressed, we want a soft white pulsating animation. We create a single sequence of the animation using the helper class `buildBreathAnimation()` and repeat it 20 times.

```js
const breathAnimationWhite = buildBreathAnimation('111111', '000000', 30, 1200);
this.alexaSkill().gadgetController()
    .setNoneTriggerEvent()
    .setAnimations(
        [{
            "repeat": 20,
            "targetLights": ["1"],
            "sequence": breathAnimationWhite
        }]
    )
.setLight([], 0, []); // Let's ignore these parameters for now
```

Now we can add a text (with a sound effect) and send the request using either the `gameEngine` or the `gadgetController`'s `respond()` method. We can't use the regular `ask()` method at this point, because in the response, the `shouldEndSession` attribute has to be deleted.


```js
this.speech
    .addAudio('https://s3.amazonaws.com/ask-soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_intro_01.mp3')
    .addText('Hello there! Show me your sweet buttons!');

this.alexaSkill().gameEngine().respond(
    this.speech
);
```
### Responding to game engine events

For processing button requests, the Jovo framework has a `ON_GAME_ENGINE_INPUT_HANDLER_EVENT()` handler. What it does is first to extract the event name, which is one of those we defined in the input handler (or game engine object) earlier, i.e. either `buttonDownEvent` or `timeoutEvent`.

The `timeoutEvent` is the easy case, in which we say goodbye and quit the demo:
```js
const inputEvent = this.request().getEvents()[0];
const eventName = inputEvent.name;
console.log(`Event name: ${eventName}`);

if (
    eventName === 'timeoutEvent'
) {
    this.tell(
        'This was it. Thanks!'
        + `<audio src='https://s3.amazonaws.com/ask-soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_outro_01.mp3'/>`
    );
}
```

In case of the `buttonDownEvent`, there are two different cases we need to cover: Either a 'new' button is pressed for the first time, or a 'known' button has been pressed more then once.

In case of a new button, we assign it an index `buttonNumber`, add a greeting and build a new colored animation with one of the colors stored in the `BUTTON_COLORS` array:

```js
this.speech
    .addAudio(
        `https://s3.amazonaws.com/ask-soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_player${buttonNumber}_01.mp3`
    )
    .addText(`Welcome, button ${buttonNumber}!`);
const breathAnimation = buildBreathAnimation(BUTTON_COLORS[buttonNumber - 1], '000000', 30, 1200);
```

Now we change the button's animation by changing the configuration of the gadget controller for only the respective button, using the animation we just created:

```js
this.alexaSkill().gadgetController()
    .setNoneTriggerEvent()
    .setAnimations(
        [{
            "repeat": 20,
            "targetLights": ["1"],
            "sequence": breathAnimation
        }]
    )
    .setLight(
        [buttonId], // This applies the new animation to only this button
        0,
        []
    );
```
This was it, now we can again send the response using the `this.alexaSkill().gadgetController().respond()` method .
**Short summary**: The input handler for the game engine we defined initially, as well as the gadget controller settings we made for the other buttons are still active. We only changed the idle animation of one single button.
We could also change the animations for the specific button's `'buttonUp'` and `'buttonDown'` event, but this is beyond the scope of this simple demo.

In case of a known button, don't make changes in the game engine or gadget controller settings at all, but only add a simple sound effect, delete the `shouldEndSession()` attribute and send the response.:
```js
this.speech.addAudio(
    'https://s3.amazonaws.com/ask-soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_02.mp3'
);
this.alexaSkill().gadgetController().respond(
    this.speech
);
```

For the `timeoutEvent`, we simply send a goodbye message and end the session:
```js
this.speech
    .addText('This was it. Thanks!')
    .addAudio('https://s3.amazonaws.com/ask-soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_outro_01.mp3');
this.tell(
    this.speech
);
```

Congratulations for your first Echo Button Skill! :)