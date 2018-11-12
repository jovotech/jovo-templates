'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('UpsellIntent');
    },
    'UpsellIntent': function() {
        let productReferenceName = 'frozen_sword';
        this.alexaSkill()
        .inSkillPurchase()
        .getProductByReferenceName(productReferenceName, (error, product) => {
            if (error) {
                console.log(error);
            }
            if (product.entitled === 'ENTITLED') {
                this.tell('You have already bought this item.');
                return;
            } else {
                let prompt = 'The frozen sword will help you on your journey. Are you interested?';
                let token = 'testToken';
                this.alexaSkill().inSkillPurchase().upsell(product.productId, prompt, token);
            }
        });
    },
    'BuySkillItemIntent': function(productName) {
        if (!productName) {
            this.ask('You can choose either the premium pass. or frozen sword. Which are you interested in?');
        }
        let productReferenceName = productName.id;
        this.alexaSkill()
            .inSkillPurchase()
            .getProductByReferenceName(productReferenceName, (error, product) => {
                if (error) {
                    console.log(error);
                }
                if (product.entitled === 'ENTITLED') {
                    this.tell('You have already bought this item.');
                    return;
                }
                this.alexaSkill().inSkillPurchase().buy(product.productId);
            });
    },
    'RefundSkillItemIntent': function(productName) {
        let productReferenceName = productName.id;
        this.alexaSkill()
            .inSkillPurchase()
            .getProductByReferenceName(productReferenceName, (error, product) => {
                if (error) {
                    console.log(error);
                    // Continue, where you left off
                }
                if (product.entitled !== 'ENTITLED') {
                    this.tell('You have not bought this item yet.');
                }
                this.alexaSkill().inSkillPurchase().cancel(product.productId);
            });
    },
    'ON_PURCHASE': function() {
        const name = this.request().name;
        const productId = this.alexaSkill().inSkillPurchase().getProductId();
        const purchaseResult = this.alexaSkill().inSkillPurchase().getPurchaseResult();
        const token = this.request().token;
    
        if (purchaseResult === 'ACCEPTED') {
            this.tell('Great! Let\'s use your new item');
        } else {
            this.tell('Okay. Let\'s continue where you left off.');
        }
    },
});

module.exports.app = app;
