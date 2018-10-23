<template>
    <div :class="`mu-user-${modalType}`">
        <div :class="`mu-user-${modalType}-wrap`">
            <monitor-panel title="用户信息">
                <ul class="">
                    <li v-for="(key, i) in keys" :key="i" :style="key == 'user_id' ? {display: 'none'}: ''">
                        <span>{{getKeys(key)}}:</span>
                        <span>
                            <input v-if="modalType == 'modify'" v-model="modalData[key]" >
                            <span v-else>{{key== 'roles' ? getUserRole(modalData[key]) : modalData[key]}}</span>
                        </span>
                    </li>
                </ul>
            </monitor-panel>

            <div class="mu-user-modify-btns" v-if="modalType == 'modify'">
                <el-button type="primary" @click="modifyUser">确认</el-button>
                <el-button @click="closeModal">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import { modifyUser } from '../../apis/put'
    import { getRoles } from '../../apis/get'

    export default {
        props: ['modalType', 'checkId', 'modalData', 'menuId', 'elementId'],
        data() {
            return {
                keys: [],
                roles: [],
                modifyKeys: ['user_id', 'password', 'username', 'realname', 'mobile', 'email']
            }
        },
        watch: {
            modalType() {
                this.dataHandle()
            }
        },
        created() {
            this.dataHandle()
            getRoles({role_id: 0, direction: 'next', pagination_tensor: 'full'}, {menu: this.menuId})
                .then(json => {
                    this.roles = json.result
                })
        },
        methods: {
            dataHandle() {
                delete this.modalData.salt
                delete this.modalData.password

                if(this.modalType == 'modify') {
                    delete this.modalData.update_time
                    delete this.modalData.create_time
                    delete this.modalData.last_login_ip
                    delete this.modalData.login_count
                    delete this.modalData.status
                    delete this.modalData.roles
                    delete this.modalData.project_ids
                    delete this.modalData.dept_id
                }

                this.keys = Object.keys(this.modalData)
            },
            getKeys(key) {
                var keys = {
                    'user_id': '用户ID',
                    'username': '用户姓名',
                    'password': '密码',
                    'realname': '真实姓名',
                    'mobile': '手机',
                    'login_count': '登录',
                    'last_login_ip': '最后登录IP',
                    'email': '电子邮箱',
                    'status': '状态',
                    'create_time': '创建时间',
                    'update_time': '更新时间',
                    roles: '角色'
                }
                return keys[key]
            },
            getUserRole(roleIds) {
                return '[' + this.roles.filter(e => roleIds.indexOf(String(e.role_id)) >= 0).map(e => e.name).join(' , ') + ']'
            },
            modifyUser() {
                for(var i in this.modalData) {
                    if(this.modifyKeys.indexOf(i) < 0) {
                        delete this.modalData[i]
                    }
                }

                delete this.modalData.password
                modifyUser(this.modalData, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.closeModal()
                            this.$notify({
                                message: '修改成功',
                                type: 'success'
                            })
                            this.$emit('fresh')
                        } else {
                            this.$message.error(json.message)
                        }

                    })
            },
            closeModal() {
                this.$emit('close-modal')
            }
        }
    }
</script>
<style lang="less">
.mu-user-check,
.mu-user-modify {
    .mu-monitor-panel__title {
        height: 45px;
    }

    li {
        padding: 5px 10px;
        border-bottom: 1px solid #ccc;

        &:last-child {
            border-bottom: 0;
        }

        >span {
            &:first-child {
                width: 100px;
                display: inline-block;
            }

            input {
                width: 300px;
            }
        }
    }

    .mu-user-modify-btns {
        margin-top: 10px;
    }
}
</style>
