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
							<el-select disabled v-model="warnRule.resource_type" placeholder="请选择">
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
							<el-input disabled v-model.trim="warnRule.extranet_ip" placeholder="请输入实例ip"></el-input>
						</div>
					</div>
					<div class="aar-container-line" v-else-if="warnRule.resource_type==2">
						<div class="aar-container-left">分组：</div>
						<div class="aar-container-right">
							<el-input disabled v-model.trim="warnRule.group_name" placeholder="请输入分组名称"></el-input>
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
						<!-- <div class="add-warn-rule">
							<span @click="addWarnrule" class="el-icon-plus">添加报警规则</span>
						</div> -->

						<div class="aar-container-line">
							<div class="aar-container-left">连续几次超过阈值后报警：</div>
							<div class="aar-container-right">
								<el-input-number class="rule-describe-select4" :precision="1" :step ="1"  size="mini" v-model="warnRule.number" controls-position="right" :min="1"></el-input-number>

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
			<add-contacts @close-add="closeAdd" @fresh-group="contactsList" :menuId="eleDatas.menu_id" :user-list="userList"></add-contacts>
		</el-dialog>
	</div>
</template>
<script>
	import addContacts from "./add-contacts";
	import searchSelect from "../../components/search-select";
	import { getUserList, getUserGroup, getRuleDetail, ruleNameExists} from "../../apis/get";
	import { putRuleEdit } from "../../apis/put"

	export default {
		components: {
			addContacts,
			searchSelect
		},
		props: ['rule-id', 'ele-data'],
		data() {
			var $this = this
			return {
				eleDatas: $this.eleData || {},
				ruleID: $this.ruleId || '',
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
					resource_type: "2", //资源范围 【1 实例 2 分组】
					extranet_ip: "", //服务器IP 【如果资源类型是实例 那么就传IP】
					warning_type: "1", // 预警类型  目前只有阈值预警
					send_notices_type: "1", // 消息发送类型
					user_group_id: "", // 需要通知的用户组
					number: "" //连续触发次数
				},
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
				ruleName: ""
			};
		},
		computed: {},
		watch: {
		},
		created() {
		},
		methods: {
			//联系人分组
			contactsList() {
				getUserGroup({},{ menu: this.eleDatas.menu_id }).then(body => {
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
				this.$emit('closeEditRule')
			},
			submitForms() {
				this.loading = true
				var ruleAdd = {
					rule_id: "",
					rule_name: "",
					data_name: "",
					operator: "",
					critical_value: "",
					user_group_id: "",
					number: ""
				}
				var msg = ""
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
				this.warnRule.rule_name = this.ruleList.map(e=> e.rule_name).join(",")
				this.warnRule.data_name = this.ruleList.map(e=> e.data_name).join(",")
				this.warnRule.operator = this.ruleList.map(e=> e.operator).join(",")
				this.warnRule.critical_value = this.ruleList.map(e=> e.critical_value).join(",")
				for (var key in ruleAdd ){
					ruleAdd[key] = this.warnRule[key]
				}
				ruleAdd.rule_id = this.warnRule.id

				let _this = this
				//增加规则完成
				putRuleEdit(ruleAdd,{menu: _this.eleDatas.menu_id, ele: _this.eleDatas.element_id}).then(body=> {
					_this.loading = false
					if ( body.code == 200 ) {
						this.$message.success('修改成功')
						_this.closeAddrule()
						_this.$emit('changeList',"2")
					} else {
						_this.loading = false
						this.$message.error(body.message)
					}
				}).catch(function (error) {
					_this.loading = false;
				});
			},
			getChecked(data) {
				this.checkGroup = data
			},
			//判断规则名称是否存在
			nameExist(val) {
				if(val.rule_name && val.rule_name !=this.ruleName){
					var _filter = this.ruleList.filter(e=> e.rule_name == val.rule_name)
					if(_filter && _filter.length>1) {
						this.$message.error("规则名称已存在，请重新输入")
					} else {
						ruleNameExists({ name: val.rule_name }, { menu: this.eleDatas.menu_id }).then(body => {
							if(body.code == 200 && body.result == 0) {
								this.$message.error("规则名称已存在，请重新输入")
							}
						})
					}

				}
			}
		},
		mounted() {
			//规则详情
			getRuleDetail({id: this.ruleID}, { menu: this.eleDatas.menu_id }).then(body=> {
				if(body.code == 200 && body.result) {
					this.warnRule = body.result
					for (var key in this.ruleList[0]) {
						this.ruleList[0][key] = this.warnRule[key]
					}
					this.ruleName = body.result.rule_name
					this.ruleList[0].critical_value = parseInt(this.ruleList[0].critical_value)
					this.contGroupChecket = this.warnRule.user_group_id.split(",")
				}
			})
			this.contactsList()
			//联系人列表
			getUserList({
				page: 1,
				per_page: 1000
			}, { menu: this.eleDatas.menu_id }).then(body => {
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

