import Vue from 'vue'
import Vuex from 'vuex';
import { mockApi } from '@/api/mockApi';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // current values in inputs
        currentPrice: null,
        currentQuantity: null,
        currentAmount: null,
        currentNonce: 0,

        // saved values
        price: null,
        quantity: null,
        amount: null,
        nonce: null,

        log: [],

        inputsMutationOrder: ['currentPrice', 'currentQuantity', 'currentAmount'],
    },
    mutations: {
        setCurrentPrice(store, value) {
            store.currentPrice = value;
        },
        setCurrentQuantity(store, value) {
            store.currentQuantity = value;
        },
        setCurrentAmount(store, value) {
            store.currentAmount = value;
        },
        setCurrentNonce(store, value) {
            store.currentNonce = value;
        },

        setPrice(store, value) {
            store.price = value;
        },
        setQuantity(store, value) {
            store.quantity = value;
        },
        setAmount(store, value) {
            store.amount = value;
        },
        setNonce(store, value) {
            store.nonce = value;
        },

        addLog(store, {message, status}) {
            console.log(message)
            console.log(status)
            store.log.unshift({
                message, status
            });
        },

        updateMutationOrder(store, changedInputName) {
            store.inputsMutationOrder = store.inputsMutationOrder.filter(inputName => inputName !== changedInputName);
            store.inputsMutationOrder.unshift(changedInputName);
        },
    },
    actions: {
        sendData({commit, state}, payload) {
            return mockApi(payload).then(({data}) => {
                commit('setPrice', data.price);
                commit('setQuantity', data.quantity);
                commit('setAmount', data.amount);
                commit('setNonce', data.nonce);
                commit('setCurrentNonce', state.currentNonce + 1);
            })
        }
    },
})