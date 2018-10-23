<template>
    <div>
        <el-form :model="userSearch" inline  class="user-search" @submit.native.prevent="submitForm">
            <el-form-item label="姓名">
                <el-input v-model="userSearch.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item>
        </el-form>

        <div class="mu-user-data">
            <el-table :data="userList"
                stripe
                v-loading="loading"
                @row-dblclick="checkUser"
                style="width: 100%">
                <el-table-column
                    prop="username"
                    width="150"
                    label="用户名">
                </el-table-column>
                <el-table-column
                    prop="realname"
                    width="120"
                    label="真实姓名">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    width="120"
                    label="手机">
                </el-table-column>
                <el-table-column
                    prop="email"
                    width="200"
                    label="邮箱">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" v-for="(ele, i) in elementIds" :key="i" size="small" @click="modifyUser(scope.row.user_id, ele.element_id, ele.menu_id)" v-if="ele.element_code == 102">编辑</el-button>
                        <el-button type="text" v-for="(ele, i) in elementIds" :key="i" size="small" @click="modifyRole(scope.row.user_id, scope.row.roles, ele.element_id, ele.menu_id)" v-if="ele.element_code == 107">角色管理</el-button>
                        <el-button type="text" v-for="(ele, i) in elementIds" :key="i" size="small" @click="deleteUser(scope.row.user_id, ele.element_id, ele.menu_id)" v-if="ele.element_code == 101">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="flex mu-user-flex">
                <div>
                    <el-button class="mu-user-add"
                        @click="addUser(ele.element_id)"
                        v-for="(ele, i) in elementIds"
                        :key="i"
                        v-if="ele.element_code == 100"
                    >
                        <i class="el-icon-plus"></i>添加
                    </el-button>
                </div>
                <el-pagination background
                    @current-change="choosePage"
                    layout="prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="添加用户" :visible.sync="addUserModal" :modal-append-to-body="false">
            <add @close-modal="closeAdd"
                @fresh="fresh"
                :menu-id="menuId"
                :element-id="currentEleId">
            </add>
        </el-dialog>

        <el-dialog :title="checkType == 'check' ? '查看用户' : '编辑用户'" :visible.sync="checkOrModifyUserModal" :modal-append-to-body="false">
            <modify @close-modal="closeCheck"
                :modal-type="checkType"
                :modal-data="checkUserInfo"
                @fresh="fresh"
                :menu-id="menuId"
                :element-id="currentEleId"
            ></modify>
        </el-dialog>

        <el-dialog title="角色设置" :visible.sync="roleModal" :modal-append-to-body="false">
            <permission
                @close-modal="closeRole"
                :user-id="userRoleId"
                :user-roles="userRoleIds"
                @fresh="fresh"
                :menu-id="menuId"
                :element-id="currentEleId"
            ></permission>
        </el-dialog>
    </div>
</template>
<style lang="less">
.mu-user-data {
    .el-table {
        border: 1px solid #ccc;
    }
}
</style>

<script>
    import { deleteUser } from '../../apis/delete'
    import { getUserList, getUserInfo, getLoguserMenus } from '../../apis/get'

    import Add from './add'
    import Modify from './modify'
    import Permission from './permission'
    import dateMixins from '../date.mixins'

    export default {
        mixins: [dateMixins],
        components: {
            Add,
            Modify,
            Permission
        },
        props: ['elementIds', 'menuId'],
        data() {
            return {
                userSearch: {
                    username: ''
                },
                userList: [],
                loading: true,
                addUserModal: false,
                modifyUserModal: false,
                checkType: '',
                checkOrModifyUserModal: false,
                checkId: 0,
                checkUserInfo: {},
                roleModal: false,
                checkRole: [],
                allRoles: [],
                total: 0,
                pageSize: 10,
                page: 1,
                userRoleId: 0,
                userRoleIds: [],
                currentEleId: 0
            }
        },
        created() {
            this.getUserList()
            // this.preventEnter()
        },
        methods: {
            preventEnter() {

            },
            submitForm(e) {
                // e.preventDefault()
                const _data = this.userSearch
                this.getUserList(_data)
            },
            choosePage(current) {
                this.getUserList({}, current)
            },
            getUserList(params = {}, current) {
                if(current) {
                    this.page = current
                }

                return getUserList(params, {menu: this.menuId, page: this.page})
                    .then(json => {
                        this.loading = false
                        if(json.code == 200) {
                            this.userList = json.result
                            this.total = json.result_info.total_count
                        } else {
                            this.$message.error(json.message)
                        }
                    })
            },

            deleteUser(userId, ele, menuId) {
                const $this = this
                this.$confirm('确认要删除该用户吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteUser({user_id: userId}, {menu: this.menuId, ele:ele})
                            .then(json => {
                                if(json.code == 200 ) {
                                    $this.$notify({
                                        title: '通知',
                                        message: '删除成功',
                                        type: 'success'
                                    })
                                    $this.fresh()
                                } else {
                                    $this.$alert(json.message)
                                }
                            })
                    })
            },
            checkUser(userId) {
                this.checkType = 'check'
                var _userId = typeof userId != 'object' ? userId : userId.user_id
                this.getUserInfo(_userId)
            },
            modifyUser(userId, ele, menu) {
                this.checkType = 'modify'
                this.currentEleId = ele
                this.getUserInfo(userId, ele, menu)
            },
            getUserInfo(userId, ele, menu) {
                return getUserInfo({userId}, {menu: this.menuId, ele: ele || 0})
                        .then(json => {
                            if(json.code == 200) {
                                this.checkOrModifyUserModal = true
                                this.checkUserInfo = json.result
                                this.checkUserInfo.update_time = this.handleDate(this.checkUserInfo.update_time * 1000)
                                this.checkUserInfo.create_time = this.handleDate(this.checkUserInfo.create_time * 1000)
                            }
                        })
            },
            closeCheck() {
                this.checkOrModifyUserModal = false
            },
            closeAdd() {
                this.addUserModal = false
            },

            fresh(data) {
                this.getUserList()
            },

            closeRole() {
                this.roleModal = false
            },
            modifyRole(userId, roles, ele, menu) {
                this.userRoleId = userId
                this.userRoleIds = roles
                this.currentEleId = ele
                this.roleModal = true
            },
            addUser(ele) {
                this.addUserModal = true
                this.currentEleId = ele
            }
        }
    }
</script>
