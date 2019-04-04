[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Template: Alexa In-Skill Purchases

Jovo Sample Alexa Skill that uses In-Skill Purchasing.

```text
$ jovo new <directory> --template alexa/isp
```

This template contains:

* A language model (`models/en-US.json`) that contains a `BuySkillItemIntent` and a `RefundSkillItemIntent` with an input type `PRODUCT_NAMES` that contains the products specified inside the `/ispTemplates` folder
* App logic (`app/app.js`) that uses the Jovo implementation of Alexa In-Skill Purchasing for a sample purchase and refund process

To use the template you have to initialize and deploy the products, which you find a detailed tutorial about [here](https://www.jovo.tech/tutorials/alexa-in-skill-purchasing)


