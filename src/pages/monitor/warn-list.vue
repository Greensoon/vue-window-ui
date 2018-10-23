<template>
	<div class="mu-monitor-warn">
		<h5 class="mu-monitor--title">
			预警规则
		</h5>
		<div class="margin-bottom" v-if="serverRuleList.length>0">
			<el-table
				ref="multipleTable"
				:data="serverRuleList"
				tooltip-effect="dark"
				style="width: 100%"
				@selection-change="handleSelectionChange">
				<el-table-column
					type="selection"
					width="55">
				</el-table-column>
				<el-table-column
					prop="rule_name"
					label="规则名称"
					width="200">
				</el-table-column>
				<el-table-column
					label="监控项"
					width="180">
					<template slot-scope="scope">{{ filterName(scope.row.data_name) }}</template>
				</el-table-column>
				<el-table-column
					label="维度"
					width="150">
					<template slot-scope="scope">{{ scope.row.group_name==0? '实例' : '分组：'+ scope.row.group_name }}</template>
				</el-table-column>
				<el-table-column
					label="报警规则">
					<template slot-scope="scope">
						{{ filterName(scope.row.data_name) + scope.row.operator + parseFloat(scope.row.critical_value) + filterName(scope.row.data_name,1) + ' 连续' + scope.row.number + '次' + ' 则报警'   }}
					</template>
				</el-table-column>
				<el-table-column
					prop="address"
					label="通知对象"
					width="220"
					show-overflow-tooltip>
					<template slot-scope="scope">{{ scope.row.user_group_name }}</template>
				</el-table-column>
				<el-table-column
					label="操作" width="150">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-for="(ele, i) in childIds" :key="i" v-if="ele.element_code == 102" @click="editRules(scope.row.id,ele)">修改</el-button>
						<el-button type="text" size="small" v-for="(ele, i) in childIds" :key="i" v-if="ele.element_code == 109 && scope.row.status == 2" @click="enableList(scope.row.id,ele.element_id)">启用</el-button>
						<el-button type="text" size="small" v-for="(ele, i) in childIds" :key="i" v-if="ele.element_code == 200 && scope.row.status == 1" @click="disableList(scope.row.id,ele.element_id)" >禁用</el-button>
						<el-button type="text" size="small" v-for="(ele, i) in childIds" :key="i" v-if="ele.element_code == 101" @click="delList(scope.row.id,ele.element_id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin: 20px 0 0">
				<!-- <el-button type="danger" size="mini" :disabled="this.sel.length===0" @click="disableList()">批量禁用</el-button> -->
				<el-button type="danger" size="mini" :disabled="sel.length==0" v-for="(ele, i) in childIds" :key="i" v-if="ele.element_code == 101"  @click="delList('',ele.element_id)">批量删除</el-button>
				<el-button type="primary" size="mini" v-for="(ele, i) in childIds" :key="i" v-if="ele.element_code == 100"  @click="addRules(ele)">添加规则</el-button>
				<el-pagination background layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="perPage" :total="total"
                       style="float:right;">
        		</el-pagination>
			</div>
		</div>
		<div class="add-rule" v-else>
			<p>暂无预警规则 <i v-for="(ele, i) in childIds" :key="i" v-if="ele.element_code == 100">，<span  @click="addRules(ele)">创建预警规则</span></i></p>
		</div>
	</div>
</template>
<script>
import { postServerRule } from "../../apis/post"
import { delRuleDisbale } from "../../apis/delete"
import { putRuleDisbale } from "../../apis/put"
import { getRuleEnable, getAllrule } from "../../apis/get"


