<template>
    <div class="mu-wrap" :style="{width: width ? width : 'auto'}">
        <div class="mu-wrap-title">
            {{title || 'mu wrap'}}
        </div>
        <div class="mu-wrap-content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'muWrap',
        props: ['title', 'width']
    }
</script>
