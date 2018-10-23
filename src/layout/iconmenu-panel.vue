<template>
    <div class="mu-iconmenu-panel">
        <slot></slot>
    </div>
</template>
<script>
import Sortable from 'sortablejs'

export default {
    mounted() {
        var $el = this.$el
        var sort = Sortable.create($el, {
            animation: 150,
            draggable: '.draggable',
        })
    }
}
</script>
<style lang="less">
.mu-iconmenu-panel {
    max-width: 980px;
    margin: auto;
    margin-top: 50px;
    display: flex;

    flex-wrap:wrap;
}
</style>
