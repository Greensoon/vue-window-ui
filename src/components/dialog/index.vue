<template>
    <div class="mu-dialog" :style="modalVal ? {display: 'block'} : {display: 'none'}">
        <div class="mu-dialog-title" @dblclick="titleDblClick">
            <span class="mu-dialog-title__text" >{{title}}</span>
            <span class="mu-dialog-close" @click="close"></span>
        </div>
        <div class="mu-dialog-content" v-if="modalVal">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="less">
.mu-dialog {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 102;

    .mu-dialog-title {
        height: 30px;
        line-height: 30px;
        background: #eee;
        padding-left: 10px;
    }

    .mu-dialog-content {
        overflow: auto;
        height: inherit;
        transform: initial;
    }

    .mu-dialog-close {
        width: 30px;
        height: 30px;
        position: relative;
        float: right;
        cursor: pointer;

        &:before {
            content: '';
            position: absolute;
            width: 14px;
            height: 2px;
            background: #aaa;
            transform: rotate(45deg);
            top: 15px;
            left: 5px;
        }

        &:after {
            content: '';
            position: absolute;
            width: 14px;
            height: 2px;
            background: #aaa;
            transform: rotate(-45deg);
            top: 15px;
            left: 5px;
        }
    }
}
</style>

<script>
    export default {
        name: 'muDialog',
        props: ['title', 'value'],
        data() {
            var $val = this.value
            return {
                modalVal: $val
            }
        },
        watch: {
            value(val) {
                this.modalVal = val
            }
        },
        methods: {
            close() {
                this.modalVal = false
                this.$emit('close')
            },
            titleDblClick() {
                this.$parent.$parent.titleDblclick && this.$parent.$parent.titleDblclick()
                this.$parent.$parent.$parent.$parent.titleDblclick && this.$parent.$parent.$parent.$parent.titleDblclick()
            }
        }
    }
</script>