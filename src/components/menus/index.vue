<template>
    <el-row class="mu-menus">
        <el-col>
            <div class="el-icon-close mu-menus-switch" @click="toggleMenu"></div>
            <el-menu :collapse="isOpen" :collapse-transition="false">
                <el-submenu :index="obj.index" v-for="(obj, i) in data" :key="i">
                    <template slot="title">
                        <i class="el-icon-caret-right"></i>
                        <span>{{obj.name}}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="ele.idx" v-for="(ele, idx) in obj.children" :key="idx">{{ele.name}}</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-col>
    </el-row>
</template>
<script>
    import $ from 'jquery'

    export default {
        name: 'muMenus',
        props: ['data'],
        data() {
            return {
                isOpen: false
            }
        },
        created() {
            this.data.forEach(e => {
                if(!e.children) {
                    e.children = [{
                        name: e.name,
                        index: e.index
                    }]
                }
            })
        },
        methods: {
            toggleMenu() {
                this.isOpen = !this.isOpen
                if(this.isOpen) {
                    $('.mu-home-aside').css('width', 'auto')
                } else {
                    $('.mu-home-aside').css('width', '180px')
                }
            }
        }
    }
</script>
