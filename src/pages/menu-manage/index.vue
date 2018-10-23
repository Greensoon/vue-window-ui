<template>
    <div class="mu-menu-manage">
        <div class="menu-wrap">
            <div class="menu-tree-wrap">
                <div class="mu-menu-wrap">
                    <el-tree draggable @node-drop="dragEnd" :data="data" :props="defaultProps" @node-click="handleNodeClick">
                        <span class="custom-tree-node" slot-scope="{ node }">
                            <span>{{ node.label }} </span>
                            <span v-if="node.data.data.menu_pid == 0" class="hide">
                                <el-button type="text"
                                    size="mini"
                                    @click="addSecond(node, $event)">
                                    添加
                                </el-button>
                            </span>
                        </span>
                    </el-tree>
                </div>
                <el-button type="info" size="large" @click="addFlag = !addFlag">添加首级菜单</el-button>
            </div>

            <div class="menu-info-wrap">
                <el-form label-width="100px" :model="menuForm">
                    <el-form-item label="菜单名称">
                        <el-input v-model="menuForm.menu_name"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单描述">
                        <el-input v-model="menuForm.menu_desc"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单图标">
                        <el-input v-model="menuForm.menu_icon"></el-input>
                    </el-form-item>
                    <el-form-item label="对应组件">
                        <el-input v-model="menuForm.menu_component"></el-input>
                    </el-form-item>
                    <el-form-item label="是否对应组件">
                        <el-radio v-model="menuForm.has_element" :label="0">是</el-radio>
                        <el-radio v-model="menuForm.has_element" :label="1">否</el-radio>
                    </el-form-item>
                    <el-form-item label="菜单父级">
                        <el-select v-model="menuForm.menu_pid" clearable placeholder="请选择菜单">
                            <el-option label="请选择" :value="0"></el-option>
                            <el-option v-for="item in menu"
                                :key="item.menu_id"
                                :label="item.menu_name"
                                :value="Number(item.menu_id)">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="添加元素">
                        <el-button class="add-ele-btn" type="primary" @click="elementAdd = true">元素列表</el-button>
                        <el-tag v-for="(ele, i) in elements"
                            :key="i"
                            closable
                            @close="closeEle(ele.element_id)" >
                            {{ele.element_name}}
                        </el-tag>
                    </el-form-item>

                    <el-form-item >
                        <el-button v-for="(ele, i) in elementIds" :key="i" type="primary" @click="addMenu(ele.element_id)" v-if="ele.element_code == 100 && addFlag">添加</el-button>
                        <el-button v-for="(ele, i) in elementIds" :key="i" @click="modifyMenuAction(ele.element_id)" v-if="ele.element_code == 102">修改</el-button>
                        <el-button v-for="(ele, i) in elementIds" :key="i" type="danger" @click="deleteMenu(ele.element_id)" v-if="ele.element_code == 101">删除</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <el-dialog title="添加元素"
            :modal-append-to-body="false"
            :visible.sync="elementAdd">
            <add-element @handle-data="handleEleData" @close-modal="closeElementModal" :element-ids="menuForm.element_ids"></add-element>
        </el-dialog>
    </div>
</template>
<style lang="less">
.mu-sys-setting {
    overflow-y: auto;
}
.search-form {
    padding-bottom: 20px;
    margin-bottom: 30px;
    border-bottom: 1px solid #ccc;
}
.mu-manage-bottom {
    justify-content: space-between;
    margin-top: 10px;

    .mu-manage-btns {
    
        .el-button {
            padding: 5px 10px;
            border-radius: 0;
        }
    }
}

.menu-tree-wrap {
    width: 45%;
    border: 1px dashed #ccc;
    padding: 20px;
}

.menu-info-wrap {
    width: 50%;
    border: 1px dashed #ccc;
    padding: 20px;

    .el-tag {
        margin-right: 5px;
    }
}

.menu-wrap {
    display: flex;
    justify-content: space-between;
    padding: 20px;
}

.mu-menu-wrap {
    height: 450px;
    padding-bottom: 20px;
    overflow-y: auto;
}

.el-tree-node__content {
    &:hover {
        .hide {
            display: inline-block;
        }
    }
}

.add-ele-btn {
    padding: 7px 10px;
}

.mu-menu-manage h3 {
    margin: 20px 20px 0;
}
</style>

