<template>
    <div class="mu-getbackpwd">
        <el-form label-width="70px" :model="getbackPwdForm">
            <el-form-item class="gbp-title">
                <h2>密码找回</h2>
            </el-form-item>
            <el-form-item label="用户名：">
                <el-input v-model="getbackPwdForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码：">
                <el-input type="password" v-model="getbackPwdForm.password"></el-input>
            </el-form-item>
            <el-form-item label="验证码：">
                <el-input v-model="getbackPwdForm.code"></el-input>
            </el-form-item>

            <el-form-item >
                <el-button type="primary" @click="getbackPwd">提交</el-button>
            </el-form-item>

            <el-form-item style="text-align: right;">
                <router-link to="/login">返回登录</router-link>
            </el-form-item>

        </el-form>
    </div>
</template>
<script>
    import { getbackPwd } from '../../apis/post'

    export default {
        data() {
            return {
                getbackPwdForm: {
                    username: '',
                    password: '',
                    code: ''
                }
            }
        },
        methods: {
            getbackPwd() {
                getbackPwd(this.getbackPwdForm)
                    .then(json => {
                        if(json.code == 200) {
                            var msg = this.getbackPwdForm.code ? '更改成功' : '验证码已发送您的邮箱，请使用验证码来更改密码'
                            this.$message.success(msg)
                            // this.$router.push('/login')
                        } else {
                            this.$message.error(json.message)
                        }
                    })
            }
        }
    }
</script>
<style lang="less">
.mu-getbackpwd {
    width: 356px;
    height: 380px;
    position: absolute;

    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    margin: auto;

    .el-button {
        width: 100%;
    }

    .gbp-title {
        .el-form-item__content {
            margin-left: 0!important;
        }
    }

    h2 {
        text-align: center;
        font-weight: 600;
    }
}
</style>
