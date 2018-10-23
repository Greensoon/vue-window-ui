<template>
    <div class="mu-user">
        <!-- <div class="mu-user-left">
            <el-menu class="panel-menu"
                @select="menuClick"
                :default-active="defaultActive">
                <el-menu-item :index="item.menu_component" v-for="(item, i) in submenus" :key="i">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{item.menu_name}}</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="mu-user-right">
            <user v-if="defaultActive == 'user'" :element-ids="needIds" :menu-id="menuId"></user>
            <role v-if="defaultActive == 'role'" :element-ids="roleElementIds" :menu-id="menuId"></role>
            <logs v-if="defaultActive == 'user-logs'" :element-ids="roleElementIds" :menu-id="menuId"></logs>
        </div> -->
        <lr-layout
            :menus="submenus"
            @menu-click="menuClick" >
            <user v-if="defaultActive == 'user'" :element-ids="needIds" :menu-id="menuId"></user>
            <role v-if="defaultActive == 'role'" :element-ids="roleElementIds" :menu-id="menuId"></role>
            <logs v-if="defaultActive == 'user-logs'" :element-ids="roleElementIds" :menu-id="menuId"></logs>
        </lr-layout>
    </div>
</template>
<script>
    import socket from '../../apis/socket'
    import { getLoguserMenus } from '../../utils/auth'

    import user from './user'
    import role from './role'
    import logs from '../user-log'
    import menuMixins from '../menu.mixins'

    import { getSubmenu, getElementIds } from '../menu.mixins.js'

    export default {
        mixins: [menuMixins],
        components: {
            user,
            role,
            logs
        },

        data() {
            return {
                defaultActive: '',
                menuId: 0,
                roleElementIds: [],
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
            this.getSubmenus('用户管理', (submenus) => {
                this.defaultActive = submenus[0].menu_component
                this.submenus = submenus

                this.getElementIds()
            })
        },
        methods: {
            menuClick(index) {
                this.defaultActive = index
            }
        }
    }
</script>
<style lang="less">
    .mu-user {
        display: flex;

        &-left {
            width: 180px;
            // border-right: 1px solid #ccc;
            background: #444;
        }

        &-left,
        &-right {
            height: 100%;
        }

        &-right {
            padding: 20px;

            overflow-y: auto;
        }

        .user-search,
        .role-search {
            border-bottom: 1px solid #ccc;
            margin: 0 0 20px;
        }

        .mu-user-btns-wrap {
            margin-bottom: 10px;
        }

        .mu-user-add {
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
