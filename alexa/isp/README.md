[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Template: Alexa In-Skill Purchases

Jovo Sample Alexa Skill that uses In-Skill Purchasing.

This template contains:

* A language model (`models/en-US.json`) that contains a `BuySkillItemIntent` and a `RefundSkillItemIntent` with a slot `LIST_OF_PRODUCT_NAMES` that contains one product called `cave_quest`
* App logic (`app/app.js`) that uses the Jovo implementation of Alexa In-Skill Purchasing for a sample purchase and refund process


What you need to do:

* [Create Project](#create-project)
* [Add Product with ASK CLI](#add-product-with-ask-cli)
* [Run Jovo Webhook](#run-jovo-webhook)



## Create Project

Create a new project from this template:

```sh
$ jovo new <directory> --template alexa/isp
```

Go into the project directory and create a platform specific folder for Alexa:

```sh
$ cd <directory>

# Initialize Alexa Platform
$ jovo init alexaSkill

# Create Platfom Project Files
$ jovo build
```

## Add Product with ASK CLI

We're using the official ASK CLI to add a new product. To make it work, first go into the Alexa platform project folder:

```sh
$ cd platforms/alexaSkill
```

We're going to add one product and call it `cave_quest` similar to the example in the [official Amazon Docs](https://developer.amazon.com/docs/in-skill-purchase/use-the-cli-to-manage-in-skill-products.html).

```sh
$ ask add isp

? List of in-skill product types you can chose (Use arrow keys)
❯ Entitlement 
  Subscription 

? List of in-skill product templates you can chose (Use arrow keys)
> Entitlement_Template

? Please type in your new in-skill product name:
 cave_quest
In-skill product cave_quest is saved to ./isps/entitlement/cave_quest.json
```

Now open this newly created file and update it with information. Here is a template you can use to get started:

```javascript
{
  "version": "1.0",
  "type": "ENTITLEMENT",
  "referenceName": "cave_quest",
  "publishingInformation": {
    "locales": {
      "en-US": {
        "name": "Cave Quest",
        "smallIconUri": "https://s3.amazonaws.com/jovocards/logo108.png",
        "largeIconUri": "https://s3.amazonaws.com/jovocards/logo512.png",
        "summary": "This is a really great quest.",
        "description": "Play this new quest. In a cave!",
        "examplePhrases": [
          "Alexa, buy cave quest"
        ],
        "keywords": [
          "cave",
          "quest"
        ],
        "customProductPrompts": {
          "purchasePromptDescription": "Do you want to purchase Cave Quest?",
          "boughtCardDescription": "Congrats. You successfully purchased Cave Quest!"
        }
      }
    },
    "distributionCountries": [
      "US"
    ],
    "pricing": {
      "amazon.com": {
        "releaseDate": "2018-05-14",
        "defaultPriceListing": {
          "price": 0.99,
          "currency": "USD"
        }
      }
    },
    "taxInformation": {
      "category": "SOFTWARE"
    }
  },
  "privacyAndCompliance": {
    "locales": {
      "en-US": {
        "privacyPolicyUrl": "https://www.yourcompany.com/privacy-policy"
      }
    }
  },
  "testingInstructions": "This is an example product.",
  "purchasableState": "PURCHASABLE"
}
```

After saving the file, deploy it with ASK CLI:

```shells
$ ask deploy
```

## Run Jovo Webhook

```sh
# Go back into the root directory of the project
$ cd ../..

# Run Jovo Webhook
$ jovo run
```

You can now test the Skill:

* Invocation name "my purchase app"
* Example for BuySkillItemIntent: "Buy Cave Quest"
* Example for RefundSkillItemIntent: "Return Cave Quest"