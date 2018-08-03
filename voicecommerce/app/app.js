'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);

const {VueStorefrontApi, Reorder, Authentication, inMemoryAuthenticationPersistence} = require('voicecommerce');

// =================================================================================
// App Logic
// =================================================================================

const authentication = new Authentication(inMemoryAuthenticationPersistence);
const api = new VueStorefrontApi({ endpoint: 'https://demo.vuestorefront.io' });

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'ReorderIntent': function() {
        authentication.getUser(this.getAccessToken()).then((user) => {
            if (!user) {
                this.alexaSkill().showAccountLinkingCard();
                this.tell('Please link your account before making purchases');
                return;
            }

            const reorder = new Reorder(api)
            reorder.call(user).then((order) => {
                const productNames = order.products.map((product) => { product.name });
                const address = order.addressInformation.shippingAddress;
                const addressResponse = `${address.street.join(' ')}, ${address.city}`;

                this.tell(`Sending ${productNames.join(', ')} to ${addressResponse}`);
            }).catch((e) => {
                if (e.noPastOrders) {
                    this.tell('You haven\'t made any orders in the past');
                } else {
                    this.tell('There was a problem while placing your order');
                }
            })
        })
    }
});

module.exports.app = app;
