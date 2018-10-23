<template>
    <el-menu class="main-menu" :default-active="$route.path" router :collapse="isCollapse" :collapse-transition="false" @select="selectMenu">
        <el-submenu :index="o.index" v-if="o.children && o.children.length" v-for="(o, i) in menus" :key="i">
            <template slot="title">
                <i :class="`el-icon-${o.icon}`"></i>
                <span>{{o.name}}</span>
            </template>
            <el-menu-item :index="ele.index" v-bind:class="{'is-active': $route.path.indexOf(ele.index) >= 0}" v-for="(ele, idx) in o.children" :key="idx">
                <i :class="`el-icon-${ele.icon}`"></i>
                {{ele.name}}
            </el-menu-item>
        </el-submenu>
        <el-menu-item :index="o.index" v-bind:class="{'is-active': $route.path.indexOf(o.index) >= 0}" v-if="!o.children || !o.children.length" v-for="(o, i) in menus" :key="i">
            <i :class="`el-icon-${o.icon}`"></i>
            <span slot="title">{{o.name}}</span>
        </el-menu-item>
    </el-menu>
</template>
<script>
    import $ from 'jquery'
    import { shouldCollapseMenu } from '../../utils/dom'

    export default {
        name: 'sideMenus',
        data() {
            return {
                isCollapse: false
            }
        },
        props: ['menus', 'select'],
        created() {
            var $this = this
            $(window).resize(function() {
                $this.collapseMenu()
            })
        },
        mounted() {
            this.collapseMenu()
        },
        methods: {
            collapseMenu() {
                if(shouldCollapseMenu()) {
                    this.isCollapse = true
                    $('.main-side').css('width', '64px')
                } else {
                    this.isCollapse = false
                    $('.main-side').css('width', '260px')
                }
            },
            // toggleMenu() {
            //     this.isCollapse = !this.isCollapse
            //     if(this.isCollapse) {
            //         $('.main-side').css('width', 'auto')
            //     } else {
            //         $('.main-side').css('width', '180px')
            //     }
                
            // },
            selectMenu() {
                this.select && this.select()
            }
        }
    }
</script>