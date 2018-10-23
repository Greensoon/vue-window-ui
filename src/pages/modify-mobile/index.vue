<template>
    <div class="mu-modify-password">
        <el-form label-width="80px" :model="modifyPwdForm">
            <el-form-item label="原密码:">
                <el-input v-model.trim="modifyPwdForm.password"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model.trim="modifyPwdForm.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
                <el-input v-model.trim="modifyPwdForm.rePassword"></el-input>
            </el-form-item>

            <el-form-item class="text-right">
                <el-button class="mu-modify-confirm" @click="submit" :loading="loading">确认</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="less">
/*setting*/
.mu-modify-password {
    .el-form {
        padding: 15px;
    }

    .el-form-item {
        margin-bottom: 10px;
    }

    .el-input__inner {
        border-radius: 0;
        height: 30px;
        line-height: 30px;
    }

    .el-form-item__content {
        text-align: right;
    }

    .mu-modify-confirm {
        border-radius: 0;
        padding-top: 8px;
        padding-bottom: 8px;
    }
}
</style>


<script>
import { putPassword } from "../../apis/put"
import { logout } from "../../utils/auth"
export default {
    data() {
        return {
            modifyPwdForm: {
                password: '',
                newPassword: '',
                rePassword: ''
			},
			loading: false
        }
	},
	methods: {
		submit() {
			var pass = this.modifyPwdForm
			this.loading = true
			for( var i in pass ) {
				if(!pass[i]) {
					this.$message.error('密码不能为空')
					this.loading = false
					return false
				}
			}

			if( pass.password == pass.newPassword ) {
				this.$message.error('新密码输入错误')
				this.loading = false
				return false
			}
			if(pass.rePassword != pass.newPassword) {
				this.$message.error('密码不匹配')
				this.loading = false
				return false
			}
			let _this = this
			putPassword({
				last_password: pass.password,
				current_password: pass.newPassword
			}).then(body => {
				_this.loading = false
				if ( body.code == 200 ) {
					_this.$message({
						message: '密码修改成功',
						type: 'success'
					});
					logout()
				} else {
					_this.loading = false;
					_this.$message.error(body.message)
				}
			}).catch(function (error) {
				_this.loading = false;
			});


		}

	}

}
</script>