<script>
    import { getMenus, getElements } from '../../apis/get'
    import { deleteMenu } from '../../apis/delete'
    import { addMenu } from '../../apis/post'
    import { modifyMenu } from '../../apis/put'

    import { getLoguserMenus } from '../../utils/auth'  

    import Add from './add'
    import Modify from './modify'
    import AddElement from './add-element'
    import { handleMenuData } from '../menu.mixins.js'
    import { mapActions, mapState } from 'vuex'
    import { stopPropagation } from '../../utils'
    export default {
        components: {
            Add,
            Modify,
            AddElement
        },
        props: ['elementIds', 'menuId'],
        data() {
            return {
                addModal: false,
                data: [],
                menuForm: {
                    menu_name: '',
                    menu_desc: '',
                    menu_component: '',
                    menu_pid: '',
                    has_element: 0,
                    menu_icon: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                elementAdd: false,
                elements: [],
                elementList: [],
                addFlag: false
            }
        },
        computed: {
            ...mapState({
                menu: state => state.menu.menus
            })
        },
        created() {
            this.getAllMenus()
            this.getElements()
            if(!this.menu.length) {
                this.getMenus()
            }
        },
        methods: {
            ...mapActions([
                'getMenus'
            ]),
            getElements() {
                return getElements({menu: this.menuId})
                    .then(json => {
                        if(json.code == 200) {
                            this.elementList = json.result
                        }
                    })
            },
            handleNodeClick(node) {
                node.data.menu_pid = Number(node.data.menu_pid)
                this.menuForm = node.data

                this.elements = this.elementList.filter(e => node.element_ids && node.element_ids.indexOf(String(e.element_id)) > -1)
            },
            getAllMenus() {
                return getMenus({t: new Date().getTime(), menu: this.menuId})
                    .then(json => {
                        if(json.code == 200) {
                            var data = json.result || []

                            if(data.length) {
                                this.data = handleMenuData(data)
                            }
                        }
                    })
            },
            closeAddModal() {
                this.addModal = false
            },
            deleteMenu(eleId) {
                const $this = this
                var menuId = this.menuForm.menu_id
                this.$confirm('确认要删除该菜单吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteMenu({menu_ids: [menuId]}, {menu: this.menuId, ele: eleId})
                            .then(json => {
                                if(json.code == 200 ) {
                                    $this.$notify({
                                        title: '通知',
                                        message: '删除成功',
                                        type: 'success'
                                    })
                                    this.getAllMenus()
                                } else {
                                    $this.$alert(json.message)
                                }
                            })
                    })
            },
            modifyMenuAction(eleId) {
                this.menuForm.element_ids = this.elements.map(e => e.element_id)
                modifyMenu(this.menuForm, {menu: this.menuId, ele: eleId})
                    .then(json => {
                        if(json.code == 200) {
                            this.$message.success('修改成功')
                            this.getAllMenus()
                        }
                    })
            },
            closeElementModal() {
                this.elementAdd = false
            },
            addMenu(eleId) {
                this.menuForm.element_ids = this.elements.map(e=> e.element_id)
                addMenu(this.menuForm, {menu: this.menuId, ele: eleId})
                    .then(json => {
                        if(json.code == 200) {
                            this.$message.success('添加成功')
                            this.getAllMenus()
                            this.addFlag = false
                        }
                    })
            },
            dragEnd(selfNode, parentNode, position) {
                var selfNodeData = selfNode.data.data
                var parentId = parentNode ? parentNode.data.data.menu_id : 0

                if(parentNode && parentNode.level == 1 && position != 'inner') {
                    parentId = 0
                } 

                if(selfNodeData.menu_pid == parentId ) {
                    return
                }
                selfNodeData.menu_pid = parentId

                if(selfNodeData.menu_pid == selfNodeData.menu_id) {
                    return
                }
                this.menuForm = selfNodeData
                this.modifyMenuAction()
            },
            handleEleData(dd) {
                this.elements = dd
            },
            closeEle(id) {
                this.elements = this.elements.filter(e => e.element_id != id)
            },
            addSecond(node, event) {
                stopPropagation(event)
                if(this.menuForm.menu_pid == node.data.id) {
                    return
                }
                this.menuForm.menu_pid = Number(node.data.id)
                this.addFlag = true
            }
        }
    }
</script>