import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

import * as amazonPay from './amazonPay';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
  new Alexa(),
  new JovoDebugger(),
  new FileDb(),
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  async LAUNCH() {
    const options = {
      sellerId: 'YOUR SELLER ID', // TODO
      sandbox: true,
      sandboxEmail: 'YOUR TEST ACCOUNT EMAIL' // TODO
    };

    const response = await this.$alexaSkill!.$user.getDefaultBuyerAddress(options);
    if (amazonPay.canShipToUser(response)) {
      return this.ask('Welcome to my store. Would you like to buy a t shirt for 19.99 Euro?');
    } else {
      return this.tell('I\'m sorry, we don\'t ship to your location. Have a nice day.');
    }
  },

  /**
   * User wants to buy a t shirt
   */
  YesIntent() {
    if (this.$alexaSkill!.isAmazonPayPermissionDenied()) {
      this.$alexaSkill!.showAskForAmazonPayPermissionCard();
      return this.tell('Please provide the permission to use Amazon Pay using the card I\'ve send to your Alexa app and restart the skill.');
    } else {
      const setupDirective = {
        type: 'Connections.SendRequest',
        name: 'Setup',
        payload: {
          '@type': 'SetupAmazonPayRequest',
          '@version': '2',
          sellerId: 'YOUR SELLER ID', // TODO
          countryOfEstablishment: 'DE', // TODO
          ledgerCurrency: 'EUR', // TODO
          checkoutLanguage: 'en_US',
          billingAgreementAttributes: {
            '@type': 'BillingAgreementAttributes',
            '@version': '2',
            billingAgreementType: 'CustomerInitiatedTransaction', // TODO EU merchants only
            sellerNote: 'Billing Agreement Seller Note',
            sellerBillingAgreementAttributes: {
              '@type': 'SellerBillingAgreementAttributes',
              '@version': '2',
              storeName: 'Test store name',
              customInformation: 'Test custom information', // any kind of additional information you want to include
            }
          },
          needAmazonShippingAddress: true,
          sandboxMode: true,
          sandboxCustomerEmailId: 'YOUR TEST ACCOUNT EMAIL' // TODO
        },
        token: 'token'
      };

      return this.$alexaSkill!.addDirective(setupDirective);
    }
  },

  /**
   * User doesn't want to buy a t shirt
   */
  NoIntent() {
    return this.tell('Ok, see you next time');
  },

  /**
   * User wants to cancel their order
   */
  CancelOrderIntent() {
    this.showSimpleCard('Cancel Your Order', 'To cancel your order send an email to help@mail.com');
    return this.tell('To cancel your order send an email to help at mail dot com with your order id. I\'ve send the details to your Alexa app');
  },

  /**
   * User wants to request a refund for their order
   */
  RefundOrderIntent() {
    this.showSimpleCard('Refund Your Order', 'To request a refund send an email to help@mail.com');
    return this.tell('To request a refund send an email to help at mail dot com with your order id. I\'ve send the details to your Alexa app');
  },

  /**
   * Responses to the `Setup` and `Charge` directive are routed to the `ON_PURCHASE` intent
   */
  ON_PURCHASE() {
    const request = this.$request!.toJSON();

    if (request.request.name === 'Setup') { // response to setup directive
      return amazonPay.handleSetupResponse(this);
    } else if (request.request.name === 'Charge') { // response to charge directive
      return amazonPay.handleChargeResponse(this);
    } else {
      // In-Skill_Purchase responses are also routed to ON_PURCHASE.
      // should be handled as well.
    }
  },
});

export { app };
