<template>
  <div class="mu-wrap-block-item">
        <div >
            <div class="mu-wrap-block-item__label">{{label}}</div>
            <div :class="`mu-wrap-block-item__value ${color || 'normal'}`" v-if="type != 'link' ">
                {{value}}
            </div>
            <div :class="`mu-wrap-block-item__value ${color || 'normal'}`" v-if="type == 'link' ">
                <a :class="`mu-wrap-block-item__link ${color || 'normal'}`" @click="clickHandle">{{value}}</a>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'wrapBlockItem',
        props: ['label', 'type', 'value', 'color'],
        methods: {
            clickHandle() {
                this.$emit('click')
            }
        }
    }
</script>