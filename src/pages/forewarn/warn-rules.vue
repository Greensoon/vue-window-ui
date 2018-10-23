<template>
	<div class="warn-rule">
		<div class="warn-rule-center">
			<!--关联资源-->
			<div>
				<div class="aar-gap">
					<div class="aar-gap-index">1</div>
					<div class="aar-gap-title ng-binding">关联资源</div>
					<div class="aar-gap-line-c">
						<div class="aar-gap-line"></div>
					</div>
				</div>
				<div class="aar-container">
					<div class="aar-container-line">
						<div class="aar-container-left">产品：</div>
						<div class="aar-container-right">
							<el-select disabled v-model="warnRule.product_type" filterable placeholder="请选择">
								<el-option
									v-for="(item,index) in productType"
									:key="index"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</div>
					</div>
					<div class="aar-container-line">
						<div class="aar-container-left">资源范围：</div>
						<div class="aar-container-right">
							<el-select v-model="warnRule.resource_type" placeholder="请选择">
								<el-option
									v-for="(item,index) in resourceList"
									:key="index"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</div>

					</div>
					<div class="aar-container-line" v-if="warnRule.resource_type==1">
						<div class="aar-container-left">实例：</div>
						<div class="aar-container-right">
							<el-autocomplete
							v-model="warnRule.extranet_ip"
							:fetch-suggestions="querySearch"
							placeholder="请选择实例ip"
							></el-autocomplete>
						</div>
					</div>
					<div class="aar-container-line" v-else-if="warnRule.resource_type==2">
						<div class="aar-container-left">分组：</div>
						<div class="aar-container-right">
							<el-select v-model="warnRule.group_name" placeholder="请选择">
								<el-option
								v-for="(item,index) in groupList"
								:key="index"
								:label="item.name"
								:value="item.value">
								</el-option>
							</el-select>
						</div>
					</div>
				</div>
			</div>

			<!--设置报警规则-->
			<div>
				<div class="aar-gap">
					<div class="aar-gap-index">2</div>
					<div class="aar-gap-title ng-binding">设置报警规则</div>
					<div class="aar-gap-line-c">
						<div class="aar-gap-line"></div>
					</div>
				</div>
				<div class="aar-container">
					<div class="set-left">
						<div class="aar-container-line">
							<div class="aar-container-left">报警类型：</div>
							<div class="aar-container-right">
								<span class="btn-sm" :class="{'btn-primary' : alarmType == 0}" @click="alarmType = 0">阈值报警</span>
							</div>
						</div>
						<!--阈值报警-->
						<div v-for="(rule,index) in ruleList" :key="index">
							<div class="threshold-warn" v-if="alarmType == 0">
								<div class="aar-container-line">
									<div class="aar-container-left">规则名称：</div>
									<div class="aar-container-right">
										<el-input v-model.trim="rule.rule_name" placeholder="请输入内容" @blur="nameExist(rule)"></el-input>
									</div>
									<div class="add-warn-rule del-right" v-if="index>0">
										<span @click.prevent="delWarnrule(rule)">删除</span>
									</div>
								</div>
								<div class="aar-container-line">
									<div class="aar-container-left">规则描述：</div>
									<div class="aar-container-right rule-describe">
										<el-select v-model="rule.data_name" filterable placeholder="请选择">
											<el-option
												v-for="(item,index) in ruleNameList"
												:key="index"
												:label="item.name"
												:value="item.label">
											</el-option>
										</el-select>
										<el-select class="rule-describe-select2" v-model="rule.operator">
											<el-option
												v-for="(item,index) in operatorList"
												:key="index"
												:label="item"
												:value="item">
											</el-option>
										</el-select>
										<el-input type="number" v-model.trim="rule.critical_value"
												  class="rule-describe-select4" placeholder="阈值"></el-input>
										<span>{{ ruleNameList.filter(e => e.label == rule.data_name)[0].unit }}</span>
									</div>
								</div>
							</div>
						</div>

						<!--添加报警规则-->
						<div class="add-warn-rule">
							<span @click="addWarnrule" class="el-icon-plus">添加报警规则</span>
						</div>

						<div class="aar-container-line">
							<div class="aar-container-left">连续几次超过阈值后报警：</div>
							<div class="aar-container-right">
								<el-input-number class="rule-describe-select4" :precision="1" :step ="1"  size="mini" v-model="warnRule.number" controls-position="right" :min="1"></el-input-number>

								<!-- <el-input type="number" v-model.trim="warnRule.number" class="rule-describe-select4"
										  placeholder="临界值"></el-input> -->

								<el-popover placement="right" width="300" trigger="hover"
											content='即连续几次报警的探测结果符合您设置的规则描述，才会触发报警。例如规则描述为"CPU使用率 1分钟内平均值>80%,连续3次超过阈值后报警"，则连续出现3次 CPU使用率 1分钟内平均值>80%的情况，才会触发报警。'>
									<span slot="reference" class="el-icon-question"></span>
								</el-popover>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!--通知方式-->
			<div>
				<div class="aar-gap">
					<div class="aar-gap-index">3</div>
					<div class="aar-gap-title ng-binding">通知方式</div>
					<div class="aar-gap-line-c">
						<div class="aar-gap-line"></div>
					</div>
				</div>
				<div class="aar-container">
					<div class="aar-container-line">
						<div class="aar-container-left vertical-top">通知对象：</div>
						<div class="aar-container-right vertical-top padding-bottom">
							<template>
								<el-transfer
									style="text-align: left; display: inline-block"
									v-model="contGroupChecket"
									filterable
									:titles="['联系人通知组', '已选组']"
									:data="this.contGroupList">
									<div class="transfer-footer" slot="left-footer" size="small"
										 @click="addContact=true">快速创建联系人组
									</div>
								</el-transfer>
							</template>
						</div>
					</div>
					<div class="aar-container-line">
						<div class="aar-container-left">报警级别：</div>
						<div class="aar-container-right">
							<template>
								<el-radio v-model="warnRule.send_notices_type" label="1">Critical (短信+邮件) </el-radio>
							</template>
						</div>
					</div>
					<!-- <div class="aar-container-line">
						<div class="aar-container-left">报警回调：</div>
						<div class="aar-container-right max-width">
							<el-input :disabled="true" v-model.trim="value"
									  placeholder="例如：http://alart.aliyun.com:8080/callback"></el-input>
						</div>
						<el-popover placement="right" width="200" trigger="hover"
									content="填写公网可访问的URL，云监控会将报警信息通过POST请求推送到该地址，目前仅支持HTTP协议">
							<span slot="reference" class="el-icon-question"></span>
						</el-popover>
					</div> -->
				</div>
			</div>

		</div>
		<!--btn-->
		<div class="aar-bottom">
			<el-button size="small" type="primary" @click="submitForms" :loading = "loading">确认</el-button>
			<el-button size="small" @click="closeAddrule">取消</el-button>
		</div>


		<!--添加组-->
		<el-dialog title="新建联系人组" :visible.sync="addContact" :modal-append-to-body="false" custom-class="dialog-width">
			<add-contacts @close-add="closeAdd" @fresh-group="contactsList" :user-list="userList" :menuId="eleDatas.menu_id"></add-contacts>
		</el-dialog>
	</div>
