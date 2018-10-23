<template>
    <div class="mu-role-res">
        <el-tabs v-model="activeName">
            <el-tab-pane name="res">
                <el-select v-model="rt" placeholder="请选择资源类型" @change="changeRT">
                    <el-option v-for="(item, i) in rts" :key="i" :value="item.value" :label="item.name"></el-option>
                </el-select>

                <el-table :data="tableData" @selection-change="chooseRow" ref="resTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="权限" align="center">
                        <template slot-scope="scope">
                            {{transProp(scope.row.action)}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

        <div class="mrr-btns">
            <el-button type="primary" @click="modifyRes">授权</el-button>
            <el-button @click="close">取消</el-button>
        </div>
    </div>
</template>

<style lang="less">
    .mu-role-res {
		margin-top: -70px;
        .el-table {
            border: 1px solid #ddd;
            margin-top: 15px;
        }
    }
    .mrr-btns {
        margin-top: 10px;

        text-align: right;
    }
</style>

<script>
    import { getMenus, getRoleInfo, getElements } from '../../apis/get'
    import { handleTreeMenu } from '../../utils/menu.config'
    import { saveRoleRes } from '../../apis/patch'
    import { getResourceType, getResources, getRoleResource, getResourceNames } from '../../apis/get'
    import { updateResource } from '../../apis/put'

    export default {
        props: ['roleId', 'menuId', 'elementId', 'show'],
        data() {
            return {
                tableData: [],
                activeName: 'res',
                rts: [],
                rt: 0,
                choosedRow: [],
                roleRes: [],
                objRes: {},
                names: [],
                prevRole: -1
            }
        },
        created() {
            this.getResType()
        },
        watch: {
            rt(newv) {
                Promise.all([
                    this.getResources(),
                    this.getRoleRes()
                ]).then(_ => {
                        this.handleObjRRS()
                    })
            },
            show(newv) {
                if(newv) {
                    this.getRoleRes()
                        .then(_=>{
                            this.handleObjRRS()
                        })
                } else {
                    this.$refs.resTable.clearSelection()
                }
            }
        },
        methods: {
            getResNames() {
                return getResourceNames({resource_type: this.rt}, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.names = json.result
                        }
                    })
            },
            getResources() {
                return getResources({resource_type: this.rt}, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.tableData = json.result.length ? json.result : []
                        }
                    })
            },
            getResType() {
                return getResourceType({}, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.rts = json.result
                            this.rt = this.rts[0].value

                            Promise.all([
                                this.getResources(),
                                this.getResNames(),
                                this.getRoleRes()
                            ]).then(_ => {
                                this.handleObjRRS()
                            })
                        }
                    })
            },
            close() {
                this.$emit('close-modal')
                this.$refs.resTable.clearSelection()
            },
            changeRT(val) {
                this.rt = val
            },

            getRoleRes() {
                return getRoleResource({role_id: this.roleId, resource_type: this.rt}, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.roleRes = json.result.length ? json.result : []
                            // this.handleObjRRS()
                        }
                    })
            },
            modifyRes() {
                return saveRoleRes({
                    role_id: this.roleId,
                    resource_type: this.rt,
                    resource_ids: this.choosedRow.length ? this.choosedRow.map(e => Number(e.resource_id)) : []
                }, {menu: this.menuId, ele: this.elementId}).then( json => {
                    if(json.code == 200) {
                        this.$message.success('资源授权成功')
                        this.close()
                    }
                })

            },
            chooseRow(row) {
                this.choosedRow = row
            },

            handleObjRRS() {

                this.$refs.resTable.clearSelection()
                var filters = this.tableData.filter(e => this.roleRes.map(el => el.resource_id).indexOf(e[`resource_${this.rt}_id`]) > -1)

                setTimeout(_ => {
                    filters.forEach(row => {
                        this.$refs.resTable.toggleRowSelection(row)
                    })
                })
            },

            transProp(actions) {
                var temp = actions.split(',')
                var ret = []
                this.names.forEach(e => {
                    if(temp.indexOf(String(e.id)) > -1) {
                        ret.push(e.operation_name)
                    }
                })
                return ret.join(',')
            },
        }
    }
</script>
