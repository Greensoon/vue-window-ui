<template>
	<div class="ps-login adapt-mobile">
		<div class="ps-login-form">
			<!-- <img src="../../../assets/img/logo-text.png" alt="" class="ps-login-logo"> -->
			<div class="pslf-title">
				登录
			</div>
			<el-form status-icon :model="loginForm" :rules="rules" ref="loginForm" label-width="100px">
			  <el-form-item label="用户名" prop="username">
			    <el-input type="text" v-model="loginForm.username" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="密码" prop="password">
			    <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-button type="primary" class="ps-login-btn" @click="onSubmit('loginForm')">登录</el-button>
			  </el-form-item>

			  <el-form-item class="ps-tip-line">
			  	<el-checkbox v-model="checked">记住我</el-checkbox>
			  	<router-link to="/getbackPwd" class="ps-tip-link">找回密码</router-link>
			  </el-form-item>
			</el-form>
		</div> 
	</div>
</template>

<script>
	import { notNull } from '../../utils/valid'
	import { mapState, mapActions } from 'vuex'
	import { setToken, setLoginUser, setLoguserMenus, setLastActiveTime } from '../../utils/auth'
	import { login } from '../../apis/post'

	export default {
		name: 'login',
		data() {
			var checkNull = (rule, value, callback, msg) => {
				var _check = notNull(value)
				if(!_check) {
					return callback ? callback(new Error(msg)) : msg
				}
				callback &&  callback()
			}

			var _crule = function(msg) {
				return function(rule, value, callback) {
					return checkNull(rule, value, callback, msg)
				}
			}

			this.valid_username = _crule('用户名不能为空')
			this.valid_password = _crule('密码不能为空')

			return {
				loginForm: {
		          username: '',
		          password: ''
		        },
		        rules: {
		          username: [
		            { validator: this.valid_username, trigger: 'blur' }
		          ],
		          password: [
		            { validator: this.valid_password, trigger: 'blur' }
		          ]
		        },
				checked: true
			}
		},
		created() {
			var $this = this
			document.onkeydown=function(event) {
				var e = event ? event : (window.event ? window.event : null)
				if(e.keyCode==13) {
					$this.onSubmit()
				}
			}
		},
		beforeDestroy() {
			document.onkeydown = null
		},
		methods: {
			onSubmit() {
				var msgs = [
					this.valid_username(null, this.loginForm.username),
					this.valid_password(null, this.loginForm.password)
				]

				var msg = msgs.filter(e=> !!e)[0]
				if(msg) {
					this.$message.error(msg)
					return false
				}
				const {username, password} = this.loginForm
				login({username, password})
					.then(json => {
						if(json.code != 200) {
							this.$message({
								message: json.message,
								type: 'error',
								center: true
							})
						} else {
							if(this.checked) {
								setToken(json.result.jwt_token, 30)
							} else {
								setToken(json.result.jwt_token)
							}

							setLoginUser({username})
							setLastActiveTime(new Date().getTime())

							this.$message({
								message: '登录成功',
								type: 'success',
								center: true
							})
							this.$router.push('/')
							if(json.result.menu && json.result.menu.length) {
								setLoguserMenus(JSON.stringify(json.result.menu))
							}
						}
					})
			}
		}
	}
</script>

<style lang="less">
.auto-size {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}

.middle-center {
    .auto-size;
    margin: auto;
}

.ps-login {
	position: absolute;
	.auto-size;

	&:before {
		content: '';
		background: url('../../../assets/img/login-bg.jpg') no-repeat center;
		background-size: cover;
		.auto-size;
		position: absolute;
	}

	&-logo {
		height: 40px;
	}

	.ps-login-form {
		width: 341px;
		height: 361px;
		background: rgba(255,255,255,0.5);
		position: absolute;

		// .middle-center;
		top: 0;
		bottom: 0;
		right: 200px;
		margin: auto;
		padding: 30px 20px;
		border-radius: 10px;
		box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.5);
	}

	.pslf-title {
	    font-size: 22px;
	    margin: 10px 0;
	    color: #000;
	}

	.el-form-item {
		&__label {
			float: none;
			line-height: 20px;
			font-size: 10px
		}

		&__content {
			margin-left: 0!important;
		}
	}

	.ps-magtop {
		margin-top: 60px;
		//出现坍塌和折叠问题
	}

	.ps-login-btn {
		width: 100%;
		line-height: 20px;

		span {
			color: #fff;
		}
	}

	.ps-tip-link {
		color: #303030;
		float: right;

		margin-left: 10px;
		&:hover {
			text-decoration: underline;
		}
	}

	.ps-tip-line {
		.el-form-item__content {
			line-height: 20px;
		}

		.el-checkbox__label,
		.ps-tip-link {
			font-size: 12px;
		}
	}

	.el-input__inner {
		height: 36px;
		line-height: 36px;
	}
}
</style>
