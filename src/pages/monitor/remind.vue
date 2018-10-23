<template>
	<div class="mu-remind-dialog">
		<el-dialog
		  title="警告阀值设置"
		  :visible="showFlag"
		  width="80%"
		  center
		  @close="cancel">

			<div class="mu-remind-dialog__panel">
				<div class="mu-remind-dialog__panel-title">
					<span class="mrdpt-step">1</span>
					<div class="mrdpt-content">
						<div class="mrdpt-content-label">关联资源</div>
						<div class="mrdpt-content-line"></div>
					</div>
				</div>
				<div class="mu-remind-dialog__panel-content">
					<el-form ref="form" :model="form" label-width="100px" :style="{width:'300px'}">
					  <el-form-item label="根路径">
					    <el-input v-model="form.name"></el-input>
					  </el-form-item>
					</el-form>
				</div>
			</div>

			<div class="mu-remind-dialog__panel">
				<div class="mu-remind-dialog__panel-title">
					<span class="mrdpt-step">2</span>
					<div class="mrdpt-content">
						<div class="mrdpt-content-label">设置警报规则</div>
						<div class="mrdpt-content-line"></div>
					</div>
				</div>
				<div class="mu-remind-dialog__panel-content">
					<el-form ref="form" :model="form" label-width="100px" :style="{width:'300px'}">
					  <el-form-item label="根路径">
					    <el-input v-model="form.name"></el-input>
					  </el-form-item>
					</el-form>
				</div>
			</div>


		  <span slot="footer" class="dialog-footer">
		    <el-button @click="cancel">取 消</el-button>
		    <el-button type="primary" @click="confirmHandler($event)">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		props: ['showRemind', 'cancel', 'confirm'],
		data() {
			var $flag = this.showRemind
			return {
				showFlag: $flag,
				form: {
					name: ''
				}
			}
		},
		created() {
			this.showFlag = this.showRemind
		},
		methods: {
			confirmHandler(e) {
				this.confirm()
			}
		},
		 watch: {
		 	showRemind(val) {
		 		this.showFlag = val
		 	}
		 }
	}
</script>
