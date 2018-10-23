<template>
    <div class="mu-user-role">
        <!-- <h2>角色设置</h2> -->
        <ul class="mu-user-role-wrap">
            <li class="mu-user-role-item" v-for="(role, i) in roles" :key="i">
                <a @click="selectRoles(String(role.role_id))" :class="roleIds.indexOf( String(role.role_id) ) >= 0 ? 'mu-user-role-has' : ''">{{role.name}}</a>
            </li>
        </ul>
        <div class="mu-user-role-btns">
            <el-button type="primary" plain @click="saveRoles" :loading="saving">保存</el-button>
            <el-button @click="closeModal">取消</el-button>
        </div>
        
    </div>
</template>
<script>
/**
 * 角色设置
 */
    import { getRoles } from '../../apis/get'
    import { saveRoles } from '../../apis/patch'

    export default {
        props: ['userId', 'userRoles', 'menuId', 'elementId'],
        data() {
            var $this = this
            return {
                roles: [],
                saving: false,
                roleIds: $this.userRoles
            }
        },
        watch: {
            userRoles: {
                handler(newv) {
                    this.roleIds = newv
                },
                deep: true
            }
        },
        created() {
            getRoles({role_id: 0, direction: 'next', menu: this.menuId, ele: 10})
                .then(json => {
                    this.roles = json.result
                })
        },
        methods: {
            selectRoles(roleId) {
                var _index = this.roleIds.indexOf(roleId)
                if(_index >= 0) {
                    if(_index == 0) {
                        this.roleIds = this.roleIds.slice(1)
                    }
                    else {
                        this.roleIds = this.roleIds.slice(0, _index).concat(this.roleIds.slice(_index + 1))
                    }
                    
                } else {
                    this.roleIds.push(roleId)
                }
            },
            saveRoles() {
                this.saving = true
                saveRoles({
                    user_id: this.userId,
                    role_ids: this.roleIds
                }, {menu: this.menuId, ele: this.elementId}).then(json => {
                    this.saving = false
                    this.$message.success('角色绑定成功')
                    this.$emit('fresh')
                    this.$emit('close-modal')
                }).catch(err => {
                    this.saving = false
                })
            },
            closeModal() {
                this.$emit('close-modal')
            }
        }
    }
</script>
<style lang="less">
.mu-user-role-wrap {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;

    .mu-user-role-item {
        background: #69b1f9;
        margin-right: 10px;
        margin-bottom: 20px;

        a {
            color: #fff;
            padding: 10px 50px 10px 10px;
            display: block;
            overflow: hidden;
            position: relative;
            font-size: 16px;

            white-space: nowrap;

            border: 3px solid #69b1f9;
        }

        .mu-user-role-has {
            border: 3px solid #06c;

            &:after {
                content: '';
                position: absolute;

                width: 100px;
                height: 35px;
                background: #06c;
                transform: rotate(45deg);
                right: -53px;
                top: 5px;
            }

            &:before {
                content: '';
                position: absolute;

                width: 30px;
                height: 30px;
                background: url(../../../assets/img/icon-right.png) center no-repeat;

                background-size: 15px 15px;
                right: -2px;
                z-index: 2;
                top: -5px;
            }
        }
    }
}

.mu-user-role-btns {
    margin-top: 30px;
    text-align: right;
}
</style>
