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
        this.ask('Which Skill Item do you want to buy?');
    },

    'BuySkillItemIntent': function(productName) {
        let productReferenceName = productName.id;
        this.alexaSkill()
            .inSkillPurchase()
            .getProductByReferenceName(productReferenceName, (error, product) => {
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
                if (product.entitled !== 'ENTITLED') {
                    this.tell('You have not bought this item yet.');
                } else {
                    this.alexaSkill().inSkillPurchase().cancel(product.productId);
                }
            });
    },

    'ON_PURCHASE': function() {
        console.log('Payload:', this.alexaSkill().inSkillPurchase().getPayload());
        this.tell(this.alexaSkill().inSkillPurchase().getPurchaseResult());
    },

    'Unhandled': function() {
        this.toIntent('LAUNCH');
    },

});

module.exports.app = app;
