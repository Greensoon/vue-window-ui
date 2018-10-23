<template>
	<div class="mu-monitor">
		<div class="mu-monitor-top clearfix">
			<instance-panel>
				<instance-panel-title title="基本信息"></instance-panel-title>
				<instance-panel-content>
					<ul class="mu-infolist">
						<li class="mu-infoitem">
							<span class="mu-info--label">
							游戏：
							</span>
							<span class="mu-info--value">{{instance.game}}</span>
						</li>
						<li class="mu-infoitem">
							<span class="mu-info--label">平台：</span>
							<span class="mu-info--value">{{instance.platform}}</span>
						</li>
						<li class="mu-infoitem">
							<span class="mu-info--label">
							机器名：
							</span>
							<span class="mu-info--value">{{instance.machine_name}}</span>
						</li>
						<li class="mu-infoitem">
							<span class="mu-info--label">实例名：</span>
							<span class="mu-info--value">{{instance.instance_name}}</span>
						</li>
						<li class="mu-infoitem">
							<span class="mu-info--label">
							内网IP：
							</span>
							<span class="mu-info--value">{{instance.intranet_ip}}</span>
						</li>
						<li class="mu-infoitem">
							<span class="mu-info--label">外网IP：</span>
							<span class="mu-info--value">{{instance.extranet_ip}}</span>
						</li>
						<li class="mu-infoitem">
							<span class="mu-info--label">
							内存：
							</span>
							<span class="mu-info--value">{{instance.memory}}GB</span>
						</li>
						<li class="mu-infoitem">
							<span class="mu-info--label">CPU：</span>
							<span class="mu-info--value">{{instance.cpu}}</span>
						</li>
						<li class="mu-infoitem">
							<span class="mu-info--label"> 硬盘： </span>
							<span class="mu-info--value">{{instance.data_disk}}GB</span>

							<span class="mu-info--label">系统盘：</span>
							<span class="mu-info--value">{{instance.system_disk}}GB</span>
						</li>
						<li class="mu-infoitem">
							<span class="mu-info--label">域名：</span>
							<span class="mu-info--value">{{instance.domain_name}}</span>
						</li>
					</ul>
				</instance-panel-content>
			</instance-panel>
		</div>
		<div class="mu-monitor-bottom">
			<el-tabs v-model="activeTab" type="card">
			    <el-tab-pane label="基础监控" name="first">
			    	<Hard ref="chart-first" :server-id="instance.id" :menuId="menuIds"  v-if="activeTab == 'first'"></Hard>
			    </el-tab-pane>
			    <el-tab-pane label="应用监控" name="second">
			    	<Soft ref="chart-second" :server-id="instance.id" :menuId="menuIds" v-if="activeTab == 'second'"></Soft>
			    </el-tab-pane>
				<el-tab-pane label="预警规则" name="third">
					<warn-list ref="chart-third" :childId="childIds" :menuId="menuIds" @childreId = "childreId" :addchange-list="addsuccess" :editchange-list="editsuccess" @openAddRule="openAddrule" @openEditRule = "openEditRule" :server-ip="instance.extranet_ip" v-if="activeTab == 'third'"></warn-list>
				</el-tab-pane>
		  	</el-tabs>
		</div>

		<mu-dialog title="创建预警规则" v-model="addRuleShow" @close="closeAddRule">
			<add-rule :serve-ip="instance.extranet_ip" :ele-data = "eleData" @changeList="changeList" @closeAddRule="closeAddRule"></add-rule>
		</mu-dialog>
		<mu-dialog title="修改预警规则" v-model="editRuleShow" @close="closeEditRule">
			<edit-rule :rule-id="ruleId" :ele-data = "eleData" @changeList="changeList" @closeEditRule="closeEditRule"></edit-rule>
		</mu-dialog>
	</div>
</template>
<style lang="less">
.mu-monitor-bottom {
	.el-tabs__header {
		margin-bottom: 0;
	}

	.el-range-editor.el-input__inner {
		padding-top: 0;
		padding-bottom: 0;

		height: 30px;
		line-height: 30px;
	}
}
</style>

<script>
	import Hard from './hard'
	import Soft from './soft'
	import Remind from './remind'
	import warnList from './warn-list'
	import addRule from "../forewarn/warn-rules"
	import editRule from "../forewarn/edit-rules"

	export default {
		name: 'muMonitor',
		props: ['instanceData', 'childId', 'menuId'],
		data() {
			var $d = this.instanceData
			var $this = this
			return {
				childIds: $this.childId || {},
				menuIds: $this.menuId || '',
				activeTab: 'first',
				instance: $d || {},
				addRuleShow: false,
				editRuleShow: false,
				ruleId: "",
				addsuccess: 1,
				editsuccess: 1,
				eleData: ''
			}
		},
		methods: {
			openAddrule() {
				this.addRuleShow = true
			},
			closeAddRule() {
				this.addRuleShow = false
			},
			openEditRule(val) {
				this.editRuleShow = true
				this.ruleId = val

			},
			closeEditRule() {
				this.editRuleShow = false
			},
			changeList(val) {
				if(val == 1){
					this.addsuccess ++
				}else{
					this.editsuccess ++
				}

			},
			childreId(val) {
				this.eleData = val
				this.eleData.menu_id = this.menuId
			},

		},
		components: {
			Hard,
			Soft,
			Remind,
			warnList,
			addRule,
			editRule
		},
		watch: {
			activeTab (v) {
		        this.$nextTick(_ => {
		        	var _charts = this.$refs[`chart-${v}`].$refs
		        	for(var i in _charts) {
		        		_charts[i].echarts && _charts[i].echarts.resize()
		        	}
		        })
			},
			instanceData: {
				handler(newv) {
					this.instance = newv
				},
				deep: true
			}
		}

	}
</script>
