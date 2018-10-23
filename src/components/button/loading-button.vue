<template>
    <div class="mu-loading-button">
        <el-button :type="type" :loading="loading" :icon="icon">{{label}}</el-button>
    </div>
</template>
<script>
    export default {
        name: 'loadingButton',
        props: ['type', 'label', 'loading', 'icon']
    }
</script>
