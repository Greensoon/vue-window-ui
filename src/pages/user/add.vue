<template>
    <div class="mu-user-add-wrap">
        <el-form label-width="80px" :model="userAdd">
            <el-form-item label="用户名">
                <el-input v-model="userAdd.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="userAdd.password"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名">
                <el-input v-model="userAdd.realname"></el-input>
            </el-form-item>
            <el-form-item label="手机">
                <el-input v-model="userAdd.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="userAdd.email"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="saveHandle" type="primary" :loading="loading">保存</el-button>
                <el-button @click="cancelHandle">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { addUserInfo } from '../../apis/post'

    export default {
        props: ['menuId', 'elementId'],
        data() {
            return {
                userAdd: {
                    username: '',
                    password: '',
                    realname: '',
                    mobile: '',
                    email: ''
                },
                loading: false
            }
        },
        methods: {
            saveHandle() {
                this.loading = true
                var msg = null
                for(var i in this.userAdd) {
                    if(!this.userAdd[i]) {
                        msg = '资料不能为空'
                    }

                    if(i == 'email') {
                        if(!/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/.test(this.userAdd[i])) {
                            msg = '邮箱格式错误'
                        }
                    }

                    if(i == 'mobile') {
                        if(!/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.userAdd[i])) {
                            msg = '手机格式错误'
                        }
                    }
                }

                if(msg) {
                    this.loading = false
                    this.$message.error(msg)
                    return false
                }

                addUserInfo(this.userAdd, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        this.loading = false
                        if(json.code == 200 ) {
                            this.$emit('close-modal')
                            this.$emit('fresh', json.result)
                            this.$notify({
                                title: '提示',
                                message: '添加用户成功',
                                type: 'success'
                            })
                            this.userAdd = {
                                username: '',
                                password: '',
                                realname: '',
                                mobile: '',
                                email: ''
                            }
                        } else {
                            this.$alert(json.message)
                        }
                    })
                    .catch(_ => {
                        this.loading = false
                    })
            },
            cancelHandle() {
                this.$emit('close-modal')
            }
        }
    }
</script>
