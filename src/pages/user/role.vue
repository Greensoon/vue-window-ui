<template>
    <div>
        <!-- <el-form :model="roleSearch" ref="roleSearch" inline class="role-search">
            <el-form-item label="角色名称" prop="username">
                <el-input width="200" v-model="roleSearch.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('roleSearch')">查询</el-button>
            </el-form-item>
        </el-form> -->

        <div class="mu-user-data">
            <el-table :data="roles"
                stripe
                v-loading="loading"
                @row-dblclick="checkRole"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="角色名字">
                </el-table-column>
                <el-table-column
                    prop="desc"
                    label="描述">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text"
                            v-for="(ele, i) in elementIds"
                            :key="'modify' + i"
                            size="small"
                            @click="modifyRole(scope.row.role_id, ele.element_id)"
                            v-if="ele.element_code == 102" >编辑</el-button>
                        <el-button type="text"
                            v-for="(ele, i) in elementIds"
                            :key="'delete' + i"
                            size="small"
                            @click="deleteRole(scope.row.role_id, ele.element_id)"
                            v-if="ele.element_code == 101" >删除</el-button>
                        <el-button type="text"
                            v-for="(ele, i) in elementIds"
                            :key="'permission' + i"
                            size="small"
                            @click="permission(scope.row.role_id, ele.element_id)"
                            v-if="ele.element_code == 106"
                        >菜单授权</el-button>
                        <el-button type="text"
                            v-for="(ele, i) in elementIds"
                            :key="'resouce' + i"
                            size="small"
                            @click="resource(scope.row.role_id, ele.element_id)"
                            v-if="ele.element_code == 112"
                        >资源授权</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="flex mu-user-flex">
                <el-button v-for="(ele, i) in elementIds"
                    :key="i"
                    class="mu-user-add"
                    @click="showAddRole(ele.element_id)"
                    v-if="ele.element_code == 100"
                ><i class="el-icon-plus"></i>添加</el-button>
                <el-pagination background
                    layout="total, prev, pager, next"
                    :current-page="current"
                    @current-change="goHandle"
                    :total="total">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="添加角色" :visible.sync="addRoleModal" :modal-append-to-body="false">
            <add @close-modal="closeAdd"
                :element-id="currentEleId"
                :menu-id="menuId"
                @fresh="fresh">
            </add>
        </el-dialog>

        <el-dialog :title="checkType == 'check' ? '查看角色' : '编辑角色'" :visible.sync="checkOrModifyRoleModal" :modal-append-to-body="false">
            <modify @close-modal="closeCheck"
                :element-id="currentEleId"
                :menu-id="menuId"
                :modal-type="checkType"
                :modal-data="checkRoleInfo"
                @fresh="fresh">
            </modify>
        </el-dialog>

        <el-dialog custom-class="rp-wrap" title="角色授权" width="70%" :visible.sync="permissionModal" :modal-append-to-body="false" :show-close="false">
            <role-permission @close-modal="closePermission"
                :element-id="currentEleId"
                :menu-id="menuId"
                @fresh="fresh"
                :role-id="role_id">
            </role-permission>
        </el-dialog>

        <el-dialog title="资源授权" :close-on-click-modal="false" :visible.sync="resourceModal" :modal-append-to-body="false" :show-close="false">
            <role-res @close-modal="closeResource"
                :element-id="element__id"
                :menu-id="menuId"
                :show="resourceModal"
                :role-id="role_id">
            </role-res>
        </el-dialog>
    </div>
</template>
<script>
    import dateMixins from '../date.mixins'
    import { deleteRole } from '../../apis/delete'
    import { getRoles, getRoleInfo } from '../../apis/get'

    import Add from './role-add'
    import Modify from './role-modify'
    import RolePermission from './role-permission'
    import RoleRes from './role-res'

    export default {
        mixins: [dateMixins],
        components: {
            Add,
            Modify,
            RolePermission,
            RoleRes
        },
        props: ['elementIds', 'menuId'],
        data() {
            return {
                roleSearch: {
                    username: '',
                    email: ''
                },
                roles: [],
                loading: true,
                addRoleModal: false,
                modifyRoleModal: false,
                checkType: '',
                checkOrModifyRoleModal: false,
                checkId: 0,
                checkRoleInfo: {},
                roleModal: false,
                allRoles: [],
                rolesIds: [],
                role_id: 0,
                direction: 'next',
                done: false,
                total: 0,
                pageSize: 10,
                pages: 0,
                prev_role_id: 0,
                next_role_id: 0,
                permissionModal: false,
                currentEleId: 0,
                current: 1,
                resourceModal: false,
                element__id: 0
            }
        },
        created() {
            this.getRoles()
        },
        methods: {
            getRoles() {
                return getRoles({
                    role_id: this.role_id,
                    direction: this.direction,
                    pagination_tensor: 'full',
                    menu: this.menuId
                }).then(json => {
                    this.loading = false
                    if(json.code == 200) {
                        this.roles = json.result

                        this.next_role_id = json.result_info.next_role_id
                        this.prev_role_id = json.result_info.prev_role_id
                        this.total = json.result_info.total_count
                        this.pages = this.total % this.pageSize == 0 ? ( this.total / this.pageSize ) : Math.ceil(this.total / this.pageSize)
                    } else {
                        this.$message.error(json.message)
                    }
                })
            },

            deleteRole(roleId, ele) {
                const $this = this
                this.$confirm('确认要删除该角色吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRole({role_ids: [roleId]}, {ele, menu: this.menuId})
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
            goHandle() {
                this.loading = true
                this.getRoles()
            },
            checkRole(roleId) {
                this.checkType = 'check'
                var _roleId = typeof roleId != 'object' ? roleId : roleId.role_id
                this.getRoleInfo(_roleId)
            },
            modifyRole(roleId, ele) {
                this.checkType = 'modify'
                this.currentEleId = ele
                this.getRoleInfo(roleId)
            },
            getRoleInfo(roleId) {
                return getRoleInfo(roleId, {menu: this.menuId})
                        .then(json => {
                            if(json.code == 200) {
                                this.checkOrModifyRoleModal = true
                                this.checkRoleInfo = json.result
                                this.checkRoleInfo.update_time = this.handleDate(this.checkRoleInfo.update_time * 1000)
                                this.checkRoleInfo.create_time = this.handleDate(this.checkRoleInfo.create_time * 1000)
                            }
                        })
            },

            closeCheck() {
                this.checkOrModifyRoleModal = false
            },

            closeAdd() {
                this.addRoleModal = false
            },

            fresh(data) {
                this.getRoles()
            },

            permission(roleId, ele) {
                this.permissionModal = true
                this.role_id = roleId
                this.currentEleId = ele
            },

            resource(roleId, ele) {
                this.resourceModal = true
                this.role_id = roleId
                this.element__id = ele
            },

            closeResource() {
                this.resourceModal = false
            },

            closePermission() {
                this.permissionModal = false
            },

            showAddRole(ele) {
                this.addRoleModal = true
                this.currentEleId = ele
            }
        }
    }
</script>
