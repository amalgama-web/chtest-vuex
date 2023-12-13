<template>
    <div id="app" class="cart-form">

        <div class="cart-form__inputs">

            <div class="cart-form__col">
                <input class="cart-form__input"
                       type="text"
                       :value="price"
                       @input="onInputChangeDebounced('price', $event.target.value)"
                       placeholder="Price">
                <div class="value-title">Price:</div>
                <div>{{ price }}</div>
            </div>

            <div class="cart-form__col">
                <input class="cart-form__input"
                       type="text"
                       :value="quantity"
                       @input="onInputChangeDebounced('quantity', $event.target.value)"
                       placeholder="Quantity">
                <div class="value-title">Quantity:</div>
                <div>{{ quantity }}</div>
            </div>

            <div class="cart-form__col">
                <input class="cart-form__input"
                       type="text"
                       :value="amount"
                       @input="onInputChangeDebounced('amount', $event.target.value)"
                       placeholder="Amount">
                <div class="value-title">Amount:</div>
                <div>{{ amount }}</div>
            </div>

            <div class="cart-form__col">
                <button class="cart-form__btn"
                        @click="submitForm"
                        :disabled="formInProcess">
                    Send
                </button>
                <div class="value-title">Saved data:</div>
                <div v-if="savedData" class="cart-form__code">{{ savedDataJSON }}</div>
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
import { debounce } from '@/helpers/utils';
import { mockApi } from '@/api/mockApi';

function setStoreProp(propName, value) {
    window.localStorage.setItem(propName, value)
}

function getStoreProp(propName) {
    return window.localStorage.getItem(propName)
}

function getNumberFromStore(propName) {
    const value = getStoreProp(propName);
    if (value === null) return null;
    return +value;
}

const initialInputsMutationOrder = ['price', 'quantity', 'amount']
export default {
    name: 'App', data() {
        return {
            price: 1,
            quantity: 2,
            amount: 3,
            nonce: 0,

            savedData: null,

            log: [],
            inputsMutationOrder: initialInputsMutationOrder,

            formInProcess: false,
        }
    },

    computed: {
        earlierMutatedInput() {
            return this.inputsMutationOrder[2];
        },

        savedDataJSON() {
            return JSON.stringify(this.savedData)
        },

        triggerForUpdateServiceDataInStore() {
            return {
                price: this.price,
                quantity: this.quantity,
                amount: this.amount,
                nonce: this.nonce,
                log: this.log,
                mutationOrder: this.inputsMutationOrder
            }
        }
    },

    methods: {
        calcEarlierModifiedField() {
            this['calc_' + this.earlierMutatedInput]()
        },

        calc_price() {
            this.price = this.amount / this.quantity
        },
        calc_quantity() {
            this.quantity = this.amount / this.price
        },
        calc_amount() {
            this.amount = this.price * this.quantity
        },

        addLog(message, status) {
            this.log.unshift({
                message, status
            });
        },

        submitForm() {
            this.addLog(`Send form data. Current saved data: ${this.savedDataJSON}`);
            this.sendData();
        },

        sendData() {
            this.formInProcess = true;
            mockApi({
                nonce: this.nonce,
                price: this.price,
                quantity: this.quantity,
                amount: this.amount
            }).then(({data}) => {
                this.savedData = {
                    nonce: data.nonce,
                    price: data.price,
                    quantity: data.quantity,
                    amount: data.amount
                };
                this.addLog(`Data saved successfully. New data: ${this.savedDataJSON}`, 'success');
                this.saveCartInStore();
                this.nonce++;

            }).catch(() => {
                this.addLog(`Error. Try later...`, 'error')
            }).finally(() => {
                this.formInProcess = false;
            })

        },

        saveCartInStore() {
            setStoreProp('nonce', this.savedData.nonce)
            setStoreProp('price', this.savedData.price)
            setStoreProp('quantity', this.savedData.quantity)
            setStoreProp('amount', this.savedData.amount)
        },

        saveAppServiceDataInStore() {
            const data = {
                log: this.log,
                inputsMutationOrder: this.inputsMutationOrder,
                currentValues: {
                    price: this.price,
                    quantity: this.quantity,
                    amount: this.amount,
                    nonce: this.nonce
                }
            }
            setStoreProp('appServiceData', JSON.stringify(data))
        },

        updateMutationOrder(fieldName) {
            this.inputsMutationOrder = this.inputsMutationOrder.filter(item => item !== fieldName);
            this.inputsMutationOrder.unshift(fieldName);
        },

        initDataFromStore() {
            this.savedData = {
                nonce: getNumberFromStore('nonce'),
                price: getNumberFromStore('price'),
                quantity: getNumberFromStore('quantity'),
                amount: getNumberFromStore('amount')
            }
            let appServiceData = getStoreProp('appServiceData');
            if (appServiceData !== null) {
                appServiceData = JSON.parse(appServiceData)
                const {currentValues, log, inputsMutationOrder} = appServiceData;

                this.log = log || null;
                this.inputsMutationOrder = inputsMutationOrder || initialInputsMutationOrder;

                this.price = currentValues?.price || null;
                this.quantity = currentValues?.quantity || null;
                this.amount = currentValues?.amount || null;
                this.nonce = currentValues?.nonce || 0;
            }
        },

    },

    watch: {
        triggerForUpdateServiceDataInStore() {
            this.saveAppServiceDataInStore();
        }
    },

    created() {
        this.onInputChangeDebounced = debounce((inputName, val) => {
            this[inputName] = +val;
            this.updateMutationOrder(inputName);
            this.calcEarlierModifiedField();
            this.addLog(`Input ${inputName} was changed`);
        })

        this.initDataFromStore();
    },

}
</script>

<style src="./styles/app.css"></style>
