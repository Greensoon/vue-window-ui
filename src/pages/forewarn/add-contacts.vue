<template>
    <div class="aar-container add-contact">
		<div class="aar-container-line">
			<div class="aar-container-left vertical-top" >组名：</div>
			<div class="aar-container-right vertical-top padding-left">
				<el-input v-model.trim="groupAdd.group_name" placeholder="请输入组名"></el-input>
				<p class="msg-text">1-20位中英文、数字、下划线或"-"</p>
			</div>
		</div>
		<div class="aar-container-line">
			<div class="aar-container-left vertical-top">已选联系人：</div>
			<div class="aar-container-right vertical-top">
				<template>
					<el-transfer
						style="text-align: left; display: inline-block"
						v-model="userId"
						filterable
						:titles="['联系人', '已选联系人']"
						:data="userLists">
					</el-transfer>
				</template>
			</div>
		</div>
		<!--btn-->
		<div class="btn-bottom">
			<el-button size="small" type="primary" :disabled="!(groupAdd.group_name && userId.length>0)" @click="submitForm" :loading="loading">确认</el-button>
			<el-button size="small" @click="closeGroup">取消</el-button>
		</div>
	</div>
</template>
<script>
	import { userGroupAdd } from '../../apis/post'
    export default {
        components: {
        },
		props:['userList', 'menuId'],
        data() {
			var $this = this
            return {
				userLists: $this.userList,
				userId: [],
				groupAdd:{
					group_name: '' ,// 分组名称
					user_id: [] // 该分组下的用户ID
				},
				loading: false
            }
        },
        computed: {

        },
        watch: {
        },
        created() {

		},
        methods: {
			closeGroup() {
				this.loading = false,
				this.userId = [],
				this.groupAdd={
					group_name: '' ,
					user_id: ''
				},
				this.$emit('close-add')
			},
			submitForm() {
				this.loading = true
				var regs = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
				if(!regs.test(this.groupAdd.group_name)) {
					this.loading = false
                    this.$message.error('组名格式错误')
                    return false
				}
				this.groupAdd.user_id = this.userId.map(e => e).join(",")
				let  _this = this
				userGroupAdd(this.groupAdd,{menu: this.menuId}).then(body=> {
					_this.loading = false
					if ( body.code == 200 ) {
						_this.$message.success('添加成功')
						_this.$emit('fresh-group')
						_this.closeGroup()
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
<style lang="less">
	.add-contact{
		margin: 0 !important;
		.aar-container-line{
			padding:0 20px;
		}
		.aar-container-right {
			.msg-text{
				font-size: 12px;
				color: #000;
				padding: 10px 0;
			}
		}
		.padding-left{
			.el-input__inner{
				padding-left: 10px !important;
			}
		}
		.btn-bottom{
			margin-top: 30px;
			border-top: 1px solid #ccc;
			text-align: right;
			padding: 20px 20px 0;
		}
	}
</style>

