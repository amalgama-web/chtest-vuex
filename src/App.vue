<template>
    <div id="app" class="cart-form">

        <div class="cart-form__inputs">

            <div class="cart-form__col">
                <input class="cart-form__input"
                       type="text"
                       :value="price"
                       @input="updateField('price', $event.target.value)"
                       placeholder="Price">
                <div class="value-title">Price:</div>
                <div>{{ price }}</div>
            </div>

            <div class="cart-form__col">
                <input class="cart-form__input"
                       type="text"
                       :value="quantity"
                       @input="updateField('quantity', $event.target.value)"
                       placeholder="Quantity">
                <div class="value-title">Quantity:</div>
                <div>{{ quantity }}</div>
            </div>

            <div class="cart-form__col">
                <input class="cart-form__input"
                       type="text"
                       :value="amount"
                       @input="updateField('amount', $event.target.value)"
                       placeholder="Amount">
                <div class="value-title">Amount:</div>
                <div>{{ amount }}</div>
            </div>

            <div class="cart-form__col">
                <button class="cart-form__btn"
                        @click="submitForm"
                        :disabled="formInProcess"
                >Send
                </button>
                <div class="value-title">Saved data:</div>
                <div v-if="savedData" class="cart-form__code">{{ savedData }}</div>
            </div>

        </div>


        <div class="cart-form__log">
            <span class="cart-form__log-title">Logs</span>

            <div v-if="logs.length">
                <p v-for="(logItem, index) in logs"
                   :key="index + logItem.message"
                   :class="logItem.status ? logItem.status : ''"
                >
                    {{ logItem.message }}
                </p>
            </div>
            <p v-else class="cart-form__log-placeholder">Events logging</p>
        </div>
    </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

let fieldModificationOrder = [
    'price',
    'quantity',
    'amount',
]

function updateModificationOrder(fieldName) {
    fieldModificationOrder = fieldModificationOrder.filter(item => item !== fieldName);
    fieldModificationOrder.unshift(fieldName);
    console.log(fieldModificationOrder)
}

function findEarlierModifiedFieldName() {
    return fieldModificationOrder[2];
}

function mockApi({nonce, payload}) {
    return new Promise((resolve, reject) => {
        const isRequestSuccess = !(payload.amount % 2)
        const response = {
            success: isRequestSuccess,
            data: isRequestSuccess ? JSON.stringify({
                nonce,
                ...payload
            }) : null
        };
        setTimeout(() => {
            if (isRequestSuccess) {
                resolve(response)
                return;
            }
            reject(response)
        }, 1000);
    })
}

export default {
    name: 'App',
    data() {
        return {
            price: 1,
            quantity: 2,
            amount: 3,

            logs: [],
            nonce: 0,
            formInProcess: false,
            savedData: null
        }
    },
    methods: {
        updateField(fieldName, val) {
            this[fieldName] = val;
            updateModificationOrder(fieldName);
            this.calcEarlierModifiedField();
            this.addLog(`Input ${fieldName} was changed`);
        },

        calcEarlierModifiedField() {
            const earlierModifiedFieldName = findEarlierModifiedFieldName();
            this['calc_' + earlierModifiedFieldName]()
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
            this.logs.unshift({
                message,
                status
            })
        },

        submitForm() {
            this.addLog(`Send form data. Current saved data: ${this.savedData}`);
            this.sendData();
        },

        sendData() {
            this.formInProcess = true;
            mockApi({
                nonce: this.nonce++,
                payload: {
                    price: this.price,
                    quantity: this.quantity,
                    amount: this.amount
                }
            }).then(({data}) => {
                this.savedData = data;
                this.addLog(`Data saved successfully. New data: ${data}`, 'success')
            }).catch(() => {
                this.addLog(`Error. Try later...`, 'error')
            }).finally(() => {
                this.formInProcess = false;
            })

        }
    },
    components: {
        // HelloWorld
    }
}
</script>

<style src="./styles/app.css"></style>
