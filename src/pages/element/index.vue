<template>
    <div class="mu-element">
        <el-table :data="tableData"
            stripe
            v-loading="loading"
            style="width: 100%">
            <el-table-column
                prop="element_name"
                label="元素名字">
            </el-table-column>
            <el-table-column
                prop="element_desc"
                label="元素描述">
            </el-table-column>
            <el-table-column
                prop="element_code"
                label="元素代码">
            </el-table-column>
            <el-table-column
                label="操作"
                width="150">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="modifyElementAction(scope.row, ele.element_id)" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 102 ">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteElementAction(scope.row.element_id, ele.element_id)" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 101">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="mu-element-bottom">
            <el-button @click="addElementAction(ele.element_id)"  v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 100"><i class="el-icon-plus"></i>添加</el-button>
        </div>

        <el-dialog title="添加元素"
            :modal-append-to-body="false"
            :visible.sync="elementAddModal"
            width="80%">
            <add @close-modal="elementAddModal = false"
                @fresh="fresh"
                :element-id="currentEleId"
                :menu-id="menuId">
            </add>
        </el-dialog>

        <el-dialog title="编辑元素"
            :modal-append-to-body="false"
            :visible.sync="elementModifyModal"
            width="80%">
            <modify @fresh="fresh"
                @close-modal="elementModifyModal= false"
                :element="modifyElement"
                :element-id="currentEleId"
                :menu-id="menuId">
            </modify>
        </el-dialog>
    </div>
</template>
<style lang="less">
.mu-element {
    padding: 20px;

    .el-table {
        border: 1px solid #ccc;
    }
}
.mu-element-bottom {
    margin-top: 20px;

    .el-button {
        padding: 5px 10px;
        border-radius: 0;
    }
}
</style>

<script>
    import { getElements } from '../../apis/get'
    import { deleteElement } from '../../apis/delete'

    import Add from './add'
    import Modify from './modify'

    export default {
        components: {
            Add,
            Modify
        },
        props: ['elementIds', 'menuId'],
        data() {
            return {
                tableData: [],
                elementAddModal: false,
                elementModifyModal: false,
                modifyElement: {},
                loading: true,
                currentEleId: 0
            }
        },
        created() {
            this.getElements()
        },
        methods: {
            getElements() {
                getElements({t: new Date().getTime(), menu: this.menuId})
                    .then(json => {
                        if(json.code == 200) {
                            this.tableData = json.result
                            this.loading = false
                        }
                    }).catch(_ => {
                        this.loading = false
                    })
            },
            addElementAction(eleId) {
                this.elementAddModal = true
                this.currentEleId = eleId
            },
            modifyElementAction(data, eleId) {
                this.modifyElement = data
                this.elementModifyModal = true
                this.currentEleId = eleId
            },
            deleteElementAction(elementId, ele) {
                const $this = this
                this.$confirm('确认要删除该元素吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteElement({element_ids: [elementId]}, {menu: this.menuId, ele})
                            .then(json => {
                                if(json.code == 200 ) {
                                    $this.$notify({
                                        title: '通知',
                                        message: '删除成功',
                                        type: 'success'
									})
									this.fresh()
                                    // this.$emit('fresh')
                                    // this.$emit('close-modal')
                                } else {
                                    $this.$alert(json.message)
                                }
                            })
                    })
            },
            fresh(item) {
                this.getElements()
            }
        }
    }
</script>
