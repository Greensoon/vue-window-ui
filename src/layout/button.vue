<template>
    <div class="mu-layout-btnwrap">
        <button class="mu-layout-button" @click="click || function() {}">
            <img src="../../assets/img/launch.png">
        </button>
    </div>
</template>
<style lang="less">
    .mu-layout-btnwrap {
        text-align: center;
        .mu-layout-button {
            width: 40px;
            height: 40px;
            margin-top: 5px;
            background: none;

            img {
                width: 30px;
                height: 30px; 
            }

            &:hover {
                background: rgba(255, 255, 255, 0.6);
                border-radius: 100px;

                width: 50px;
                height: 50px;
                cursor: pointer;
            }
        }
    }
</style>
<script>
    export default {
        props: ['label', 'click']
    }
</script>
