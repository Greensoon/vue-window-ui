<template>
    <div>
        <div class="mu-user-data">
            <el-table :data="logs"
                stripe
				border
				v-loading="loading"
                style="width: 100%">
                <el-table-column
                    prop="user_name"
                    min-width="150"
                    label="用户">
                </el-table-column>
                <el-table-column
                    prop="action_name"
                    min-width="120"
                    label="操作">
                </el-table-column>
                <el-table-column
                    prop="app_name"
                    min-width="120"
                    label="配置类型">
                </el-table-column>
                <el-table-column
                    prop="menu_name"
                    min-width="200"
                    label="配置名称">
                </el-table-column>
				<el-table-column
                    min-width="200"
                    label="时间">
					<template slot-scope="scope">
						{{handleDate(scope.row.create_time * 1000)}}
					</template>
                </el-table-column>
				<el-table-column
                    prop="version"
					min-width="200"
                    label="操作">
					<template slot-scope="scope">
						<el-button v-if="scope.row.action_name != '打全量包' && scope.row.action_name != '一键回滚'" type="text" @click="checkData(scope.row)">查看</el-button>
					</template>
                </el-table-column>
            </el-table>

            <div class="page-change">
                <el-pagination background
					@size-change="handleSizeChange"
					@current-change="choosePage"
					:current-page="page"
					layout="total, sizes, prev, pager, next"
					:total="total"
					:page-size="pageSize">
                </el-pagination>
            </div>
        </div>

		<el-dialog title="信息详情" stripe :visible.sync="dialogVisible" append-to-body>
            <el-table :data="gridData" border stripe>
                <el-table-column label="版本详情">
					<template slot-scope="scope">
						{{scope.row}}
					</template>
				</el-table-column>
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

import { logList } from './api'
import dateMixins from '../date.mixins'
export default {
	props: ['elementIds', 'menuId', 'activeFlag'],
	mixins: [dateMixins],
	data() {
		return {
			loading: false,
			total: 0,
			pageSize: 10,
			page: 1,
			logs:[],
			dialogVisible: false,
			gridData: []
		}
	},
	created() {
		this.logList()
	},
	watch: {
		activeFlag(val) {
			if(val == 'second') {
				this.logList()
			}
		}
	},
	methods: {
		handleSizeChange(val) {
			this.pageSize = Number(val)
			this.page = 1
			this.logList()
		},
		choosePage(current) {
			this.page = current
			this.logList()
		},
		logList() {
			return logList({
				page: this.page,
				per_page: this.pageSize
			}).then(json => {
				if(json.code == 200) {
					this.logs = json.result
					this.total = json.result_info.total
					this.pageSize = Number(json.result_info.per_page)
				}
			})
		},
		checkData(row) {
			this.dialogVisible = true
			this.gridData = row.version.split(',')
		}
	}
}
</script>
