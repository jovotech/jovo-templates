[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Template: Send a SMS on Twilio Autopilot

Jovo Sample Autopilot Bot that can send a SMS to the user.

```sh
$ jovo new <directory> --template autopilot/sms
```

After that, you have to add some of your own Twilio account data to the handler. You can find the current placeholder values by searching for "<" in the `app.js` file.

We use a simple flow with a Send Message widget triggered by the REST API:

![SMS Flow](img/sms-flow.png)