<template>
    <div class="mu-platform">
        <el-table :data="tableData"
            :loading="loading"
            border
            stripe
            style="width: 100%">
            <el-table-column prop="id"
                label="ID">
            </el-table-column>
            <el-table-column prop="cname"
                label="平台名称">
            </el-table-column>
            <el-table-column prop="alias"
                label="别名">
            </el-table-column>
            <el-table-column prop="extranet_ip"
                label="平台IP">
            </el-table-column>
            <el-table-column prop="port"
                label="平台端口号">
            </el-table-column>
            <el-table-column prop="create_time"
                label="创建时间">
                <template slot-scope="scope">
                    {{handleDate(scope.row.create_time * 1000)}}
                </template>
            </el-table-column>
            <el-table-column
                label="操作" >
                <template slot-scope="scope">
                    <el-button type="text"
                        v-for="ele in elementIds"
                        :key="ele.element_id"
                        v-if="ele.element_code == 102"
                        @click="handleModify(scope.row, ele.element_id)">编辑
                    </el-button>
                    <el-button type="text"
                        v-for="ele in elementIds"
                        :key="ele.element_id"
                        v-if="ele.element_code == 101"
                        @click="handleDelete(scope.row, ele.element_id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="platform-bottom"><el-button @click="handleAdd(ele.element_id)" v-for="ele in elementIds" :key="ele.element_id" v-if="ele.element_code == 100"><i class="el-icon-plus"></i>添加</el-button></div>

        <el-dialog title="修改平台信息"
            :visible.sync="modifyModal"
            width="50%"
            :modal-append-to-body="false" >
            <modify @close-modal="closeModify" :data="modifyData" :eleId="elementId" :menu-id="menuId"></modify>
        </el-dialog>

        <el-dialog title="添加平台"
            :visible.sync="addModal"
            width="50%"
            :modal-append-to-body="false" >
            <add @close-modal="closeAdd" :eleId="elementId" :menu-id="menuId"></add>
        </el-dialog>
    </div>
</template>
<style lang="less">
.mu-platform {
    .platform-bottom {
        margin-top: 20px;
    }
    .platform-bottom .el-button {
        padding: 5px 10px;
        border-radius: 0;
    }
}
</style>

<script>
    import Add from './add'
    import Modify from './modify'
    import { list, $delete } from './api'
    import dateMixins from '../date.mixins'

    export default {
        mixins: [dateMixins],
        components: {
            Add,
            Modify
        },
        props: ['elementIds', 'menuId'],
        data() {
            return {
                modifyModal: false,
                addModal: false,
                modifyData: {},
                tableData: [],
                elementId: -1,
                loading: false,
            }
        },
        created() {
            this.renderList()
        },
        methods: {
            renderList() {
                list({}, {menu: this.menuId})
                    .then(json => {
                        if(json.code == 200) {
                            this.tableData = json.result
                            this.loading = true
                        }
                    })
            },
            handleModify(row, ele) {
                this.modifyData = row
                this.modifyModal = true
                this.elementId = ele
            },
            handleDelete(row, ele) {
                this.$confirm('确定要删除该平台吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    $delete({
                        id: row.id
                    }, {
                        menu: this.menuId,
                        ele
                    }).then(json => {
                        if(json.code == 200) {
                            this.$notify({
                                type: 'success',
                                message: '删除成功!'
                            })
                            this.renderList()
                        }
                    })

                })
            },
            handleAdd(eleId) {
                this.addModal = true
                this.elementId = eleId
            },
            closeModify() {
                this.modifyModal = false
                this.renderList()
            },
            closeAdd() {
                this.renderList()
                this.addModal = false
            }
        }
    }
</script>
