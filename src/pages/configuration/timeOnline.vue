<template>
    <div>
        <div class="mu-user-data">
			<div :style="{margin: '10px 0 20px'}">
				<el-radio v-model="status" :label="1">待执行</el-radio>
				<el-radio v-model="status" :label="0">已执行</el-radio>
			</div>
            <el-table :data="configData" border style="width: 100%;">
				<el-table-column prop="platform_name" label="平台" min-width="160"></el-table-column>
				<el-table-column prop="section_name" label="分区" min-width="200"></el-table-column>
				<el-table-column prop="remark" label="备注" width="200"></el-table-column>
				<el-table-column label="服务" width="200">
					<template slot-scope="scope">
						<el-tag size="small" v-if="scope.row.extend == 1">重启拓展</el-tag>
						<el-tag size="small" type="success" v-if="scope.row.game == 1">重启游戏</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="结果" prop="result">
				</el-table-column>
				<el-table-column label="执行时间" width="160">
					<template slot-scope="scope">
						<div>{{handleDate(scope.row.exec_time * 1000)}}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="160">
					<template slot-scope="scope">
						<el-button size="mini"
							type="danger"
							v-for="(ele, i) in eles"
							:key="i"
							v-if="ele.element_code == 123 && status == 1"
							@click="delConfigList(scope.row.id,ele)">
							删除
						</el-button>
						<el-button size="mini" type="primary" @click="showDetail(scope.row.id)">查看详情</el-button>
					</template>
				</el-table-column>
			</el-table>

			<div class="page-change">
				<el-pagination
					@current-change="changePage"
					background
					layout="total, prev, pager, next"
					:total="total">
				</el-pagination>
			</div>
        </div>

		<!-- 查看详情 -->
		<el-dialog title="详情"
			:visible.sync="dialogVisible"
			:modal-append-to-body="false"
			:append-to-body="false">
			<el-table :data="gridData">
				<el-table-column property="types.name" label="名称"></el-table-column>
				<el-table-column property="types.cname" label="中文名称"></el-table-column>
				<el-table-column property="version" label="版本"></el-table-column>
			</el-table>

			<div :style="{marginTop: '20px'}">
				<el-button @click="dialogVisible = false">关闭</el-button>
			</div>
		</el-dialog>
    </div>
</template>
<style lang="less">
.mu-user-data {
    .el-table {
        border: 1px solid #ccc;
    }
}
.select-log {
	margin-bottom: 10px;
	& > div {
		display: inline-block;
		margin-right: 20px;
		margin-bottom: 10px;
		.el-input__icon {
			line-height: 30px;
		}
	}
}
</style>

<script>
import { timingList, delOnline, onlineInfo } from './api.js'
import dateMixins from '../date.mixins'

export default {
	props:['menu', 'eles', 'active'],
	mixins: [dateMixins],
	data() {
		return {
			configData: [],
			dialogVisible: false,
			gridData: [],
			total: 0,
			pageSize: 10,
			current: 1,
			status: 1,
		}
	},
	watch: {
		active: {
			handler(newv) {
				if(newv == 'three') {
					this.topList()
				}
			},
			deep: true
		},
		status(val) {
			this.status = val
			this.topList()
		}
	},
	methods: {
		changePage(val) {
			this.current = val
			this.topList()
		},
		delConfigList(id, ele) {
			let that = this
			this.$confirm('确定删除该任务？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				that.delLoading = true
				delOnline({ id }, {
					menu: this.menu,
					ele: ele.element_id
				}).then(body=> {
					that.delLoading = false
					if(body.code == 200) {
						this.topList()
						this.$message.success("删除成功")
					} else {
						this.$message.error(body.message)
					}
				}).catch(function (error) {
					that.delLoading = false;
					that.$message.error({showClose: true, message: error.message, duration: 2000});
				})
			})
		},
		topList() {
			//第一个表格
			return timingList({
				page: this.current,
				per_page: this.pageSize,
				status: this.status
			} ,{menu: this.menu}).then(body=> {
				if(body.code == 200) {
					this.configData = body.result
					this.total = body.result_info.total_count
				}
			})
		},

		showDetail(id) {
			this.dialogVisible = true

			onlineInfo({ id }).then(json => {
				if(json.code == 200) {
					this.gridData = json.result
				}
			})
		}
	}
}
</script>
