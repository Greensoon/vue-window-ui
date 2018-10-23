<template>
	<div class="upline-box">
		<div class='upline-body'>
			<!-- 可选择平台 -->
			<div class="plaf plafColor">
				<p>
					<label for="">平台：</label>
					<el-select v-model="platform_id"
						filterable
						@change="changePlatform"
						:disabled="others"
						placeholder="请选择平台">
						<el-option v-for="item in platforms"
							:key="'888' + item.value"
							:label="item.name"
							:value="item.value">
						</el-option>
					</el-select>
				</p>
				<p>
					<label>分区</label>
					<!-- <el-select v-model="section_id"
						filterable
						:disabled="others"
						placeholder="请选择分区" >
						<el-option v-for="(item, idx) in sections"
							:key="'_ppp' + idx"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select> -->
					<mu-select v-model="section_id" :options="sections" default-value></mu-select>
				</p>
				<el-button class="upline-btn" v-for="(ele, i) in eles" :key="i" v-if="ele.element_code == 124" @click="addConfig(platform_id, section_id, '',ele,'other')" type="warning">添加其他平台-分区配置<i class="el-icon-plus el-icon--right"></i></el-button>
				<el-table v-if="addList.list && addList.list.length > 0" :data="addList.list" border style="width: 100%;margin-top:20px;">
					<el-table-column prop="name" label="配置类型" width="180">
					</el-table-column>
					<el-table-column prop="cname" label="配置名称" width="180">
					</el-table-column>
					<el-table-column label="版本号" label-class-name="version-header" class-name="versions">
						<template slot-scope="scope">
							<div v-if="index < 10" v-for="(version,index) in scope.row.data " :key="index">
								<el-radio  v-model="scope.row.radio" :label="version.id" >{{version.version}}</el-radio>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="desc" label="描述" label-class-name="version-header" class-name="versions">
						<template slot-scope="scope">
							<div v-if="index < 10" v-for="(desc,index) in scope.row.data " :key="index">
								{{desc.desc}}
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="操作">
						<template slot-scope="scope">
							<el-button size="mini" type="primary" @click="checkModel(0,scope.$index, 1)">取消</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="tabs-btn" v-if="addList.list.length > 0">
					<el-button type="info" @click="addList.list = []">取消</el-button>
					<el-button type="primary" v-for="(ele, i) in eles" :key="i" v-if="ele.element_code == 126" @click="saveConfig(0, platform_id, section_id, ele, 1)">　保存　</el-button>
  					<el-button type="warning" v-for="(ele, i) in eles" :key="i" v-if="ele.element_code == 127" @click="timeOnline(0,platform_id,section_id, ele, 1)">定时上线</el-button>
					<el-button type="success" v-for="(ele, i) in eles" :key="i" v-if="ele.element_code == 128" @click="upOnLine(0, platform_id, section_id, ele, 1)">直接上线</el-button>
				</div>
			</div>
			<div class="configs" v-if="configData.hold && configData.hold.length > 0">
				<h5 class="mu-monitor--title">方案</h5>
				<el-table  :data="configData.hold" border style="width: 100%">
					<el-table-column prop="platform_name" label="平台" min-width="160">
					</el-table-column>
					<el-table-column prop="section_name" label="分区" min-width="200">
					</el-table-column>
					<el-table-column prop="remark" label="备注" width="200">
					</el-table-column>
					<el-table-column prop="remark" label="保存时间" width="200">
						<template slot-scope="scope">
							{{handleDate(scope.row.create_time * 1000)}}
						</template>
					</el-table-column>
					<el-table-column label="操作" min-width="200">
						<template slot-scope="scope">
							<el-button size="mini" type="danger" v-for="(ele, i) in eles" :key="i" v-if="ele.element_code == 123" @click="delConfigList(scope.row.id,ele)">删除</el-button>
							<el-button v-for="(ele, i) in eles" :key="i" v-if="scope.row.schema == 1 && ele.element_code == 120" size="mini" type="primary" @click="upConfigList(scope.row.id, ele)">上线</el-button>
							<el-button size="mini" type="primary" @click="showDetail(scope.row.id)">查看详情</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!-- 文件平台 -->
			<div class="plaf" v-for="(item,i) in tableData" v-if="item.list && item.list.length > 0" :key="i">
				<p>平台：{{item.platform_name}}</p>
				<p>分区：{{item.section_name}}</p>
				<el-button class="upline-btn" v-for="(ele, j) in eles" :key="j" v-if="ele.element_code == 124"  @click="addConfig(item.platform_id, item.section_id, i,ele)" type="primary">添加配置<i class="el-icon-plus el-icon--right"></i></el-button>
				<el-table :data="item.list" border style="width: 100%;margin-top:20px;">
					<el-table-column prop="name" label="配置类型" width="180">
					</el-table-column>
					<el-table-column prop="cname" label="配置名称" width="180">
					</el-table-column>
					<el-table-column label="版本号" label-class-name="version-header" class-name="versions">
						<template slot-scope="scope">
							<div v-if="index < 10" v-for="(version,index) in scope.row.data " :key="index">
								<el-radio  v-model="scope.row.radio" :label="version.id" >{{version.version}}</el-radio>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="desc" label="描述" label-class-name="version-header" class-name="versions">
						<template slot-scope="scope">
							<div v-if="index < 10" v-for="(desc,index) in scope.row.data " :key="index">
								{{desc.desc}}
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="操作">
						<template slot-scope="scope">
							<el-button size="mini" type="primary" @click="checkModel(i,scope.$index)">取消</el-button>
							<el-button v-if="!scope.row.newAdd" size="mini" type="danger" @click="removeTemp(i,scope.$index)">移除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="tabs-btn" v-if="item.list && item.list.length > 0">
					<el-button type="primary" v-for="(ele, index) in eles" :key="index" v-if="ele.element_code == 126" @click="saveConfig(i,item.platform_id,item.section_id,ele)">　保存　</el-button>
  					<el-button type="warning" v-for="(ele, index) in eles" :key="index" v-if="ele.element_code == 127" @click="timeOnline(i,item.platform_id,item.section_id,ele)">定时上线</el-button>
					<el-button type="success" v-for="(ele, index) in eles" :key="index" v-if="ele.element_code == 128" @click="upOnLine(i,item.platform_id,item.section_id,ele)">直接上线</el-button>
				</div>
			</div>

			<!-- 添加配置 -->
			<el-dialog width="500px" title="添加配置" :visible.sync="innerVisible" append-to-body>
				<div class="config-list">
					<label>类型：</label>
					<el-select v-model="type" filterable placeholder="请选择" @change="typeInfo">
						<el-option v-for="(item,index) in textData" :key="index" :label="item.cname+'　'+item.name" :value="item.id">
						</el-option>
					</el-select>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="innerVisible = false">取 消</el-button>
					<el-button type="primary" @click="addConfigs">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 定时上线弹框 -->
			<el-dialog width="60%" title="定时上线" :visible.sync="timeOnlines" append-to-body>
				<div class="upInline">
					<div>
						<label>任务名称：<i>*</i></label>
						<p>
							<el-input
								style="width:220px"
								placeholder="请输入任务名称"
								prefix-icon="el-icon-edit"
								v-model="remark">
							</el-input>
						</p>
					</div>
					<div>
						<label>日期时间：<i>*</i></label>
						<p>
							<el-date-picker
								v-model="timeObj.date"
								type="date"
								placeholder="选择日期">
							</el-date-picker>

							
						</p>
					</div>

					<div>
						<label>时间：<i>*</i></label>
						<p>
							<el-time-select v-model="timeObj.timer"
								:picker-options="{
									start: '00:00',
									end: '23:55',
									step: '00:05',
								}"
								placeholder="选择时间">
							</el-time-select>
						</p>
					</div>

					<div>
						<label>服务： </label>
						<p>
							<el-checkbox-group v-model="checkList">
								<el-checkbox label="重启游戏"></el-checkbox>
								<el-checkbox label="重启拓展"></el-checkbox>
							</el-checkbox-group>
						</p>
					</div>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="timeOnlines = false">取 消</el-button>
					<el-button type="primary" @click="upTimeOnline">确 定</el-button>
				</div>
			</el-dialog>

			<!-- 上线方案详情 -->
			<el-dialog width="70%"
				title="上线方案详情"
				:visible.sync="onlinePlanVisible"
				:append-to-body="false"
				:modal-append-to-body="false">
				<el-table :data="onlinePlans"
					border
					stripe
					style="width: 80%;margin: 10px auto;">
					<el-table-column prop="types.name"
						label="名称">
					</el-table-column>
					<el-table-column prop="types.cname"
						label="中文名称">
					</el-table-column>
					<el-table-column prop="version"
						label="版本号">
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="primary" @click="showCompare(scope.row)">对比</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="onlinePlanVisible = false">关 闭</el-button>
				</div>
			</el-dialog>
		</div>

		<div slot="footer" class="dialog-footer dialog-footer1">
			<el-button type="primary" @click="closeLines">取 消</el-button>
		</div>
	</div>
