<template>
    <div>
        <div class="select-log">
			<div>
				<label for="">用户：</label>
				<el-select v-model="userCheck" clearable filterable placeholder="请选择">
					<el-option
					v-for="item in users"
					:key="item.id"
					:label="item.user_name"
					:value="item.user_id">
					</el-option>
				</el-select>
			</div>
			<div>
				<label for="">模块：</label>
				<el-select v-model="menuCheck" filterable clearable placeholder="请选择">
					<el-option
					v-for="item in menuList"
					clearable
					:key="item.menu_name"
					:label="item.menu_name"
					:value="item.menu_id">
					</el-option>
				</el-select>
			</div>
			<div>
				<el-button type="primary" @click="selectBtn">确定</el-button>
			</div>
		</div>

        <div class="mu-user-data">
            <el-table :data="userList"
                stripe
				v-loading="loading"
                style="width: 100%">
                <el-table-column
                    prop="user_name"
                    width="150"
                    label="用户">
                </el-table-column>
                <el-table-column
                    prop="action_name"
                    width="120"
                    label="操作">
                </el-table-column>
                <el-table-column
                    prop="app_name"
                    width="120"
                    label="模块">
                </el-table-column>
                <el-table-column
                    prop="menu_name"
                    width="200"
                    label="操作内容">
                </el-table-column>
                <el-table-column
                    prop="result"
					min-width="200"
                    label="结果">
                </el-table-column>
				<el-table-column
                    width="200"
                    label="时间">
					<template slot-scope="scope">
						{{handleDate(scope.row.create_time * 1000)}}
					</template>
                </el-table-column>
            </el-table>

            <div>
                <el-pagination background
					style="float:right; margin: 20px 0;"
					@size-change="handleSizeChange"
					@current-change="choosePage"
					:current-page="page"
					layout="total, sizes, prev, pager, next"
					:total="total">
                </el-pagination>
            </div>
        </div>

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
import dateMixins from '../date.mixins'
import { userLog, logUserlist, appList} from './api.js'

export default {
	props: ['elementIds', 'menuId'],
	mixins: [dateMixins],
	data() {
		return {
			loading: false,
			total: 0,
			pageSize: 10,
			page: 1,
			userList:[],
			users:[],
			userCheck:'',
			menuList:[],
			menuCheck: ''
		}
	},
	created() {
		this.getUserLists()
		this.userSelectList()
	},
	methods: {
		userSelectList() {
			logUserlist({
				menu: this.menuId
			}).then(body=> {
				if(body.code == 200) {
					this.users = body.result
				}
			})
			appList({
				menu: this.menuId
			}).then(body=> {
				if(body.code == 200) {
					let menus = body.result
					for(let i in menus) {
						this.menuList.push(menus[i])
					}
				}
			})
		},
		
		selectBtn(){
			this.page = 1
			this.getUserLists({
				user_id: this.userCheck,
				menu_id: this.menuCheck
			})
		},
		handleSizeChange(val) {
			this.pageSize = val
			this.getUserLists()
		},
		choosePage(current) {
			this.getUserLists({}, current)
		},
		getUserLists(params = {}, current) {
			let _this = this
			this.loading = true
			if(current) {
				this.page = current
			}
			return userLog(params, {menu: this.menuId, page: this.page, per_page: this.pageSize})
				.then(json => {
					this.loading = false
					this.loading = false
					if(json.code == 200) {
						this.userList = json.result
						this.total = json.result_info.total
					} else {
						this.$message.error(json.message)
					}
				}).catch(function(error) {
					_this.loafing = false
				})
		}
	}
}
</script>
