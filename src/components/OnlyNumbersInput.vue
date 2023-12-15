<template>
    <input type="tel"
           :placeholder="placeholder"
           :disabled='disabled'
           :value="value"
           @keypress="preventNonDigits"
           @input="onInput"
    >
</template>

<script>
export default {

    props: {
        value: {
            type: [String, Number],
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: '',
        },
    },

    methods: {
        onInput(e) {
            let cursorPosition = e.target.selectionStart;
            const value = e.target.value;

            // remove all, except digit, comma and point, replace comma with point, replace multiple first zeros
            let newValue = value
                .replace(/[^\d.,]|^\./g, '')
                .replace(/,/g, '.')
                .replace(/^0+(\d)/g, '$1')
                .replace(/^0+\./g, '0.');

            // remove redundant dots
            let matchDot = newValue.match(/\./g);
            if (matchDot && matchDot.length > 1) {
                const dotPos = newValue.indexOf('.');
                newValue = newValue.replace(/\./g, '');
                newValue = `${newValue.slice(0, dotPos)}.${newValue.slice(dotPos)}`;
            }

            e.target.value = newValue;
            e.target.setSelectionRange(cursorPosition, cursorPosition);
            this.$emit('input', newValue)
        },

        preventNonDigits(e) {
            const regex = new RegExp('[0-9,.]');
            if (!regex.test(e.key)) {
                e.preventDefault();
            }
        },
    },
}
</script>