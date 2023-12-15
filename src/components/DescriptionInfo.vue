<template>
    <div class="info">
        <button class="info__btn" @click="isOpen = true">i</button>

        <div class="info__modal" v-if="isOpen">
            <div class="info__modal-bg" @click="isOpen = false"></div>
            <div class="info__modal-body">
                <p>При первоначальном заполнении двух любых полей оставшееся пустое поле сразу просчитывается</p>
                <p>Далее действует стандартное правило - просчитывается то которое модифицировалось раньше всех</p>
                <p>Тупиковые значения (деление на ноль или рассчеты в которых присутсвуют пустые значения) не просчитываются</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DescriptionInfo',

    data() {
        return {
            isOpen: false
        }
    },

    methods: {},


}
</script>

<style lang="scss">
.info {
    position: absolute;
    right: 20px;
    top: 20px;

    &__btn {
        display: flex;
        width: 50px;
        height: 50px;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: cornflowerblue;
        border: none;
        cursor: pointer;
        opacity: .8;

        font-size: 40px;
        font-family: Serif;
        color: #fff;

        &:hover {
            opacity: 1;
        }
        &:active {
            opacity: .9;
        }
    }

    &__modal {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;

        left: 0;
        top: 0;
        z-index: 100;
        width: 100%;
        height: 100%;
    }
    &__modal-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.5);
    }

    &__modal-body {
        max-width: 460px;
        position: relative;
        z-index: 1;
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid gray;
        padding: 20px 30px;
        font: 16px/1.4 sans-serif;
    }
}
</style>