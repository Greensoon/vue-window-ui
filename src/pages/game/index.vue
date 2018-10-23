<template>
    <div class="mu-game">
        <!-- <div class="mu-game-left" :style="!isCollapse ? leftCss : tlCss ">
            <div class="mu-collapse-menu">
                <span class="fold-span" @click="toggleFold" :style="{backgroundImage: `url(${isCollapse ? foldOpen: foldClose})`}"></span>
            </div>
            <el-menu class="panel-menu fold-menu"
                :collapse="isCollapse"
                :collapse-transition="false"
                @select="menuClick"
                :default-active="defaultActive">
                <el-menu-item :index="item.menu_component" v-for="(item, i) in submenus" :key="'__' + i">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{item.menu_name}}</span>
                </el-menu-item>
            </el-menu>
        </div> -->
        <!-- <div class="mu-game-right" :style="!isCollapse ? rightCss : trCss">
			<configuration v-if="defaultActive == 'configuration'" :element-ids="needIds" :menu-id="menuId"></configuration>
            <platform v-if="defaultActive == 'platform'" :element-ids="needIds" :menu-id="menuId"></platform>
            <types v-if="defaultActive == 'types'" :element-ids="needIds" :menu-id="menuId"></types>
            <sections v-if="defaultActive == 'sections'" :element-ids="needIds" :menu-id="menuId"></sections>
			<partition v-if="defaultActive == 'partition'" :element-ids="needIds" :menu-id="menuId"></partition>
		</div> -->

        <lr-layout
            :menus="submenus"
            @menu-click="menuClick"
        >
            <configuration v-if="defaultActive == 'configuration'" :element-ids="needIds" :menu-id="menuId"></configuration>
            <platform v-if="defaultActive == 'platform'" :element-ids="needIds" :menu-id="menuId"></platform>
            <types v-if="defaultActive == 'types'" :element-ids="needIds" :menu-id="menuId"></types>
            <sections v-if="defaultActive == 'sections'" :element-ids="needIds" :menu-id="menuId"></sections>
			<partition v-if="defaultActive == 'partition'" :element-ids="needIds" :menu-id="menuId"></partition>
        </lr-layout>

    </div>
</template>
<script>
    import socket from '../../apis/socket'
    import { getLoguserMenus } from '../../utils/auth'

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

    import platform from '../platform'
    import types from '../types'
	import sections from '../sections'
	import partition from '../partition'
	import configuration  from '../configuration'
    import menuMixins from '../menu.mixins'

    import foldOpen from '../../../assets/img/icon-folder-open.png'
    import foldClose from '../../../assets/img/icon-folder-close.png'

    import { getSubmenu, getElementIds } from '../menu.mixins.js'
    
    export default {
        mixins: [menuMixins],
        components: {
            platform,
            types,
			sections,
			configuration,
			partition
        },

        data() {
            return {
                defaultActive: '',
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
        watch: {
            needIds: {
                handler(newv) {
                    this.roleElementIds = newv
                },
                deep: true
            },
            defaultActive(newv) {
                var filter = this.submenus.filter(e => e.menu_component == newv)
                if(filter && filter.length) {
                    this.needIds = filter[0].element_ids
                    this.menuId = filter[0].menu_id
                }
            }
        },
        created() {
            this.getSubmenus('游戏管理', (submenus) => {
                this.defaultActive = submenus[0] && submenus[0].menu_component
                this.submenus = submenus

                this.getElementIds()
            })
        },
        methods: {
            menuClick(index) {
                this.defaultActive = index
            },
            toggleFold() {
                this.isCollapse = !this.isCollapse
            }
        }
    }
</script>
<style lang="less">
    .fold-span {
        display: inline-block;
        width: 100%;
        height: 30px;
        margin: 0 auto;
        background-size: 30px 30px;
        background-repeat: no-repeat;
        background-position: center;
    }
    .mu-game {
        display: flex;

        // &-left {
        //     width: 180px;
        //     // border-right: 1px solid #ccc;
        //     background: #444;
        // }

        &-left,
        &-right {
            height: 100%;
        }

        &-right {
            padding: 20px;
            overflow-y: auto;
        }

        .game-search,
        .role-search {
            border-bottom: 1px solid #ccc;
            margin: 0 0 20px;
        }

        .mu-game-btns-wrap {
            margin-bottom: 10px;
        }

        .mu-game-add {
            padding: 5px 10px;
            border-radius: 0;
            font-size: 12px;

            height: 30px;
        }

        .el-button--text:active {
            text-decoration: underline;
        }

        &-flex {
            justify-content: space-between;
            margin-top: 10px;
        }

        // .el-table td, .el-table th {
        //     padding: 3px 0;
        // }
    }

    .panel-title {
        font-size: 14px;
        padding: 8px 25px;
        color: #fff;
    }
</style>
