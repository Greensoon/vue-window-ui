<template>
    <div class="mu-badge">
        <i class="el-icon-bell"></i>
        <span class="mu-badge-num">{{num || 0}}</span>
    </div>
</template>

<script>
    export default {
        name: 'muBadge',
        props: ['num']
    }
</script>
