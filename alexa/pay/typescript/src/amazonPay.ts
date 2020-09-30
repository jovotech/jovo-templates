import {BuyerAddress} from 'jovo-platform-alexa';
import { Jovo } from 'jovo-framework';

import * as helper from './helper';


/**
 * @param {Jovo} jovo 
 */
export function handleChargeResponse(jovo: Jovo) {
  const request = jovo.$request!.toJSON();
  const responseStatusCode = request.request.status.code;
  if (responseStatusCode != 200) {
    /**
     * Check the documentation on how to handle each reason:
     * https://developer.amazon.com/en-US/docs/alexa/amazon-pay-alexa/payment-declines-and-processing-errors.html
     */
    console.log(request.request);
    return jovo.tell('There was an error. Check the logs');
  }

  const payload = request.request.payload;
  if (payload.authorizationDetails.state === 'Declined') {
    console.log(payload);
    /**
     * Check the documentation on how to handle each reason:
     * https://developer.amazon.com/en-US/docs/alexa/amazon-pay-alexa/payment-declines-and-processing-errors.html#decline-handling
     */
    return jovo.tell('There was an error processing your order. Please try again later');
  } else {
    if (!jovo.$user.$data.orders) {
      jovo.$user.$data.orders = [jovo.$user.$data.order];
    } else {
      jovo.$user.$data.orders.push(jovo.$user.$data.order);
    }

    delete jovo.$user.$data.order;

    return jovo.tell('Your order for a t shirt for 19.99 Euro is complete. You will receive an email and card in your Alexa app with the details');
  }
}

/**
 * @param {Jovo} jovo 
 */
export function handleSetupResponse(jovo: Jovo) {
  const request = jovo.$request!.toJSON();
  const responseStatusCode = request.request.status.code;

  if (responseStatusCode != 200) {
    /**
     * Check the documentation on how to handle each reason:
     * https://developer.amazon.com/en-US/docs/alexa/amazon-pay-alexa/payment-declines-and-processing-errors.html
     */
    console.log(request.request);
    return jovo.tell('There was an error. Check the logs');
  }
  const sellerOrderId = helper.generateRandomString(9);
  const authorizationReferenceId = helper.generateRandomString(9);
  const amount = '19.99';
  const currencyCode = 'EUR';

  const payload = request.request.payload;

  const chargeDirective = {
    type: 'Connections.SendRequest',
    name: 'Charge',
    payload: {
      '@type': 'ChargeAmazonPayRequest',
      '@version': '2',
      sellerId: 'YOUR SELLER ID', // TODO
      billingAgreementId: payload.billingAgreementDetails.billingAgreementId,
      paymentAction: 'AuthorizeAndCapture',
      authorizeAttributes: {
        '@type': 'AuthorizeAttributes',
        '@version': '2',
        authorizationReferenceId,
        authorizationAmount: {
          '@type': 'Price',
          '@version': '2',
          amount,
          currencyCode
        },
        transactionTimeout: 0,
        sellerAuthorizationNote: 'Test Seller Authorization Note'
      },
      sellerOrderAttributes: {
        '@type': 'SellerOrderAttributes',
        '@version': '2',
        storeName: 'Test Store Name',
        customInformation: 'Test custom information',
        sellerNote: 'Test seller note',
        sellerOrderId // should be saved in db. Otherwise can't follow up on support requests
      }
    },
    token: 'correlationToken'
  };

  jovo.$user.$data.order = {
    id: sellerOrderId,
    productId: '000001', // in your own skill you need a system to identify each product.
    billingAgreementId: payload.billingAgreementDetails.billingAgreementId,
    authorizationReferenceId
  };

  return jovo.$alexaSkill!.addDirective(chargeDirective);
}

/**
 * Returns true if we can ship to the user's address
 * @param {BuyerAddress} address 
 */
export function canShipToUser(address?: BuyerAddress): boolean {
  // We can't provide a universal implementation here since it's different for every project.
  // You should check whether you can even ship to the user before you make an offer.

  return true;
}
