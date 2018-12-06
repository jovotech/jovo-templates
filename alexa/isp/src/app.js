
const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);

app.setHandler({
    LAUNCH() {
        this.toIntent('UpsellIntent');
    },
    async UpsellIntent() {
        console.log('UpsellIntent');
        let productReferenceName = 'frozen_sword';

        await this.$alexaSkill.$inSkillPurchase.getProductByReferenceName(productReferenceName)
            .then((product) => {
                console.log(product);
                if (product.entitled === 'ENTITLED') {
                    return this.tell('You have already bought this item.');
                } else {
                    let prompt = 'The frozen sword will help you on your journey. Are you interested?';
                    let token = 'testToken';
                    this.$alexaSkill.$inSkillPurchase.upsell(product.productId, prompt, token);
                    console.log(this.$output);
                }
            });
    },

    // Ungetestet:
    
    BuySkillItemIntent() {
        let productName = this.getInput('productName');
        if (!productName) {
            return this.ask('You can choose either the premium pass. or frozen sword. Which are you interested in?');
        }
        let productReferenceName = productName.id;
        this.$alexaSkill.inSkillPurchase()
            .getProductByReferenceName(productReferenceName, (error, product) => {
                if (error) {
                    console.log(error);
                }
                if (product.entitled === 'ENTITLED') {
                    return this.tell('You have already bought this item.');
                }
                this.$alexaSkill.inSkillPurchase().buy(product.productId);
            });
    },
    RefundSkillItemIntent() {
        let productName = this.getInput('productName');
        let productReferenceName = productName.id;
        this.$alexaSkill.inSkillPurchase()
            .getProductByReferenceName(productReferenceName, (error, product) => {
                if (error) {
                    console.log(error);
                }
                if (product.entitled === 'ENTITLED') {
                    return this.tell('You have not bought this item yet.');
                }
                this.$alexaSkill.inSkillPurchase().cancel(product.productId);
            });
    },
    ON_PURCHASE() {
        const name = this.$request.name;
        const productId = this.$alexaSkill.$inSkillPurchase.getProductId();
        const purchaseResult = this.$alexaSkill.$inSkillPurchase.getPurchaseResult();
        const token = this.$request.token;
    
        if (purchaseResult === 'ACCEPTED') {
            this.tell('Great! Let\'s use your new item');
        } else {
            this.tell('Okay. Let\'s continue where you left off.');
        }
    }
});

module.exports.app = app;
