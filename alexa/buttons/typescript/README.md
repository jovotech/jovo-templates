# Jovo Template: Alexa Buttons Demo

This template contains a Jovo Sample Alexa Skill in TypeScript, that uses the [Game Engine](https://developer.amazon.com/docs/custom-skills/game-engine-interface-reference.html) and [Gadget Controller Interfaces](https://developer.amazon.com/docs/custom-skills/gadget-controller-interface-reference.html) of the Gadgets Skill API.

Actual Echo Buttons are not required to run this template, as they can be simulated in the Alexa developer console.

## Quick Start

To use the Jovo Templates, you'll need the Jovo CLI. You can install it globally with NPM.

```sh
$ npm install -g jovo-cli
```

### Create your project

After successfully installing the Jovo CLI, you can install the template using one of the following commands:

```sh
$ jovo new <directory> --template alexa/buttons --language typescript
```

> Read more about `jovo new` [here](https://www.jovo.tech/marketplace/jovo-cli#jovo-new).

Go into the project directory and build the platform-specific configuration for an Alexa Skill with Echo Buttons:

```sh
# Change working directory to your previously specified directory.
$ cd <directory>

# Build platform-specific files.
$ jovo build --platform alexaSkill

# Since we only use Alexa as a platform, you can use this short version as well.
$ jovo build
```

> Read more about `jovo build` [here](https://www.jovo.tech/marketplace/jovo-cli#jovo-build).

This will use the information in the `app.json` file to write the right information into the Alexa `skill.json` that will be used in the next step.

### Deploy the skill

The Skill is now ready to be deployed to the Amazon Developer console:

```sh
# Deploy skill.
$ jovo deploy --platform alexaSkill

# Again, you can also use the short version.
$ jovo deploy
```

> Read more about `jovo deploy` [here](https://www.jovo.tech/marketplace/jovo-cli#jovo-deploy).

### Run the Jovo Webhook

Now that your skill is deployed to the Alexa Skills Console, you can go ahead and run the Jovo Webhook:

```sh
# Run voice app, optionally with a --watch flag to restart on code changes.
$ jovo run [-w]
```

> Read more about `jovo run` [here](https://www.jovo.tech/marketplace/jovo-cli#jovo-run).

If you now go to the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask), you can test your skill directly in the skill console. If you even happen to own Echo Buttons, you can test the skill on the device the buttons are paired with.

![Debugger Example](../img/skills-console.gif)

## Next Steps

Now that you got the template running, it's time to take a look at what the code is actually doing. You can find a whole tutorial on building an Alexa Skill with Echo Buttons [here](https://www.jovo.tech/tutorials/alexa-echo-buttons).

To see what else you can do with the Jovo Framework, take a look at the [Jovo Documentation](https://www.jovo.tech/docs/).

## About Jovo

Jovo is the most popular development framework for voice, including platforms like Alexa, Google Assistant, mobile apps, and Raspberry Pi.

- [Jovo Website](https://jovo.tech/)
- [Documentation](https://jovo.tech/docs/)
- [Marketplace](https://www.jovo.tech/marketplace/)
- [Twitter](https://twitter.com/jovotech/)
- [Forum](https://community.jovo.tech/)
