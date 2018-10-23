<template>
	<div class="auto-box">
		<div class="auto-top">
			<p>
				<label>平台：</label>
				<el-select @change="changePlatform" v-model="searchForm.platform_id" filterable placeholder="平台">
					<el-option v-for="(item, idx) in platforms"
						:key="'b_' + idx"
						:label="item.name"
						:value="item.value"> 
					</el-option>
				</el-select>
			</p>
			<p class="auto-input1">
				<label>区服范围：</label>
				<el-input type="number" min="0" v-model="searchForm.start_section" placeholder="开始"></el-input>
				<span>到</span>
				<el-input type="number" min="0" v-model="searchForm.end_section" placeholder="结束"></el-input>
				<span>区</span>
			</p>
			<p>
				<label>默认目标分区：</label>
				<!-- <el-select v-model="searchForm.target_section" filterable placeholder="请选择">
					<el-option v-for="(item, idx) in sections"
						:key="idx"
						:label="item.name"
						:value="item.id">
					</el-option>
				</el-select> -->
				<mu-select :options="sections" default-value v-model="searchForm.target_section"></mu-select>
			</p>
			<p class="widths">
				<el-button type="primary" @click="searchAction">查询</el-button>
			</p>
		</div>
		<div class="auto-table">
			<el-radio-group v-model="tabType" style="margin-bottom: 20px;">
				<el-radio-button label="wait">待执行</el-radio-button>
				<el-radio-button label="stop">不执行</el-radio-button>
			</el-radio-group>
			<div>
				<el-table :data="tableData" stripe border style="width: 100%">
					<el-table-column prop="name"
						label="游戏服"
						width="180">
					</el-table-column>
					<el-table-column prop="open_day"
						label="已开服天数"
						width="180">
					</el-table-column>
					<el-table-column prop="section_name"
						label="当前分区">
					</el-table-column>
					<el-table-column label="目标分区">
						<template slot-scope="scope">
							<span >
								{{scope.row.section_target}}
								<el-popover trigger="click">
									<el-select filterable v-model="scope.row.section_target_id" @change="changeSection(scope.row.section_target_id, scope.row.id)">
										<el-option :label="item.name"
											v-for="(item, i) in sections"
											:key="'a_'+ i"
											:value="item.id">
										</el-option>
									</el-select>

									<el-button icon="el-icon-edit"
										type="text"
										slot="reference">
									</el-button>
								</el-popover>
							</span>
						</template>
					</el-table-column>
					<el-table-column label="开服时间" prop="createtime"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="danger"  @click="deleteBtn(scope.row.id)" v-if="tabType == 'wait'">删除</el-button>
							<el-button type="success" @click="recoveryBtn(scope.row.id)" v-if="tabType == 'stop'">恢复</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pages">
				<el-button type="primary" @click="startBtn(ele.element_code)" v-if="tabType == 'wait' && ele.element_code == 121" v-for="(ele, i) in elementIds" :key="i">启动</el-button>
			</div>
		</div>

		<el-dialog title="启动窗口"
			:visible.sync="startVisible"
			append-to-body
			width="50%" >
			<div class="">
				<el-form ref="form" :model="startForm" label-width="80px">
					<el-form-item label="执行日期">
						<el-date-picker
							v-model="startForm.picktime"
							type="datetime"
							placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="上线状态">
						<el-select v-model="startForm.online_status" placeholder="请选择上线状态">
							<el-option label="自动上线" value="1"></el-option>
							<el-option label="手动上线" value="2"></el-option>
						</el-select>
					</el-form-item>
				</el-form>

				<el-form>
					<el-button @click="close">取消</el-button>
					<el-button type="primary" @click="confirmStart">确定</el-button>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import gpMixins from '../game-platform.mixins.js'
import { list } from '../sections/api'
import { search, start } from './api'

import dateMixins from '../date.mixins'

