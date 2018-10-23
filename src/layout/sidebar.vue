<template>
    <div :class="`mu-layout-sidebar ${value ? 'fadeInLeft' : 'fadeOutLeft'}`">
        <div class="mu-layout-siderbar-wrap">
            <el-menu default-active="2" >
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>导航一</span>
                </template>
                <el-menu-item-group>
                    <template slot="title">系统</template>
                    <el-menu-item index="1-1">
                        <i class="el-icon-setting"></i>
                        帮助中心
                    </el-menu-item>
                    <el-menu-item index="1-2">
                        <i class="el-icon-goods"></i>
                        全能下载
                    </el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="应用程序">
                    <el-menu-item index="1-3">
                        呵呵呵
                    </el-menu-item>
                </el-menu-item-group>
            </el-menu>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['value'],
    }
</script>
<style lang="less">
.mu-layout-sidebar {
    position: absolute;
    width: 240px;
    background: #fff;
    top: 46px;
    z-index: 200;
    left: 0;
    bottom: 0;
    display: none;

    transition: all 1s ease-in-out;
    -webkit-transition: all 1s ease-in-out;

    box-shadow: 0 1px 5px 0px #666;

    &.fadeInLeft {
        display: block;
    }

    &.fadeOutLeft {
        display: none;
    }
}

.mu-layout-siderbar-wrap {
    .el-menu-item-group {
        border-bottom: 1px solid #ccc;

        &:last-child {
            border-bottom: 0;
        }
    }

    .el-menu-item {
        color: #303133;
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
        font-size: 12px;
    }
}
</style>

