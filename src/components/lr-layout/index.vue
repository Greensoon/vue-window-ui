<template>
    <div :style="{width: '100%', display: 'flex'}">
        <div class="mu-menu-left" :style="!isCollapse ? leftCss : tlCss ">
            <!-- <div class="mu-collapse-menu">
                <span class="fold-span" @click="toggleFold" :style="{backgroundImage: `url(${isCollapse ? foldOpen: foldClose})`}"></span>
            </div> -->
            <el-menu class="panel-menu fold-menu"
                :collapse="isCollapse"
                :collapse-transition="false"
                @select="menuClick"
                :default-active="defaultActive">
                <el-menu-item :index="item.menu_component" v-for="(item, i) in menus" :key="'__' + i">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{item.menu_name}}</span>
                </el-menu-item>
            </el-menu>

            <div class="mu-slide" :style="{backgroundImage: `url(${ isCollapse ? foldClose : foldOpen})`, right: isCollapse ? '-12px' : '-6px'}" @click="toggleFold"></div>
        </div>
        <div class="mu-menu-right" :style="!isCollapse ? rightCss : trCss">
			<slot></slot>
		</div>
    </div>
</template>
<script>
    const rightCss = {
        width: 'calc(100% - 180px)'
    }
    const leftCss = {
        width: '180px'
    }

    const tlCss = {
        width: '64px'
    }

    const trCss = {
        width: 'calc(100% - 64px)'
    }

    import foldOpen from '../../../assets/img/icon_menu_fold.png'
    import foldClose from '../../../assets/img/icon_menu_unfold.png'

    export default {
        name: 'lrLayout',
        props: ['menus'],
        data() {
            return {
                defaultActive: this.menus[0].menu_component,
                menuId: 0,
                roleElementIds: [],
                isCollapse: false,
                foldOpen,
                foldClose,
                leftCss,
                rightCss,
                tlCss,
                trCss
            }
        },
        methods: {
            menuClick(index) {
                this.$emit('menu-click', index)
            },
            toggleFold() {
                this.isCollapse = !this.isCollapse
            }
        }
    }
</script>
<style lang="less">
    // .fold-span {
    //     display: inline-block;
    //     width: 100%;
    //     height: 30px;
    //     margin: 0 auto;
    //     background-size: 30px 30px;
    //     background-repeat: no-repeat;
    //     background-position: center;
    // }

    .mu-menu-left {
        background: #444;
        position: relative;
    }

    .mu-menu-right {
        padding: 20px;
        overflow-y: auto;
    }

    .mu-slide {
        position: absolute;
        width: 20px;
        height: 30px;
        z-index: 5;
        right: -12px;
        margin: auto;
        top: 0;
        bottom: 0;

        background-size: 30px 30px;
        background-repeat: no-repeat;
        background-position: center;

        cursor: pointer;
    }
</style>
