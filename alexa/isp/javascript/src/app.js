'use strict';

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

console.log('This template uses an outdated version of the Jovo Framework. We strongly recommend upgrading to Jovo v4. Learn more here: https://www.jovo.tech/docs/migration-from-v3');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

// prettier-ignore
app.use(
  new Alexa(), 
  new JovoDebugger(), 
  new FileDb(),
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  LAUNCH() {
    this.ask(
      'You can buy an item saying something like "Alexa, buy "product name"", ' +
        'or refund an item saying "Alexa, refund "product name"". What would you like to do?',
      'What would you like to do?'
    );
  },

  async BuySkillItemIntent() {
    const productName = this.$inputs.productName;
    console.log(productName);

    if (!productName) {
      return this.ask('You can choose either the "premium pass", or "frozen sword". Which are you interested in?');
    }

    const productReferenceName = productName.id;
    const token = 'testToken';
    console.log(productReferenceName);

    const product = await this.$alexaSkill.$inSkillPurchase.getProductByReferenceName(productReferenceName);
    console.log(product);

    if (product.entitled === 'ENTITLED') {
      this.tell('You have already bought this item.');
    } else {
      this.$alexaSkill.$inSkillPurchase.buy(product.productId, token);
      this.tell(`You have successfully bought ${productName.value}.`);
    }
  },

  async RefundSkillItemIntent() {
    const productName = this.$inputs.productName;

    if (!productName) {
      return this.ask('You can choose either the "premium pass", or "frozen sword". Which one do you want to refund?');
    }

    const productReferenceName = productName.id;
    const token = 'testToken';

    const product = await this.$alexaSkill.$inSkillPurchase.getProductByReferenceName(productReferenceName);
    console.log(product);

    if (product.entitled !== 'ENTITLED') {
      this.tell('You have not bought this item yet.');
    } else {
      this.$alexaSkill.$inSkillPurchase.cancel(product.productId, token);
      this.tell(`You have succesfully refunded ${productName.value}.`);
    }
  },

  ON_PURCHASE() {
    const name = this.$request.name;
    const productId = this.$alexaSkill.$inSkillPurchase.getProductId();
    const purchaseResult = this.$alexaSkill.$inSkillPurchase.getPurchaseResult();
    const token = this.$request.token;

    switch (name) {
      case 'Cancel':
        // Refund transaction finished
        break;
      case 'Buy':
        // Buy transaction finished
        break;
      case 'Upsell':
        // Upsell transaction finished
        break;
    }
  },
});

module.exports = { app };