</template>
<script>
	import addContacts from "./add-contacts";
	import searchSelect from "../../components/search-select";
	import {getServerTags, getUserList, getUserGroup, getAllExtranet, ruleNameExists} from "../../apis/get";
	import { postRuleAdd } from "../../apis/post"

	export default {
		components: {
			addContacts,
			searchSelect
		},
		props: ['serve-ip', 'ele-data'],
		data() {
			var $this = this
			return {
				eleDatas: $this.eleData || {},
				addContact: false,
				alarmType: 0,
				value: "",
				productType: [
					{
						value: "1",
						label: "ESC"
					}
				],
				resourceList: [
					{
						value: "1",
						label: "实例"
					},
					{
						value: "2",
						label: "分组"
					}
				],
				warnRule: {
					rule_name: "", // 规则名称
					data_name: "", // 监控字段名
					operator: "", // 运算符
					critical_value: "", // 临界值
					group_name: "", // 服务器分组名称
					product_type: "1", //产品类型 【ECS】
					resource_type:  $this.serveIp ? "1" : "2", //资源范围 【1 实例 2 分组】
					extranet_ip: $this.serveIp || "", //服务器IP 【如果资源类型是实例 那么就传IP】
					warning_type: "1", // 预警类型  目前只有阈值预警
					send_notices_type: "1", // 消息发送类型
					user_group_id: "", // 需要通知的用户组
					number: "" //连续触发次数
				},
				groupList: [],
				ruleList: [
					{
						rule_name: "",
						data_name: "cpu_percent",
						operator: ">=",
						critical_value: ""
					}
				],
				operatorList: [">=", ">", "<=", "<", "==", "!="],
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
				userList: [],
				contGroupList: [],
				contGroupChecket: [],
				loading: false,
				checkGroup: [],
				extendsList: []
			};
		},
		computed: {},
		watch: {
		},
		created() {
		},
		methods: {
			// 添加规则
			addWarnrule() {
				this.ruleList.push({
					rule_name: "",
					data_name: "cpu_percent",
					operator: ">=",
					critical_value: ""
				});
			},
			// 删除规则
			delWarnrule(item) {
				var index = this.ruleList.indexOf(item);
				if (index !== -1) {
					this.ruleList.splice(index, 1);
				}
			},
			//联系人分组
			contactsList() {
				getUserGroup({},{menu: this.eleDatas.menu_id}).then(body => {
					if (body.code == 200) {
						var res = body.result
						this.contGroupList = res.map(e=> {
							return {
								label: e.group_name,
				 				key: e.id,
							}
						})
					}
				});
			},
			//关闭新建分组
			closeAdd() {
				this.addContact = false;
			},
			closeAddrule() {
				this.$emit('closeAddRule')
			},
			submitForms() {
				this.loading = true
				var ruleAdd = {}
				var msg = ""
				if(this.warnRule.resource_type==1){
					this.warnRule.group_name = "0"
					if(!this.warnRule.extranet_ip ) {
						msg = '请输入实例ip'
					}
				}else if(this.warnRule.resource_type==2){
					this.warnRule.extranet_ip = ""
					if(!this.warnRule.group_name) {
						msg = '请选择分组'
					}
				}
				this.ruleList.forEach(e=> {
					if(!e.rule_name) {
						msg = '请输入规则名称'
					}
					if(!e.critical_value){
						msg = '请输入阈值'
					}
				})
				if(!this.warnRule.number) {
					msg = '请输入报警临界值'
				} else if (!/^[1-9]\d*$/.test(this.warnRule.number)){
					msg = '报警临界值必须为整数'
				}
				if(this.contGroupChecket.length<1){
					msg = '请选择通知对象'
				}
				if(msg) {
                    this.loading = false
                    this.$message.error(msg)
                    return false
				}

				this.warnRule.user_group_id = this.contGroupChecket.map(e=> e).join(",")
				var _len = this.ruleList.length
				var _this = this
				var getArrByColumn = function(column) {
					var ret = _this.warnRule[column]
					return Array(_len).fill(1).map(_ => ret)
				}

				//实例ip
				ruleAdd.extranet_ip = getArrByColumn('extranet_ip')
				for(var key in this.warnRule){
					if(!this.warnRule[key]==""){
						ruleAdd[key] = getArrByColumn(key)
					}
				}
				ruleAdd.rule_name = this.ruleList.map(e=> e.rule_name)
				ruleAdd.data_name = this.ruleList.map(e=> e.data_name)
				ruleAdd.operator = this.ruleList.map(e=> e.operator)
				ruleAdd.critical_value = this.ruleList.map(e=> e.critical_value)

				//增加规则完成
				postRuleAdd(ruleAdd,{menu: _this.eleDatas.menu_id, ele: _this.eleDatas.element_id}).then(body=> {
					_this.loading = false
					if ( body.code == 200 ) {
						this.$message.success('添加成功')
						_this.closeAddrule()
						_this.$emit('changeList',"1")
					} else {
						_this.loading = false;
						_this.$message.error(body.message)
					}
				}).catch(function (error) {
					_this.loading = false;
				});
			},
			getChecked(data) {
				this.checkGroup = data
			},
			//ip列
			querySearch(queryString, cb) {
				var extendsList = this.extendsList;
				var results = queryString ? extendsList.filter(this.createFilter(queryString)) : extendsList;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			createFilter(queryString) {
				return (state) => {
					return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
				};
			},
			//判断规则名称是否存在
			nameExist(val) {
				if(val.rule_name){
					var _filter = this.ruleList.filter(e=> e.rule_name == val.rule_name)
					if(_filter && _filter.length>1) {
						this.$message.error("规则名称已存在，请重新输入")
					} else {
						ruleNameExists({ name: val.rule_name }, {menu: this.eleDatas.menu_id}).then(body => {
							if(body.code == 200 && body.result == 0) {
								this.$message.error("规则名称已存在，请重新输入")
							}
						})
					}

				}
			}
		},
		mounted() {
			this.contactsList()
			//全部实例ip
			getAllExtranet({},{menu: this.eleDatas.menu_id}).then(body=> {
				if(body.code == 200) {
					this.extendsList = body.result.map(e=> {
						return{
							value: e
						}
					})
				}
			})
			// 产品分组列表
			getServerTags({},{menu: this.eleDatas.menu_id}).then(body => {
			  if (body.code == 200) {
				var result = body.result;
				var group = {};
				result.forEach(e=> {
					var array = group[e['group_name']] || [];
					array.push(e);
					group[e['group_name']] = array;
				});
				for(var key in group){
					this.groupList.push({
						value: key,
			        	name: key
					})
				}
			  }
			});

			//联系人列表
			getUserList({
				page: 1,
				per_page: 10000
			}, {menu: this.eleDatas.menu_id}).then(body => {
				if (body.code == 200) {
					var res = body.result
					this.userList = res.map(e => {
						return {
							label: e.realname,
							key: e.user_id,
						}
					})
				}
			});
		}
	};
</script>
<style lang="less">
	.warn-rule {
		padding: 20px 30px;
		.aar-gap {
			position: relative;
			height: 50px;
			&-index {
				background: #409eff;
				position: absolute;
				left: 0;
				top: 0;
				width: 36px;
				height: 36px;
				color: #fff;
				border-radius: 20px;
				text-align: center;
				line-height: 36px;
			}
			&-title {
				margin-left: 15px;
				font-weight: bold;
				font-size: 13px;
				position: absolute;
				left: 35px;
				top: 12px;
				background: #fff;
				padding-right: 8px;
			}
			&-line-c {
				height: 40px;
				margin: 0 50px 0 120px;
				line-height: 38px;
			}
			&-line {
				height: 0;
				border-bottom: 1px dotted #888888;
				display: inline-block;
				width: 100%;
			}
		}
		.aar-container {
			margin: 10px 65px;
			&-line {
				margin-bottom: 15px;
			}
			&-left {
				display: inline-block;
				vertical-align: middle;
				width: 80px;
				margin-right: 16px;
				font-size: 12px;
				font-weight: 500;
				color: #333 !important;
			}
			&-right {
				display: inline-block;
				vertical-align: middle;
				.el-input__inner {
					border: 1px solid #bbb;
					height: 30px;
					line-height: 28px;
					padding: 0 20px 0 5px;
					overflow: hidden;
					width: 250px;
					color: #444;
					text-align: left;
					font-size: 12px;
					font-weight: 500;
					border-radius: 0;
				}
				a {
					font-size: 12px;
					font-weight: 500;
				}
				.btn-sm {
					font-size: 12px;
					font-weight: 500;
					padding: 4px 12px;
					height: 24px;
					line-height: 14px;
					color: #333;
					border: 1px solid #ddd;
					background-color: #f7f7f7;
					cursor: pointer;
					border-radius: 0;
				}
				.btn-primary {
					color: #fff;
					border: 1px solid #409eff;
					background-color: #409eff;
					&:hover {
						border: 1px solid #40afff;
						background-color: #40afff;
					}
				}
				.margin-none .el-input__inner {
					margin-left: 0px !important;
				}
				.time-select-mini {
					width: 100px;
					.el-input__inner {
						width: 100px;
						padding: 0 30px;
					}
				}
				.search-select .search-select-button {
					padding: 7px 0;
					border-color: #bbb;
				}
			}
			&-text {
				font-size: 12px;
				font-weight: 500;
				color: #333;
			}
			.rule-describe {
				&-select1 {
					.el-input__inner {
						width: 70px;
						margin-left: 5px;
					}
				}
				&-select2 {
					.el-input__inner {
						width: 100px;
						margin-left: 5px;
					}
				}
				&-select3 {
					.el-input__inner {
						width: 130px;
					}
				}
				&-select4 {
					width: auto;
					margin-right: 5px;
					.el-input__inner {
						width: 100px;
						padding-right: 5px;
					}
				}
			}
			.vertical-top {
				vertical-align: top;
				.el-input__inner {
					width: 100%;
					padding: 0 10px 0 30px;
				}
				.el-transfer {
					.el-checkbox__label {
						font-size: 12px;
						color: #444;
						span{
							font-weight: 500;
						}
					}
				}
			}
			.padding-bottom {
				font-size: 12px;
				.el-transfer-panel__list.is-filterable {
					padding-bottom: 26px;
				}
				.el-transfer-panel .el-transfer-panel__empty {
					font-size: 12px;
				}
				.el-transfer-panel .el-transfer-panel__footer {
					height: 30px;
					line-height: 30px;
					text-align: center;
				}
				.transfer-footer {
					height: 30px;
					line-height: 30px;
					border: none;
					padding: 0;
					color: #409eff;
					font-size: 12px;
					cursor: pointer;
				}
			}
			.el-radio {
				height: 24px;
				line-height: 24px;
				.el-radio__label {
					font-size: 12px;
					color: #444;
					font-weight: 500;
				}
			}
			.max-width {
				padding: 0 3px;
				width: 570px;
				.el-input__inner {
					width: 100%;
				}
				.el-textarea__inner {
					font-size: 12px;
					padding: 5px 3px;
				}
			}
		}

		.set-left {
			display: inline-block;
			.threshold-warn,
			.event-warn {
				border-bottom: 1px solid #e0e0e0;
				margin-bottom: 15px;
			}
			.add-warn-rule {
				margin-bottom: 15px;
				color: #428bca;
				text-shadow: none;
				border: none;
				font-size: 12px;
				border-radius: 0px;
				padding: 0px 10px;
				// height: 32px;
				line-height: 14px;
				display: inline-block;
				font-weight: 900;
				span{
					font-weight: 900;
					&:hover {
					color: #06c;
					text-decoration: underline;
					cursor: pointer;
				}
				}

			}
			.del-right {
				float: right;
				margin-bottom: 0px;
				font-weight: normal;
				span{
					font-weight: normal
				}
			}
		}
		.aar-bottom {
			border-top: 1px solid #e5e5e5;
			margin: 0 40px;
			padding: 30px;
		}
	}

	.el-popover--plain {
		font-size: 12px;
		color: #444;
		line-height: 18px;
		padding: 12px;
	}

	.dialog-width {
		width: 60%;
		min-width: 700px;
		.el-dialog__header {
			padding: 10px 20px;
		}
		.el-dialog__body {
			border-top: 1px solid #ccc;
			padding: 30px 0;
		}
		.el-dialog__headerbtn {
			top: 13px;
		}
		.el-dialog__title {
			font-size: 14px;
			color: #000;
		}
	}
</style>
