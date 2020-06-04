import {App} from 'jovo-framework';
import {Alexa, AlexaRequest} from 'jovo-platform-alexa';
import {JovoDebugger} from 'jovo-plugin-debugger';
import {FileDb} from 'jovo-db-filedb';

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
    LAUNCH() {
        this.ask('You can buy an item saying: buy "product name", or refund an item saying: refund "product name". What would you like to do?');
    },

    async UpsellIntent() {
        let productReferenceName = 'frozen_sword';

        if (this.$alexaSkill && this.$alexaSkill.$inSkillPurchase) {
            const product = await this.$alexaSkill.$inSkillPurchase.getProductByReferenceName(productReferenceName);
            console.log(product);

            if (product.entitled === 'ENTITLED') {
                return this.tell('You have already bought this item.');
            } else {
                let prompt = 'The frozen sword will help you on your journey. Are you interested?';
                let token = 'testToken';
                this.$alexaSkill.$inSkillPurchase.upsell(product.productId, prompt, token);
            }
        }
        return;
    },

    async BuySkillItemIntent() {
        let productName = this.$inputs.productName;
        if (!productName) {
            return this.ask('You can choose either the "premium pass", or "frozen sword". Which are you interested in?');
        }
        let productReferenceName = productName.id;
        let token = 'testToken';
        if (this.$alexaSkill && this.$alexaSkill.$inSkillPurchase) {
            const product = await this.$alexaSkill.$inSkillPurchase.getProductByReferenceName(productReferenceName!);
            console.log(product);

            if (product.entitled === 'ENTITLED') {
                return this.tell('You have already bought this item.');
            } else {
                this.$alexaSkill.$inSkillPurchase.buy(product.productId, token);
            }
        }
        return;
    },

    async RefundSkillItemIntent() {
        let productName = this.$inputs.productName;
        let productReferenceName = productName.id;
        let token = 'testToken';

        if (this.$alexaSkill && this.$alexaSkill.$inSkillPurchase) {
            const product = await this.$alexaSkill.$inSkillPurchase.getProductByReferenceName(productReferenceName!);
            console.log(product);

            if (product.entitled !== 'ENTITLED') {
                return this.tell('You have not bought this item yet.');
            } else {
                this.$alexaSkill.$inSkillPurchase.cancel(product.productId, token);
            }
        }
        return;
    },

    ON_PURCHASE() {
        if (this.$alexaSkill && this.$alexaSkill.$inSkillPurchase) {
            const name = (this.$request as AlexaRequest).request!.name;
            const productId = this.$alexaSkill.$inSkillPurchase.getProductId();
            const purchaseResult = this.$alexaSkill.$inSkillPurchase.getPurchaseResult();
            const token = (this.$request as AlexaRequest).request!.token;

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
    },
});

export {app};
