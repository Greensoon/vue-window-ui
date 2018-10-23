<template>
    <div class="role-permission">
        <el-tabs v-model="activeName">
            <el-tab-pane label="菜单授权" name="menu">
                <tree-table :head-data="elementList"
                    ref="permissionTree"
                    :table-data="menuList"
                    v-if="treeReady"
                    @get-checked="getCheckedInput"
                    :checked-ids="hadPermission"
                    @get-rows="getCheckedRows"
                    @check-all="checkAll"
                ></tree-table>
                <div class="tree-loading" v-if="!treeReady">
                    <i class="el-icon-loading"></i>
                </div> 
                <div class="menu-bottom">
                    <el-button type="primary" @click="savePermission">保存</el-button>
                    <el-button @click="closeModal">取消</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style lang="less">
.rp-wrap .el-dialog__body {
    margin-top: 0;
}
.menu-bottom {
    margin-top: 20px;
}
.custom-tree-node {
    width: 100%;
}
.tree-loading {
    padding: 100px;
    text-align: center;
    font-size: 30px;
}

</style>

<script>
    import { getMenus, getRoleInfo, getElements } from '../../apis/get'
    import { handleTreeMenu } from '../../utils/menu.config'
    import { savePermission } from '../../apis/patch'

    export default {
        props: ['roleId', 'menuId', 'elementId'],
        data() {
            return {
                activeName: 'menu',
                menuList: [],
                props: {
                    label: 'label',
                    children: 'children'
                },
                currentRole: {},
                showElementsModal: false,
                elementList: [],
                treeReady: false,
                roleElements: {},
                hadPermission: [],
                checkAllModel: false
            }
        },
        watch: {
            roleId(newv) {
                this.treeReady = false
                this.getRoleInfo()
                    .then(json => {
                        this.treeReady = true
                    })
            }
        },
        created() {
            Promise.all([
                this.getMenus(),
                this.getRoleInfo(),
                this.getElements()
            ]).then(json => {
                this.treeReady = true
            })
        },

        methods: {
            getElements() {
                return getElements({}, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.elementList = json.result
                        }
                    })
            },
            getRoleInfo() {
                var $this = this
                return getRoleInfo(this.roleId, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.hadPermission = json.result.menus_elements
                            this.roleElements = this.convertRE(json.result.menus_elements)
                        }
                        
                    })
            },
            convertRE(data) {
                var ret = {}
                data.forEach(e => {
                    ret[e.menu_id] = e.element_ids
                })
                return ret
            },
            getMenus() {
                return getMenus({}, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            // this.menuList = handleTreeMenu(json.result.ROOT.children)
                            this.menuList = json.result
                        }
                    })
            },
            closeModal() {
                this.$emit('close-modal')
                // this.treeReady = false
            },
            savePermission() {
                var params = {
                    role_id: Number(this.roleId),
                    menus_elements: this.formatData(this.roleElements)
                }
                savePermission(params, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.$notify({
                                message: '保存成功',
                                type: 'success'
                            })
                            this.closeModal()
                            this.roleElements = []
                        }
                    })
            },
            formatData(data) {
                var ret = []
                var keys = Object.keys(data)
                keys.forEach(function(e) {
                    ret.push({
                        menu_id: Number(e),
                        element_ids: data[e].map(el => Number(el))
                    })
                })
                return ret
            },
            getCheckedInput(checked, val) {
                if(checked) {
                    this.appendData(val)
                } else {
                    this.deleteData(val)
                }
            },
            getCheckedRows(checked, val) {
                if(checked) {
                    val.forEach(e => {
                        this.appendData(e)
                    })
                } else {
                    val.forEach(e => {
                        this.deleteData(e)
                    })
                }
            },
            appendData(val) {
                var temp = val.split('-')
                var _menu_id = temp[0]
                var _element_id = temp[1]
                var vals = this.roleElements[_menu_id]
                if(!vals) {
                    this.roleElements[_menu_id] = [_element_id]
                } else {
                    this.roleElements[_menu_id].push(_element_id)
                }
            },
            deleteData(val) {
                var temp = val.split('-')
                var _menu_id = temp[0]
                var _element_id = temp[1]
                var vals = this.roleElements[_menu_id]
                if(!vals) {
                    return
                }

                this.roleElements[_menu_id] = this.deleteArrItem(this.roleElements[_menu_id], _element_id)

                if(!this.roleElements[_menu_id].length) {
                    delete this.roleElements[_menu_id]
                }
            },
            deleteArrItem(arr, item) {
                var _index= arr.indexOf(item)
                return arr.slice(0, _index).concat(arr.slice(_index + 1))
            },
            /**
             * menus_elements : [{menu_id: 30, element_ids: [32, 31, 30]}],
                role_id : 1
             */
            checkAll(vals) {
                var ret = {}
                if(!vals.length) {
                    ret = []
                } else {
                    vals.forEach((e) => {
                        var temp = e.split('-')
                        var _menu_id = temp[0]
                        var _elem_id = temp[1]
                        if(ret[_menu_id]) {
                            ret[_menu_id].push(_elem_id)
                        } else {
                            ret[_menu_id] = [_elem_id]
                        }
                    })
                }
                this.roleElements = ret
            }
        }
    }
</script>