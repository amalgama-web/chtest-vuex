<template>
    <div id="app" class="cart-form">

        <div class="cart-form__inputs">

            <div class="cart-form__col">
                <input class="cart-form__input"
                       type="text"
                       :value="currentPrice"
                       @input="onInputChangeDebounced('currentPrice', $event.target.value)"
                       placeholder="Price">
                <div class="value-title">Price:</div>
                <div>{{ currentPrice }}</div>
            </div>

            <div class="cart-form__col">
                <input class="cart-form__input"
                       type="text"
                       :value="currentQuantity"
                       @input="onInputChangeDebounced('currentQuantity', $event.target.value)"
                       placeholder="Quantity">
                <div class="value-title">Quantity:</div>
                <div>{{ currentQuantity }}</div>
            </div>

            <div class="cart-form__col">
                <input class="cart-form__input"
                       type="text"
                       :value="currentAmount"
                       @input="onInputChangeDebounced('currentAmount', $event.target.value)"
                       placeholder="Amount">
                <div class="value-title">Amount:</div>
                <div>{{ currentAmount }}</div>
            </div>

            <div class="cart-form__col">
                <button class="cart-form__btn"
                        @click="submit"
                        :disabled="formInProcess">
                    Send
                </button>
                <div class="value-title">Saved data:</div>
                <div class="cart-form__code">{{ savedDataJSON }}</div>
            </div>

        </div>

        <div class="cart-form__log">
            <span class="cart-form__log-title">Logs</span>

            <div v-if="log.length">
                <p v-for="(logItem, index) in log"
                   :key="index + logItem.message"
                   :class="logItem.status ? logItem.status : ''">
                    {{ logItem.message }}
                </p>
            </div>
            <p v-else class="cart-form__log-placeholder">Events logging</p>
        </div>

    </div>
</template>

<script>
import { debounce, capitalizeFirstLetter } from '@/helpers/utils';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    name: 'App',

    data() {
        return {
            formInProcess: false,
        }
    },

    computed: {

        ...mapState([
            'currentPrice',
            'currentQuantity',
            'currentAmount',
            'currentNonce',

            'price',
            'quantity',
            'amount',
            'nonce',

            'log',
            'inputsMutationOrder'
        ]),

        earlierMutatedInput() {
            return this.inputsMutationOrder[2];
        },

        calculatingInput() {
            const nullInputs = this.inputsMutationOrder.filter(inputName => {
                return this[inputName] === null;
            })

            //  do nothing if filled only one input
            if (nullInputs.length === 2) {
                return null;
            }

            // if only one input haven't edited - calc value for it
            if (nullInputs.length === 1) {
                return nullInputs[0];
            }

            return this.earlierMutatedInput;
        },

        savedDataJSON() {
            return JSON.stringify({
                nonce: this.nonce,
                price: this.price,
                quantity: this.quantity,
                amount: this.amount
            });
        },

        currentDataJSON() {
            return JSON.stringify({
                nonce: this.currentNonce,
                price: this.currentPrice,
                quantity: this.currentQuantity,
                amount: this.currentAmount
            });
        },
    },

    methods: {
        ...mapMutations([
            'setCurrentPrice',
            'setCurrentQuantity',
            'setCurrentAmount',
            'setCurrentNonce',

            'addLog',
            'updateMutationOrder'
        ]),

        ...mapActions(['sendData']),

        calcInputValue() {
            if (this.calculatingInput === null) {
                return;
            }

            this[`calc${capitalizeFirstLetter(this.calculatingInput)}`]();
        },

        calcCurrentPrice() {
            if (this.currentAmount === '' || this.currentQuantity === '' || +this.currentQuantity === 0) {
                return;
            }
            this.setCurrentPrice(String(this.currentAmount / this.currentQuantity));
        },

        calcCurrentQuantity() {
            if (this.currentAmount === '' || this.currentPrice === '' || +this.currentPrice === 0) {
                return;
            }
            this.setCurrentQuantity(String(this.currentAmount / this.currentPrice));
        },

        calcCurrentAmount() {
            if (this.currentPrice === '' || this.currentQuantity === '') {
                return;
            }
            this.setCurrentAmount(String(this.currentPrice * this.currentQuantity));
        },

        submit() {
            this.addLog({message: `Send form data. Payload: ${this.currentDataJSON} Current saved data: ${this.savedDataJSON}`});
            this.formInProcess = true;

            this.sendData({
                nonce: this.currentNonce,
                price: this.currentPrice,
                quantity: this.currentQuantity,
                amount: this.currentAmount
            }).then(() => {
                this.addLog({message: `Data saved successfully. New data: ${this.savedDataJSON}`, status: 'success'});
            }).catch(() => {
                this.addLog({message: `Error. Try later...`, status: 'error'})
            }).finally(() => {
                this.formInProcess = false;
            })
        },
    },

    created() {
        this.onInputChangeDebounced = debounce((inputName, val) => {
            this[`set${capitalizeFirstLetter(inputName)}`](val);
            this.updateMutationOrder(inputName);
            this.calcInputValue();
            this.addLog({message: `Input ${inputName.replace('current', '')} was changed`});
        })
    },

}
</script>

<style src="./styles/app.css"></style>