export default {
	props: ['server-ip', 'addchange-list', 'editchange-list', 'childId', 'menuId'],
	components: {
	},

	data() {
		var $this = this
		return {
			childIds: $this.childId || {},
			menuIds: $this.menuId || '',
			addRule: false,
			editRule: false,
			total: 0,
			page: 1,
			perPage: 10,
			extendsIp: $this.serverIp || '',
			serverRuleList: [],
			ruleNameList: [
				{
					label: "cpu_percent",
					name: "cpu使用率",
					unit: "%"
				},
				{
					label: "disk_vda_use",
					name: "系统盘使用率",
					unit: "%"
				},
				{
					label: "disk_vdb_use",
					name: "数据盘使用率",
					unit: "%"
				},
				{
					label: "iops_read_speed",
					name: "磁盘IO读取速率",
					unit: "Bytes/s"
				},
				{
					label: "iops_write_speed",
					name: "磁盘IO写取速率",
					unit: "Bytes/s"
				},
				{
					label: "load_average",
					name: "系统平均负载",
					unit: ""
				},
				{
					label: "memory_used",
					name: "内存使用率",
					unit: "%"
				},
				{
					label: "process_total_num",
					name: "进程总数",
					unit: "个"
				},
				{
					label: "tcp_total_num",
					name: "tcp总数",
					unit: "个"
				},
				{
					label: "received_speed",
					name: "流入网速",
					unit: "kb/s"
				},
				{
					label: "send_speed",
					name: "流出网速",
					unit: "kb/s"
				},
				{
					label: "inode_vda",
					name: "数据盘inode使用率",
					unit: "%"
				},
				{
					label: "inode_vdb",
					name: "系统盘inode使用率",
					unit: "%"
				},
				{
					label: "mysql_connected",
					name: "mysql连接数",
					unit: "个"
				},
				{
					label: "iops",
					name: "iops",
					unit: "次/s"
				}
			],
			sel: []
		}
	},
	computed: {

	},
	watch: {
		addchangeList: {
			handler(newv) {
				this.defaultList()
			},
			deep: true
		},
		editchangeList: {
			handler(newv) {
				this.search()
			},
			deep: true
		}
	},
	methods: {
		//全选按钮
		handleSelectionChange(val) {
			this.sel = val;
		},
		//分页
		handleCurrentChange(val) {
			this.page = val;
			this.search();
		},
		//
		//规则列表
		search(){
			let that = this;
			if(that.extendsIp){
				let params = {
					ip: that.extendsIp,
					page: that.page,
					per_page: that.perPage
				};

				that.loading = true;
				postServerRule(params, {menu: this.menuIds}).then(body => {
					if (body.code == 200) {
						if(body.result && body.result.length){
							this.serverRuleList = body.result
							this.total = body.result_info.total*1
						}else{
							if(this.page==1){
								this.serverRuleList = body.result
								this.total = body.result_info.total*1
							} else {
								this.page = this.page -1
								this.search()
							}

						}
					}else{
						that.$message.error({showClose: true, message: body.message, duration: 2000});
					}
				}).catch(function (error) {
					that.loading = false;
					that.$message.error({showClose: true, message: error.message, duration: 2000});
				});
			} else {
				that.perPage = 15
				let params = {
					page: that.page,
					per_page: that.perPage
				};

				that.loading = true;
				getAllrule(params, {menu: this.menuIds}).then(body => {
					if (body.code == 200) {
						if(body.result && body.result.length){
							this.serverRuleList = body.result
							this.total = body.result_info.total*1
						}else{
							if(this.page==1){
								this.serverRuleList = body.result
								this.total = body.result_info.total*1
							} else {
								this.page = this.page -1
								this.search()
							}

						}
					}else{
						that.$message.error({showClose: true, message: body.message, duration: 2000});
					}
				}).catch(function (error) {
					that.loading = false;
					console.log(error);
					that.$message.error({showClose: true, message: error.message, duration: 2000});
				});
			}

		},
		//删除规则
		delList(val,ele) {
			let _this = this
			this.$confirm('确认删除该规则吗?', '提示', {type: 'warning'}).then(() => {
				_this.loading = true
				var delId = ""
				if(val) {
					delId = val
				} else {
					delId = _this.sel.map(e=> e.id).join(",")
				}
				delRuleDisbale({ rule_id: delId },{menu: _this.menuIds, ele: ele}).then(body=> {
					_this.loading = false;
					if(body.code == 200) {
						_this.$message.success({showClose: true, message: '删除成功', duration: 1500});
						_this.search();
					} else {
						_this.$message.error({showClose: true, message: body.message, duration: 2000});
					}
				}).catch(function (error) {
					_this.loading = false;
					_this.$message.error({showClose: true, message: error.message, duration: 2000});
				});
			})
		},
		//禁用规则
		disableList(val, ele) {
			let _this = this
			this.$confirm('确认禁用该规则吗?', '提示', {type: 'warning'}).then(() => {
				_this.loading = true
				var disId = ""
				if(val) {
					disId = val
				} else {
					disId = _this.sel.map(e=> e.id).join(",")
				}
				putRuleDisbale({ rule_id: disId }, { menu:_this.menuIds, ele: ele}).then(body=> {
					_this.loading = false;
					if(body.code == 200) {
						_this.$message.success({showClose: true, message: '禁用成功', duration: 1500});
						_this.search();
					} else {
						_this.$message.error({showClose: true, message: body.message, duration: 2000});
					}
				}).catch(function (error) {
					_this.loading = false;
					console.log(error);
					_this.$message.error({showClose: true, message: error.message, duration: 2000});
				});
			})
		},
		//启用规则
		enableList(val,ele) {
			let _this = this
			this.$confirm('确认启用该规则吗?', '提示', {type: 'warning'}).then(() => {
				_this.loading = true
				var enableId = ""
				if(val) {
					enableId = val
				} else {
					enableId = _this.sel.map(e=> e.id).join(",")
				}
				getRuleEnable({ id: enableId }, { menu: _this.menuIds, ele: ele}).then(body=> {
					_this.loading = false;
					if(body.code == 200) {
						_this.$message.success({showClose: true, message: '启用成功', duration: 1500});
						_this.search();
					} else {
						_this.$message.error({showClose: true, message: body.message, duration: 2000});
					}
				}).catch(function (error) {
					_this.loading = false;
					console.log(error);
					_this.$message.error({showClose: true, message: error.message, duration: 2000});
				});
			})
		},
		//名称转换
		filterName(val,msg) {
			var _list = this.ruleNameList.filter(e=> e.label==val)
			if(msg){
				return _list[0].unit
			} else {
				return _list[0].name
			}
		},
		//打开添加规则
		addRules(ele) {
			this.$emit('openAddRule')
			this.$emit('childreId', ele)
		},
		//编辑规则
		editRules(val,ele) {
			this.$emit('openEditRule',val)
			this.$emit('childreId', ele)
		},
		//默认第一页
		defaultList() {
			this.total =  0
			this.page =  1
			this.search()
		}
	},
	mounted() {
		this.defaultList()
	}
}
</script>
<style lang="less">
.mu-monitor-warn{
	.margin-bottom{
		.el-table{
			border: 1px solid #ccc;
		}
		.el-table th>.cell{
			font-size: 12px;
			color: #000;
		}
		.el-table .cell{
			font-size: 12px;
			color: #444;
			font-weight: 500;
		}
		.el-table__empty-block{
			width: 100% !important;
		}
	}
	.add-rule {
		border: 1px solid #ccc;
		text-align: center;
		padding: 30px 0;
		p {
			text-align: center;
			display: inline;
			span{
				color: #409eff;
				cursor: pointer;
			}
		}
	}
}
</style>