export default {
	mixins: [gpMixins, dateMixins],
	props: ['elementIds', 'menuId'],
	data() {
		return {
			searchForm: {
				platform_id: '',
				start_section: '',
				end_section: '',
				target_section: ''
			},
			sections: [],
			tempData: [],
			tableData: [],
			tabType: '',
			target_section_name: '',
			temp_section: '',
			startForm: {
				picktime: new Date(),
				online_status: '1'
			},
			startVisible: false,
			tempEle: -1
		}
	},
	watch: {
		tabType(val) {
			this.tableData = [...this.tempData].filter(el => el.status == val)
		}
	},
	methods: {
		searchAction() {
			if(!this.searchForm.target_section) {
				this.$message.error('请选择目标分区')
				return false
			}
			this.temp_section = this.searchForm.target_section 
			return search(this.searchForm)
				.then(json => {
					if(json.code == 200) {
						this.target_section_name = this.sections.filter(e => e.id == this.searchForm.target_section)[0].name
						this.tempData = json.result.map(e => {
							e.status = 'wait'
							e.section_target = this.target_section_name
							e.section_target_id = this.temp_section
							return e
						})
						this.tableData = [...this.tempData]
						this.tabType = 'wait'

					}
				})
		},
		
		changePlatform(val) {
			list({
				game_id: this.GAME_ID,
				platform_id: val,
				all: 'yes'
			}).then(json => {
				if(json.code == 200) {
					this.sections = json.result
					if(this.searchForm.target_section) {
						this.searchForm.target_section = ''
					}
				}
			})
		},
		changeSection(val, id) {
			this.tempData = this.tempData.map(e => {
				if(e.id == id) {
					e.section_target = this.sections.filter(el => el.id == val)[0].name
					e.section_target_id = val
				}
				return e
			})

			this.tempData = this.tempData.map(e => {
				if(e.id == id) {
					e.section_target = this.sections.filter(el => el.id == val)[0].name
					e.section_target_id = val
				}
				return e
			})
		},
		deleteBtn(id) {
			this.tableData = this.tableData.filter(e => e.id != id)

			this.tempData = this.tempData.map(e => {
				if(e.id == id) {
					e.status = 'stop'
				}
				return e
			})
		},
		recoveryBtn(id) {
			this.tableData = this.tableData.filter(e => e.id != id)

			this.tempData = this.tempData.map(e => {
				if(e.id == id) {
					e.status = 'wait'
				}
				return e
			})
		},
		startBtn(val) {
			this.startVisible = true
			this.tempEle = val
		},

		close() {
			this.startVisible = false
		},

		confirmStart() {
			const params = {
				platform_id: this.searchForm.platform_id,
				online_status: this.startForm.online_status,
				online_time: this.handleDate(this.startForm.picktime),
				data: JSON.stringify(this.tableData.map(e => {
					return {
						original_section: e.section_id,
						target_section: e.section_target_id,
						gameid: e.game_id
					}
				}))
			}

			start(params, {menu: this.menuId, ele: this.tempEle})
				.then(json => {
					if(json.code == 200) {
						this.$message.success('启动成功')
						this.close()

						this.tableData = this.tableData.map(e => {
							e.status = 'done'
							return e
						})
					}
				})
		},

		// change(val) {
		// 	this.searchForm.target_section = val
		// }
	}
}
</script>

<style lang="less">
.auto-input1 {
	.el-input {
		width: 100px;
	}
	.el-input__inner {
		padding-right: 0px;
	}
}
.auto-top {
	p {
		display: inline-block;
		margin-bottom: 20px;
		margin-right: 10px;
		vertical-align: middle;
		// width: 300px;
	}
	.el-input__icon {
		line-height: 30px;
	}

}
.auto-table {
	// min-height: 500px;
	.el-radio-button__inner {
		padding: 8px 14px;
	}
}
.widths {
	width: 120px !important;
}
.autoStatus {
	text-align: center;
	margin: 10px auto;
	font-size: 16px;
}
.pages {
	margin-top: 20px;
}
</style>
