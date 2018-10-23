<template>
    <div class="mu-resource">
        <div class="">
            <div class="flex flex-wrap">
                <div class="">
                    <el-select v-model="rt" placeholder="资源类型">
                        <el-option v-for="(item, i) in rts"
                            :key="i"
                            :value="item.value"
                            :label="item.name" >
                        </el-option>
                    </el-select>
                </div>
                <div class="mr-wrap">
                    <el-button type="text"
                        @click="showAdd(ele.element_id)"
                        v-for="(ele, i) in elementIds"
                        :key="i"
                        v-if="ele.element_code == 100">
                        <i class="el-icon-plus"></i>新增
                    </el-button>
                </div>
            </div>
            <el-table :data="tableData"
                stripe
                style="width: 100%">
                <el-table-column type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    label="权限" >
                    <template slot-scope="scope">{{transProp(scope.row.action)}}</template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text"
                            v-for="(ele, i) in elementIds"
                            :key="i"
                            v-if="ele.element_code == 102"
                            @click="modifyRes(scope.row.resource_id, ele.element_id, scope.row.action)">
                            编辑
                        </el-button>
                        <el-button type="text" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 101" @click="deleteRes(scope.row[`resource_${rt}_id`], ele.element_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="添加资源"
            :visible.sync="addShow"
            :modal-append-to-body="false"
            width="80%">
            <add :res-type="rt" @get-checked="getCheckeds" ref="resAdd"></add>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAdd">取 消</el-button>
                <el-button type="primary" @click="saveRes">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改资源"
            :visible.sync="modifyShow"
            :modal-append-to-body="false"
            width="80%">
            <modify :res-type="rt" ref="resModify" @get-checked="getCheckeds" :record-id="recordId" :checkeds="checkeds"></modify>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeModify">取 消</el-button>
                <el-button type="primary"
                    @click="updateRes(ele.element_id)"
                    v-for="(ele, i) in elementIds"
                    :key="i"
                    v-if="ele.element_code == 102">
                    确 定
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style lang="less" scoped>
.mu-resource {
    padding: 20px;

    .flex-wrap {
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .mr-wrap {
        .el-button {
            padding-right: 0;
        }
    }

    .el-table {
        border: 1px solid #ddd;
    }
}
</style>
<script>
    import { getResourceType, getResources, getResourceNames } from '../../apis/get'
    import { modifyRes } from '../../apis/put'
    import { deleteRes } from '../../apis/delete'
    import { addResource } from '../../apis/post'
    import Add from './add'
    import Modify from './modify'

    export default {
        components: { Add, Modify },
        props: ['menuId', 'elementIds'],
        data() {
            return {
                rts: [],
                rt: '',
                tableData: [],
                addShow: false,
                needItems: [],
                current_ele: -1,
                items: [],
                modifyShow: false,
                recordId: -1,
                checkeds: []
            }
        },
        created() {
            this.getResourceType()
        },
        watch: {
            rt(newv) {
                this.getResources()
            }
        },
        methods: {
            transProp(actions) {
                var temp = actions.split(',')
                var ret = []
                this.items.forEach(e => {
                    if(temp.indexOf(String(e.id)) > -1) {
                        ret.push(e.operation_name)
                    }
                })
                return ret.join(',')
            },
            getResourceType() {
                getResourceType({}, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.rts = json.result
                            this.rt = this.rts[0].value

                            this.getResources()
                            this.getResNames()
                        }
                    })
            },

            getResNames() {
                return getResourceNames({resource_type: this.rt})
                    .then(json => {
                        if(json.code == 200) {
                            this.items = json.result
                        }
                    })
            },

            getResources() {
                getResources({resource_type: this.rt}, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.tableData = json.result.length ? json.result : []
                        }
                    })
            },

            showAdd(ele) {
                this.current_ele = ele
                this.addShow = true
            },

            saveRes() {
                var _needs = this.needItems.map(e => e.id)
                var params = {resource_type: this.rt, resources: [{action: _needs}]}
                addResource(params, {menu: this.menuId, ele: this.current_ele})
                    .then(json => {
                        if(json.code == 200) {
                            this.addShow = false
                            this.getResources()
                            this.$message.success('添加成功')

                            //reset
                            this.needItems = []
                            this.$refs.resAdd.reset()
                        }
                    })
            },

            getCheckeds(val) {
                this.needItems = val
            },

            deleteRes(id) {
                this.current_ele = id
                this.$confirm('确认删除该记录吗？')
                    .then(_ => {
                        deleteRes({resource_type: this.rt, resource_ids: [id]}, {menu: this.menuId, ele: this.current_ele})
                            .then(json => {
                                if(json.code == 200) {
                                    this.getResources()
                                    this.$message.success('删除成功')
                                }
                            })
                    })
            },

            modifyRes(id, ele, action) {
                this.modifyShow = true
                this.checkeds = action
                this.recordId = id
                this.current_ele = ele
            },
            updateRes(ele) {
                if(this.needItems.length == 0) {
                    this.modifyShow = false
                    return
                }

                var _needIds = this.needItems.map(e => e.id)
                var params = {
                    resource_type: this.rt,
                    resource_id: this.recordId,
                    action: _needIds
                }
                modifyRes(params, {menu: this.menuId, ele})
                    .then(json => {
                        if(json.code == 200) {
                            this.getResources()
                            this.$refs.resModify.reset()
                            this.$message.success('修改成功')
                            this.modifyShow = false
                        }
                    })

            },

            closeAdd() {
                this.$refs.resAdd.reset()
                this.addShow = false
            },
            closeModify() {
                this.modifyShow = false
                this.$refs.resModify.reset()
            }
        }
    }
</script>
