<template>
	<div>
		<div class="datas">
			<label>选择日期</label>
			<el-date-picker v-model="values"
				type="daterange"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期">
			</el-date-picker>
			<el-button style="margin-left:30px;" type="primary" @click="getList">搜索</el-button>
		</div>
		<div>
			<el-table :data="tableData" stripe border style="width: 100%">
				<el-table-column
					prop="id"
					label="任务ID"
					width="180">
					</el-table-column>
				<el-table-column
					prop="game_name"
					label="游戏服"
					width="180">
					</el-table-column>
				<!-- <el-table-column
					prop="address"
					label="开服天数">
				</el-table-column> -->
				<el-table-column
					prop="original_section_name"
					label="源分区">
				</el-table-column>
				<el-table-column
					prop="target_section_name"
					label="目标分区">
				</el-table-column>
				<el-table-column
					prop="online_time"
					label="执行时间">
					<template slot-scope="scope">
						{{handleDate(scope.row.online_time * 1000)}}
					</template>
				</el-table-column>
				<el-table-column
					label="完成时间">
					<template slot-scope="scope">
						{{scope.row.fulfil_time == 0 ? '' : handleDate(scope.row.fulfil_time * 1000)}}
					</template>
				</el-table-column>
				<el-table-column
					prop="result"
					label="执行结果">
				</el-table-column>
				<el-table-column
					prop="result_info"
					label="结果信息">
				</el-table-column>

				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" color="danger" @click="deleteRecord(scope.row.id)">删除</el-button>
						<el-button type="text" color="danger" @click="modifyRecord(scope.row)">修改</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="page-change">
			<el-pagination
				@current-change="handleCurrentChange"
				:current-page="current"
				:page-size="pageSize"
				layout="total, prev, pager, next"
				:total="total">
			</el-pagination>
		</div>

		<el-dialog title="修改窗口"
			:visible.sync="modifyVisible"
			append-to-body
			width="50%" >
			<el-form :model="modifyForm" label-width="80px">
				<el-form-item label="执行日期">
					<el-date-picker
						v-model="modifyForm.picktime"
						type="datetime"
						placeholder="选择日期时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="上线状态">
					<el-select v-model="modifyForm.online_status" placeholder="请选择上线状态">
						<el-option label="自动上线" value="1"></el-option>
						<el-option label="手动上线" value="2"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="目标分区">
					<el-select v-model="modifyForm.target_section" placeholder="目标分区">
						<el-option :label="item.name" :value="item.id" v-for="(item, i) in sections" :key="i"></el-option>
					</el-select>
				</el-form-item>
			</el-form>

			<el-form>
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="confirmModify">确定</el-button>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { $list, $delete, $modify } from './api'
import { list } from '../sections/api'

import dateMixins from '../date.mixins'

export default {
	mixins: [dateMixins],
	props: ['activeFlag'],
	watch: {
		activeFlag(val) {
			if(val == 'second') {
				this.getList()
			}
		}
	},
	data() {
		return {
			values: [],
			tableData: [],
			current: 1,
			total: 0,
			pageSize: 10,
			modifyVisible: false,
			modifyForm: {
				picktime: new Date(),
				online_status: '1',
				id: 0,
				target_section: '',
			},
			sections: [],
		}
	},
	created() {
		this.getList()
	},
	methods: {
		
		handleCurrentChange(val) {
			this.current = val
			this.getList()
		},
		
		getList() {
			const params = {
				page: this.current,
				per_page: this.pageSize,
				start_time: this.values[0] ? this.handleDate( this.values[0]) : '',
				end_time: this.values[1] ? this.handleDate(this.values[1]) : ''
			}

			return $list(params)
				.then(json => {
					if(json.code == 200) {
						this.tableData = json.result

						this.total = json.result_info.total_count
						this.current = json.result_info.page
					}
				})
		},

		deleteRecord(val) {
			this.$confirm('确认要删除该记录?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				$delete({
					id: val
				}).then(json => {
					if(json.code == 200) {
						this.$message({
							type: 'success',
							message: '删除成功!'
						})
		
						this.getList()
					}
				})
			}).catch(() => {
				console.log(' ---->>> ')         
			})
		},
		modifyRecord(val) {
			this.modifyVisible = true
			this.modifyForm = {
				id: val.id,
				target_section: Number(val.target_section),
				online_status: val.online_status + '',
				picktime: this.handleDate(val.online_time * 1000)
			}

			list({
				all: 'yes',
				game_id: val.gameid,
				platform_id: val.platform_id
			}).then(json => {
				if(json.code == 200) {
					this.sections = json.result
				}
			})
		},

		confirmModify() {
			const params = {
				online_status: this.modifyForm.online_status,
				online_time: this.handleDate(this.modifyForm.picktime),
				id: this.modifyForm.id,
				target_section: this.modifyForm.target_section,
			}

			$modify(params).then(json => {
				if(json.code == 200) {
					this.$message.success('修改成功')
					this.close()
					this.getList()
				}
			})
		},

		close() {
			this.modifyVisible = false
		}
	}
}
</script>

<style lang="less">
.datas {
	margin-bottom: 20px;
	.el-date-editor .el-range__icon {
		line-height: 25px;
	}
	.el-date-editor .el-range__close-icon {
		line-height: 25px;
	}
	.el-date-editor .el-range-separator {
		width: 20px;
		line-height: 24px;
	}
}
</style>
