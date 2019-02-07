'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        this.ask('You can buy an item saying: buy "product name", or refund an item saying: refund "product name". What would you like to do?');
    },

    async UpsellIntent() {
        let productReferenceName = 'frozen_sword';

        const product = await this.$alexaSkill.$inSkillPurchase.getProductByReferenceName(productReferenceName);
        console.log(product);

        if (product.entitled === 'ENTITLED') {
            return this.tell('You have already bought this item.');
        } else {
            let prompt = 'The frozen sword will help you on your journey. Are you interested?';
            let token = 'testToken';
            this.$alexaSkill.$inSkillPurchase.upsell(product.productId, prompt, token);
        }
    },

    async BuySkillItemIntent() {
        let productName = this.$inputs.ProductName;
        if (!productName) {
            return this.ask('You can choose either the "premium pass", or "frozen sword". Which are you interested in?');
        }
        let productReferenceName = productName.id;
        let token = 'testToken';
        
        const product = await this.$alexaSkill.$inSkillPurchase.getProductByReferenceName(productReferenceName);
        console.log(product);

        if (product.entitled === 'ENTITLED') {
            return this.tell('You have already bought this item.');
        } else {
            this.$alexaSkill.$inSkillPurchase.buy(product.productId, token);
        }
    },

    async RefundSkillItemIntent() {
        let productName = this.$inputs.ProductName;
        let productReferenceName = productName.id;
        let token = 'testToken';

        const product = await this.$alexaSkill.$inSkillPurchase.getProductByReferenceName(productReferenceName)
        console.log(product);

        if (product.entitled !== 'ENTITLED') {
            return this.tell('You have not bought this item yet.');
        } else {
            this.$alexaSkill.$inSkillPurchase.cancel(product.productId, token);
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
    }
});

module.exports.app = app;