</template>

<script>
import { list } from '../types/api.js'
import * as sectionsApi from '../sections/api'
import gpMixins from '../game-platform.mixins'
import dateMixins from '../date.mixins'
import {
	onlineConfig,
	onlineList,
	delOnline,
	indirectOnline,
	historyVersion,
	configTemp,
	serverOnline,
	directOnline,
	timingOnline,
	onlineInfo
} from './api.js'

export default {
	props:['show', 'eles', 'menu'],
	mixins: [gpMixins, dateMixins],
	data() {
		return {
			onlinePlans: [],
			onlinePlanVisible: false,
			textData: [],
			type: '',
			innerVisible: false,
			configData: [],
			loading: false,
			uploading: false,
			delLoading: false,
			saveloading: false,
			tableData: [],
			showList: this.show,
			platId: '',
			sectionId: '',
			listIndex: '',
			typeInfos: {},
			platform_id: '',
			section_id: '',
			gameId: 1,
			sections: [],
			addList: {
				platform: '',
				section: '',
				cname: '',
				name: '',
				list: []
			},
			others: false,
			remark: '',
			timer: '',
			checkList: [],
			descs: '',
			timeOnlines: false,
			uptime: {},
			// defaultValue: null,
			timeObj: {
				date: '',
				timer: ''
			}
		}
	},
	watch: {
		show: {
			handler(newv) {
				if(newv) {
					this.topList()
					this.bottomList()
					this.others = false
					this.addList.list = []
				}
			},
			deep: true
		},
		platforms(val) {
			this.platform_id = val[0].value
			this.getSections()
		},
		addList: {
			handler(newv) {
				if(newv.list && newv.list.length > 0) {
					this.others = true
				} else {
					this.others = false
				}
			},
			deep: true
		}
	},
	created() {
		this.topList()
		this.bottomList()
	},
	methods: {
		showCompare(row) {
			this.$emit('show-compare', row)
		},
		showDetail(id) {
			this.onlinePlanVisible = true
			onlineInfo({
				id
			}, {
				menu: this.menuId
			}).then(json => {
				if(json.code == 200) {
					this.onlinePlans = json.result
				}
			})
		},

		closeLines() {
			this.$emit('close-upLine')
		},
		topList() {
			//第一个表格
			onlineList({menu:this.menu}).then(body=> {
				if(body.code == 200) {
					this.configData = body.result
				}
			})
		},
		changePlatform() {
			this.getSections()
		},
		// changeSection(val) {
		// 	this.section_id = val
		// },
		getSections() {
			return sectionsApi.list({
				game_id: this.gameId,
				platform_id: this.platform_id,
				all: 'yes'
			}).then(json => {
				if(json.code == 200) {
					this.sections = json.result
					// this.defaultValue = this.sections.length ? this.sections[0].id : null
					this.section_id = json.result[0] ? json.result[0].id : ' '
				}
				return json
			})
		},
		bottomList() {
			onlineConfig({
				menu:this.menu
			}).then(body=> {
				if(body.code == 200) {
					let table = body.result
					table.map(e=> {
						if(e.list && e.list.length > 0) {
							e.list.map(i=> {
								i.radio = i.data[0].id
							})
						}
					})
					this.tableData = table
				}
			})
		},
		delConfigList(id,ele) {
			let that = this
			this.$confirm('确定删除该任务？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				that.delLoading = true
				delOnline({
					id: id
				},{
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
				});
			})

		},
		upConfigList(id,ele) {
			let that = this
			this.$confirm('确定上线该平台配置文件？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				that.loading = true
				indirectOnline({id:id},{
					menu: this.menu,
					ele:ele.element_id
				}).then(body=> {
					that.loading = false
					if(body.code == 200) {
						this.topList()
						this.$message.success("上线成功")
					} else {
						this.$message.error(body.message)
					}
				}).catch(function (error) {
					that.loading = false;
				});
			})

		},
		typeInfo() {
			this.typeInfos = this.textData.filter(e=> e.id == this.type)[0]
		},
		addConfig(platId, sectionId, index, ele, other) {
			if(other) {
				this.platId = platId
				this.sectionId = sectionId
				this.listIndex = 'other'
			} else {
				this.platId = platId
				this.sectionId = sectionId
				this.listIndex = index
			}
			if(this.textData.length <= 0) {
				list({all: 'yes'}, {
					menu: this.menu
				}).then(json=> {
					this.textData = json.result
				})
			}

			this.innerVisible = true

		},
		addConfigs() {
			if(this.type) {
				historyVersion({
					platform_id: this.platId,
					section_id: this.sectionId,
					type_id: this.type
				}, {
					menu: this.menu
				}).then(body=> {
					if(body.code == 200 && body.result.length > 0) {
						let info = this.typeInfos
						if(this.listIndex == 'other') {
							this.addList.platform = this.platform_id
							this.addList.section = this.section_id
							this.addList.cname = info.cname
							this.addList.name= info.name
							this.addList.list.push({
								cname: info.cname,
								name: info.name,
								platform: this.platform_id,
								section: this.section_id,
								data: body.result,
								radio: body.result[0].id,
								newAdd: true
							})
							this.others = true
						} else {
							this.tableData[this.listIndex].list ? '' : this.tableData[this.listIndex].list = []
							this.tableData[this.listIndex].list.push({
								cname: info.cname,
								name: info.name,
								platform: this.platId,
								section: this.sectionId,
								data: body.result,
								radio: body.result[0].id,
								newAdd: true
							})
						}

						this.innerVisible = false
					} else if(body.result.length <= 0) {
						this.$message.warning('暂无当前配置文件历史版本')
					}
				})
			} else {
				this.$message.error('请选择类型')
			}
		},
		checkModel(i,index, other) {
			if(other) {
				this.addList.list[index].radio = ''
			} else {
				this.tableData[i].list[index].radio = ''
			}

		},
		removeTemp(i,index) {
			let id = this.tableData[i].list[index].radio
			if(id) {
				configTemp({
					id: id
				},{
					menu: this.menu
				}).then(body => {
					if(body.code == 200) {
						this.bottomList()
						this.$message.success("移除成功")
					} else {
						this.$message.error(body.message)
					}
				})
			} else {
				this.$message.error('请选择要移除的版本')
			}

		},
		saveConfig(index, platId, sectionId, ele, other) {
			let that = this
			if(other) {
				var datas = this.addList.list
			} else {
				var datas = this.tableData[index].list
			}

			let radioList = []
			datas.map(e=> {
				if(e.radio) {
					radioList.push(e.radio)
				}
			})
			if(radioList.length > 0) {
				this.$prompt('请输入备注', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /\S/,
					inputErrorMessage: '请输入备注'
				}).then(({ value }) => {
					this.saveloading = true
					let dataId = radioList.join(',')
					serverOnline({
						platform: platId,
						section: sectionId,
						data: dataId,
						remark: value
					},{
						menu: this.menu,
						ele: ele.element_id
					}).then(body=> {
						this.saveloading = false
						if(body.code == 200) {
							this.$message.success("保存成功")
							if(other) {
								this.addList.list = []
							} else {
								this.tableData[index].list = []
							}
							this.topList()
						} else {
							that.$message.error(body.message)
						}
					}).catch(function (error) {
						that.saveloading = false
						that.$message.error({showClose: true, message: error.message, duration: 2000})
					})
				})
			} else {
				that.$message.error('请选择要保存的配置文件')
			}
		},
		upOnLine(index, platId, sectionId, ele, other) {
			var $this = this
			if(other) {
				var datas = this.addList.list
			} else {
				var datas = this.tableData[index].list
			}
			let radioList = []
			datas.map(e=> {
				if(e.radio) {
					radioList.push(e.radio)
				}
			})

			if(radioList.length > 0) {
				let that = this
				this.$confirm('确定直接上线?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.uploading = true
					let dataId = radioList.join(',')
					directOnline({
						platform: platId,
						section: sectionId,
						data: dataId
					},{
						menu: this.menu,
						ele: ele.element_id
					}).then(body=> {
						this.uploading = false
						if(body.code == 200) {
							this.$message.success("上线成功")
							if(other) {
								this.addList.list = []
							} else {
								this.tableData[index].list = []
							}

						} else {
							this.$message.error(body.message)
						}
					}).catch(function (error) {
						that.uploading = false
						// that.$message.error({showClose: true, message: error.message, duration: 2000});
					})
				})
			} else {
				this.$message.error('请选择要上线的文件')
			}

		},
		//定时上线
		timeOnline(index, platId, sectionId, ele, other) {
			if(other) {
				var datas = this.addList.list
			} else {
				var datas = this.tableData[index].list
			}
			let radioList = []
			datas.map(e=> {
				if(e.radio) {
					radioList.push(e.radio)
				}
			})
			if(radioList.length > 0) {
				this.timeOnlines = true
				this.uptime.radios = radioList.join(',')
				this.uptime.platId = platId
				this.uptime.section = sectionId
				this.uptime.other = other
				this.uptime.index = index
				this.uptime.ele = ele
			} else {
				this.$message.error('请选择要上线的文件')
			}
		},
		//确定提交定时上线
		upTimeOnline() {
			if(this.remark == '') {
				this.$message.error('请输入任务名称')
				return
			}
			if(!this.timeObj.timer || !this.timeObj.date) {
				this.$message.error('请选择日期时间')
				return
			}
			let extend = 0
			let game = 0
			this.checkList.forEach(e=> {
				if(e=='重启拓展') {
					extend = 1
				} else if(e == '重启游戏') {
					game = 1
				}
			})
			let uptimes = this.uptime
			let params = {
				platform: uptimes.platId,//平台id
				section: uptimes.section,//分区id
				data: uptimes.radios, //文件id ,分割
				remark: this.remark,
				extend: extend,//是否重启扩展 1是 0否
				game: game,//是否重启游戏 1是 0 否
				exec_time: this.customDate(this.timeObj.date, 'YYYY-MM-DD') + ' ' + this.timeObj.timer,//执行时间
			}
			timingOnline(params, {
				menu: this.menu,
				ele: uptimes.ele.element_id
			}).then(body=> {
				if(body.code == 200) {
					this.$message.success('定时设置成功')
					if(uptimes.other) {
						this.addList.list = []
					} else {
						this.tableData[uptimes.index].list = []
					}
					this.timeOnlines = false
					this.remark = ''
					this.timer = ''
					this.checkList = []
					this.topList()
				} else {
					this.$message.error(body.message)
				}
			})
		},
	}
}
</script>
<style lang="less">
.upline-box {
	.upline-body {
		border-top: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
		padding: 0 20px 20px;
		color: #606266;
		font-size: 14px;
		box-sizing: border-box;

	}
	.config-list {
		margin-right: 10px;
	}
	.dialog-footer1 {
		padding: 10px 20px 20px;
		text-align: right;
		box-sizing: border-box;
	}
	.plaf {
		margin-top: 20px;
		padding: 20px;
		background: rgba(179,216,255,.2);
		& > p {
			display: inline-block;
			margin-right: 20px;
		}
	}
	.plafColor {
		margin: 15px 0;
		background: rgb(240, 247, 236);
	}
	.configs {
		background: rgb(250, 240, 239);
		padding: 20px;
		.mu-monitor--title {
			background: #fff;
		}
	}

	.versions{
		padding: 0px;
		.cell {
			padding: 0px;
			div {
				border-bottom: 1px solid #ebeef5;
				height: 48px;
				line-height: 48px;
				padding: 0 10px;
			}
			div:last-child{
				border-bottom: none;
			}
		}
	}

	.version-header{
		padding: 12px 0;
		.cell {
			padding: 0 10px;
		}
	}
	.tabs-btn {
		margin-top: 20px;
		text-align: right;
	}
}
.upInline {
	text-align: center;
	margin: 0 auto;
	& > div{
		margin-bottom: 15px;
		p {
			display: inline-block;
			width: 300px;
			text-align: left;
		}
	}
	label {
		width: 80px;
		text-align: right;
		margin-right: 10px;
		display: inline-block;
		i {
			color: rgb(252, 57, 57);
		}
	}
	.vertal {
		vertical-align: top;
	}
}
</style>
