# Jovo Template: Plain Text Content

This template contains a Jovo Sample Voice App in TypeScript with a True-or-False-Quiz. It tells you different facts and you have to answer with "true" or "false". For every correct answer, you get a point, for every incorrect answer you lose one. Your total points will be saved and you can open the game again to collect more points.

---

In this project the output speech is just plain-text in the code, it does not use any CMS or i18n.
The quiz statements are stored in a global two-dimensional array, which has for each statement a string and a boolean value.

## Quick Start

To use the Jovo Templates, you'll need the Jovo CLI. You can install it globally with NPM.

```sh
$ npm install -g jovo-cli
```

After successfully installing the Jovo CLI, you can install the template using one of the following commands:

```sh
$ jovo new <directory> --template cms/plain --language typescript
```

> Read more about `jovo new` [here](https://www.jovo.tech/marketplace/jovo-cli#jovo-new).

Change your working directory into your newly created project directory and run your voice app:

```sh
# Change working directory to your previously specified directory.
$ cd <directory>

# Install dependencies.
$ npm install

# Run voice app, optionally with a --watch flag to restart on code changes.
$ jovo run [-w]
```

> Read more about `jovo run` [here](https://www.jovo.tech/marketplace/jovo-cli#jovo-run).

If you now go to the [Jovo Debugger](https://www.jovo.tech/marketplace/jovo-plugin-debugger) by pressing `.` or clicking on the webhook url in the terminal, you can test your voice application right away.

![Debugger Example](./img/debugger.gif)

## Next Steps

Now that you got the template running on the Jovo Debugger, you can enhance your voice app by taking a look at the [i18n documentation](https://www.jovo.tech/docs/output/i18n).

To see what else you can do with the Jovo Framework, take a look at the [Jovo Documentation](https://www.jovo.tech/docs/).

## About Jovo

Jovo is the most popular development framework for voice, including platforms like Alexa, Google Assistant, mobile apps, and Raspberry Pi.

- [Jovo Website](https://jovo.tech/)
- [Documentation](https://jovo.tech/docs/)
- [Marketplace](https://www.jovo.tech/marketplace/)
- [Twitter](https://twitter.com/jovotech/)
- [Forum](https://community.jovo.tech/)
