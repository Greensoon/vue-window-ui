<template>
	<div class="page-server">
		<lr-layout :menus="submenus" @menu-click="menuClick">
			<div v-if="activeIndex == 'server'">
				<div class="filter-form flex">
					<div class="flex">
						<mu-searchbar :types="types" @search-action="searchAction"></mu-searchbar>
						<el-popover width="400"
							popper-class="tag-wrap"
							:visible-arrow="false"
							trigger="click">
							<tag-check :all-tags="allTags" @handle-item="handleTags" :tag-lists="labelArr"></tag-check>
							<el-button slot="reference" class="ps-tag-btn" >标签</el-button>
						</el-popover>
					</div>
					<div class="">
						<a class="detail-search-btn" @click="toggleDetailForm" >高级搜索</a>
					</div>
				</div>
				<div class="search-tag" v-if="searchTag.length">
					<span class="search-tag__label">检索项: </span>
					<el-tag v-for="(key, i) in searchTag" :key="i" closable @close="closeHandler(key)">
						{{key.name}}: {{key.value}}
					</el-tag>
					<a class="search-tag__btn" @click="clearTag">清除</a>
				</div>
				<detail-form v-show="detailFormShow" @search-action="searchAction" :menuid="menuId" ></detail-form>

				<div class="page-server-infos">
					<span >服务器总数量：{{TOTAL}}</span>
					<span :style="{marginLeft: '10px'}">异常：<span class="text-danger unormal-btn" @click="searchError">{{error_obj.total}}</span></span>
				</div>

				<div class="page-server-table">
					<el-table :data="serverList"
						v-loading="loading"
						style="width: 100%"
						stripe
						@sort-change="sortChange"
						center>
						<el-table-column
							prop="id"
							label="实例信息"
							width="180"
						>
							<template slot-scope="scope">
								<div class="server-info-wrap">实例名：{{scope.row.instance_name}}</div>
								<div class="server-info-wrap">机器名：{{scope.row.machine_name}}</div>
							</template>
						</el-table-column>
						<el-table-column
							width="60"
							prop="id"
							label="监控">
							<template slot-scope="scope">
								<div class="server-info-wrap"><a class="" @click="showMonitor(scope.row)"><i class="icon-monitor"></i></a></div>
							</template>
						</el-table-column>
						<el-table-column
							prop="target_info"
							width="60"
							label="标签">
							<template slot-scope="scope">
								<div class="server-info-wrap">
									<el-tooltip placement="top" effect="light">
										<div slot="content">
											<span>{{handleTaginfo(scope.row.target_info) || '暂无标签'}}</span>
											<a class="server-info-link" @click="showTags(scope.row.target_info, scope.row.id)">编辑标签</a>
										</div>
										<img :src="tagimg" class="icon-tag-img">
									</el-tooltip>
								</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="game"
							max-width="160"
							min-width="100"
							label="游戏信息">
							<template slot-scope="scope">
								<div class="server-info-wrap">游戏：{{getGamename(scope.row.game)}}</div>
								<div class="server-info-wrap">平台：{{getPlatformName(scope.row.platform)}}</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="disk_vdb_use"
							max-width="240"
							min-width="160"
							sortable
							label="磁盘信息">
							<template slot-scope="scope">
								<div class="server-info-wrap">磁盘占用：{{0 > scope.row.data_disk || !scope.row.data_disk ? '暂无数据' : scope.row.data_disk + 'GB'}}</div>
								<div class="server-info-wrap">磁盘使用率：{{ 0 > scope.row.disk_vdb_use || !scope.row.disk_vdb_use ? '暂无数据' : scope.row.disk_vdb_use + '%'}}</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="cpu"
							max-width="240"
							min-width="160"
							label="服务器信息">
							<template slot-scope="scope">
								<div class="server-info-wrap">CPU：{{scope.row.cpu ? scope.row.cpu == 'INSTALL' ? '暂无数据' : scope.row.cpu : '暂无数据'}}</div>
								<div class="server-info-wrap">内存：{{scope.row.memory ? scope.row.memory + 'GB' : '暂无数据' }}</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="cpu"
							max-width="240"
							min-width="160"
							sortable
							label="CPU使用率">
							<template slot-scope="scope">
								<div class="server-info-wrap">CPU使用率：{{0 > scope.row.cpu_percent || !scope.row.cpu_percent ? '暂无数据' : scope.row.cpu_percent + '%'}}</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="memory_used"
							max-width="240"
							min-width="160"
							sortable
							label="内存使用率">
							<template slot-scope="scope">
								<div class="server-info-wrap">内存使用率：{{ 0 > scope.row.memory_used || !scope.row.memory_used ? '暂无数据' : scope.row.memory_used + '%'}}</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="extranet_ip"
							max-width="240"
							min-width="160"
							label="IP信息">
							<template slot-scope="scope">
								<div class="server-info-wrap">外网IP：{{scope.row.extranet_ip}}</div>
								<div class="server-info-wrap">内网IP：{{scope.row.intranet_ip}}</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="qufuCount"
							label="区服数量">
						</el-table-column>
						<el-table-column
							label="操作" width="240">
							<template slot-scope="scope">
								<el-button type="text" v-for="(ele, i) in needIds" :key="i" v-if="ele.element_code == 102" size="small" @click="modifyServer(scope.row.id,ele)">编辑</el-button>
								<el-button type="text" v-for="(ele, i) in needIds" :key="i" v-if="ele.element_code == 105" size="small" @click="deployment(scope.row)">游戏部署</el-button>
								<el-button type="text" v-for="(ele, i) in needIds" :key="i" v-if="ele.element_code == 101" size="small" @click="deleteServer(scope.row.id,ele.element_id)">删除</el-button>
								<el-button type="text" v-for="(ele, i) in needIds" :key="i" v-if="(!scope.row.cpu || scope.row.cpu == 'INSTALL')  && !scope.row.memory  && ele.element_code == 113" size="small" :disabled="scope.row.cpu == 'INSTALL'" @click="agentDeploy(scope.row.id,ele.element_id)">探针部署</el-button>
							</template>
						</el-table-column>
					</el-table>

					<div class="flex mu-flex">
						<div>
							<el-button v-for="(ele, i) in needIds" :key="i" v-if="ele.element_code == 100" class="mu-user-add" @click="addServer(ele)"><i class="el-icon-plus"></i>添加</el-button>
						</div>
						<el-pagination background
							layout="total, prev, pager, next"
							:current-page="current"
							@current-change="goHandle"
							:total="total">
						</el-pagination>
					</div>
				</div>
			</div>
			<warn-list v-if="activeIndex == 'forewarn'"
				:addchange-list="addsuccess"
				:editchange-list="editsuccess"
				@openAddRule="openAddrule"
				@openEditRule = "openEditRule"
				@childreId = "childreId"
				:childId="needIds"
				:menuId="menuId">
			</warn-list>
		</lr-layout>
		
		<el-dialog title="添加服务器" :visible.sync="addServerModal" :modal-append-to-body="false">
            <add @close-modal="closeAdd" @fresh="fresh" :ele-data = "eleData"></add>
        </el-dialog>

		<el-dialog title="修改服务器" :visible.sync="modifyServerModal" :modal-append-to-body="false">
            <modify @close-modal="closeModify" @fresh="fresh" :check-id="checkId" :ele-data = "eleData"></modify>
        </el-dialog>

		<el-dialog title="编辑标签" :visible.sync="tagVisible" :modal-append-to-body="false">
			<tag :tags="currentTags"
				@close-modal="closeTag"
				@refresh-tag="getAllTags"
				:server-id="checkId"
				:all-tag="allTags"
				:menuid="menuId"
			></tag>
		</el-dialog>

		<mu-dialog title="监控" v-model="monitorModal" @close="closeMonitor">
			<monitor :instance-data="instanceData" :childId="needIds" :menuId="menuId"></monitor>
		</mu-dialog>

		<!--游戏部署-->
		<deploy v-if="deployModal" :instance-data="instanceData" :show="deployModal" @hidedeploy="hides"></deploy>
		<mu-dialog title="创建预警规则" v-model="addRuleShow" @close="closeAddRule">
			<add-rule @changeList="changeList" :ele-data = "eleData" @closeAddRule="closeAddRule"></add-rule>
		</mu-dialog>
		<mu-dialog title="修改预警规则" v-model="editRuleShow" @close="closeEditRule">
			<edit-rule :rule-id="ruleId" :ele-data = "eleData" @changeList="changeList" @closeEditRule="closeEditRule"></edit-rule>
		</mu-dialog>
	</div>
</template>
<style lang="less">
.mu-flex {
	justify-content: space-between;
}

.server-info-wrap {
	font-size: 12px;
	color: #444;
	font-weight: 500;
}

.page-server {
	display: flex;
	overflow: hidden;
	a:hover {
		text-decoration: underline;
	}

	.page-server-infos {
		margin: -10px 0 10px;
		padding: 10px;
		border: 1px solid #e6a23c;
		background: #fff2da;
		color: orange;

		.unormal-btn {
			padding: 5px;
			cursor: pointer;
			&:hover {
				text-decoration: underline;
			}
		}
	}

	.filter-form {
		justify-content: space-between;
		display: flex;

		margin: 0 0 20px;
	}

	.ps-tag-btn {
		margin-left: 10px;
		border-radius: 0;

		height: 36px;
		font-size: 12px;
		color: #222;
		font-weight: 500;
		background: #f8f8f8;
		padding: 12px 15px;
		span {
			font-weight: 500;
		}
		&:hover,
		&:focus {
			background: #fff;
			border-color: #dcdfe6;
		}
	}

	.detail-search-btn {
		margin-top: 10px;
		display: block;
		font-size: 12px;
		white-space: nowrap;
	}

	.server-left {
		width: 180px;
		// border-right: 1px solid #ccc;
		background: #444;
		// margin-right: 20px;
	}

	.icon-monitor {
		background: url(../../../assets/img/icon-monitor.png) no-repeat center;
		width: 20px;
		height: 20px;
		background-size: 20px 20px;
		display: block;
		margin: auto;
	}

	.el-table thead th {
		background: #ecebeb;
	}

	.icon-tag-img {
		vertical-align: middle;
		width: 16px;
		height: 16px;
	}

	.el-dialog__title {
		font-size: 14px;
		color: #333;
    	font-weight: 500;
	}

	.el-form-item__label {
		font-size: 12px;
		color: #333;
		font-weight: 400;
		padding-right: 25px;
		white-space: nowrap;
	}

	.el-dialog__header {
		padding: 15px 20px;
		border-bottom: 1px solid #ddd;
	}
	.el-form-item {
		margin-bottom: 15px;
	}
}
.page-server-table {
	.el-table {
		border: 1px solid #ccc;
		thead th {
			font-size: 12px;
		}
	}
}
.search-tag {
	font-size: 12px;
	.el-tag {
		margin-right: 10px;
		margin-bottom: 10px;
	}
}
</style>

<script>
	import Add from './add'
	import Modify from './modify'
	import DetailForm from './detail-form'
	import Tag from './tag'
	import TagBind from './tag-bind'
	import Monitor from '../monitor'

	import TagCheck from './tag-check'
	import tagimg from '../../../assets/img/icon-tag.png'
	import warnList from '../monitor/warn-list'
	import addRule from "../forewarn/warn-rules"
	import editRule from "../forewarn/edit-rules"
	import Deploy from "../deploy"
	import socket from '../../apis/socket'

	import { getServers, searchServers, getServerTags } from '../../apis/get'
	import { serverMonitor } from '../../apis/post'
	import { deleteServer } from '../../apis/delete'
	import menuMixins from '../menu.mixins.js'
	import { mapState, mapActions } from 'vuex'

	export default {
		components: { Add, Modify, DetailForm, Tag, TagBind, Monitor, TagCheck, warnList, addRule, editRule, Deploy },
		mixins: [menuMixins],
		data() {
			return {
				activeIndex: '',
				server_id: '',
				all_info: 'yes',
				pages: 0,
				addServerModal: false,
				modifyServerModal: false,
				loading: false,
				serverList: [],
				checkId: 0,
				total: 0,
				pageSize: 10,
				current: 1,
				tagVisible: false,
				tagimg,
				types: [{
					name: '机器名',
					value: 'machine_name'
				}, {
				    name: '外网IP',
					value: 'extranet_ip'
				}, {
				    name: '内网IP',
					value: 'intranet_ip'
				}],
				detailFormShow: false,
				currentTags: '',
				allTags: [],
				monitorModal: false,
				instanceData: null,
				typeList: [{
					name: '域名',
					value: 'domain_name'
				}, {
					name: 'cpu信息',
					value: 'cpu'
				}, {
					name: '实例名称',
					value: 'instance_name'
				}, {
					name: '内存',
					value: 'memory'
				}, {
					name: '平台',
					value: 'platform'
				}, {
					name: '游戏',
					value: 'game'
				}],
				searchData: {
					machine_name: '',
					domain_name: '',
					extranet_ip: '',
					intranet_ip: '',
					cpu: '',
					instance_name: '',
					memory: '',
					game: '',
					platform: '',
					target_info: '',
					per_page: 10
				},
				searchTag:[],
				labelTag:[],
				labelArr:[],
				gameList: [{
					name: '作妖计',
					value: 1
				}],
				platformList: [],
				addRuleShow: false,
				editRuleShow: false,
				ruleId: '',
				addsuccess: 1,
				editsuccess: 1,
				deployModal: false,
				eleData: '',
				stop: false,
				TOTAL: -1,
				error_type: '',
				error_obj: {
					total: -1,
					pages: -1,
					list: []
				}
			}
		},
		computed: {
			...mapState({
				gameInfo: state => state.main.gameInfo,
				platformInfo: state => state.main.platformInfo
			})
		},
		created() {
			this.getSubmenus('服务器管理', (submenus) => {
                this.defaultActive = submenus[0].menu_component
                this.activeIndex = submenus[0].menu_component
				this.getElementIds(menuId => {
					this.menuId = menuId
				})
			})
			this.showErrors()
		},
		watch: {
			needIds: {
				handler(newv) {
					this.roleElementIds = newv
				},
				deep: true
			},
			server_id(newv) {
				if(newv == '' || !newv) {
					this.all_info = 'yes'
				} else {
					this.all_info = 'no'
				}
			},
			activeIndex(newv) {
                var filter = this.submenus.filter(e => e.menu_component == newv)
                if(filter && filter.length) {
                    this.needIds = filter[0].element_ids
					this.menuId = filter[0].menu_id
                }
            }
		},
		methods: {
			...mapActions(['getServerErrors']),
			setErrorType() {
				this.current = 1
				this.error_type = 'show_error'
			},
			clearErrorType() {
				this.current = 1
				this.error_type = ''
			},
			showErrors(params = {}) {
				return this.getServerErrors(params)
					.then(json => {
						this.serverList = json.result
						this.error_obj.list = json.result
						this.error_obj.total = json.result_info.total
						this.error_obj.pages = this.total % this.pageSize == 0 ? ( this.total / this.pageSize ) : Math.ceil(this.total / this.pageSize)
					})
			},
			searchError() {
				this.serverList = this.error_obj.list
				this.total = this.error_obj.total
				this.pages = this.error_obj.pages
				this.setErrorType()
			},
			sortChange(data) {
				var _key = ''
				switch(data.prop) {
					case 'cpu': _key = 'cpu_percent'; break;
					case 'memory_used': _key = 'memory_used'; break;
					case 'disk_vdb_use': _key = 'disk_vdb_use'; break;
				}
				this.getServerList({
					'all_info': 'yes',
					'order_key': _key
				})
			},
			getServerList(params) {
				this.loading = true
				return getServers(params, { menu: this.menuId})
					.then(json => {
						if(json.code == 200) {
							this.loading = false
							this.serverList = json.result
							this.total = json.result_info.total
							if(this.TOTAL === -1) {
								this.TOTAL = this.total
							}
							this.clearErrorType()
							this.pages = this.total % this.pageSize == 0 ? ( this.total / this.pageSize ) : Math.ceil(this.total / this.pageSize)
						}
					})
			},

			modifyServer(serverId,ele) {
				this.modifyServerModal = true
				this.checkId = serverId
				this.eleData = ele
				this.eleData.menu_id = this.menuId
			},
			deployment(row) {
				this.deployModal = true
				this.instanceData = row
			},
			agentDeploy(serverid, ele) {
				this.serverList.forEach(e=> {
					if(e.id == serverid) {
						e.cpu = 'INSTALL'
					}
				})
				serverMonitor({server_id: serverid}, {menu: this.menuId, ele: ele}).then(body=> {
					if(body.code == 200) {
						this.$notify({
							title: '成功',
							message: '当前服务器已成功部署',
							type: 'success'
						});
						this.clearErrorType()
						this.fresh()
					} else {
						this.$notify.error({
							title: '错误',
							message: body.message
						});

						this.serverList.forEach(e=> {
							if(e.id == serverid) {
								e.cpu = 'INSTALL_FAIL'
							}
						})
					}
				})
			},
			deleteServer(server_id, ele) {
				const $this = this
                this.$confirm('确认要删除该服务器吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
						deleteServer({server_id}, {menu: this.menuId, ele: ele})
							.then(json => {
								if(json.code == 200) {
									this.$message.success('删除成功')
									this.goHandle()
								} else {
									this.$message.error(json.message)
								}
							})
					})
			},
			addServer(ele) {
				this.eleData = ele
				this.eleData.menu_id = this.menuId
				this.addServerModal=true
			},
			closeAdd() {
				this.addServerModal = false
			},
			closeModify() {
				this.modifyServerModal = false
			},
			fresh() {
				this.goHandle()
			},
			goHandle(page) {
				var _page = page || this.current
				var fn = this.error_type == 'show_error' ? this.showErrors : this.getServerList
				return fn({
					all_info: 'yes',
					page: _page,
					per_page: this.pageSize
				}).then(_ => {
					if(page) {
						this.current = page
					}
				})
			},
			searchAction(msg, arr) {
				this.searchData = Object.assign(this.searchData, msg)
				this.loading = true
				var typeLists = this.typeList.concat(this.types)
				this.searchTag = typeLists.map(e => {
					return{
						name: e.name,
						label: e.value,
						value: this.searchData[e.value]
					}
				})

				if(arr) {
					this.labelTag=[]
					var group = {}
					arr.forEach(e=> {
						var array = group[e['group_name']] || []
						array.push(e)
						group[e['group_name']] = array
					})
					for(var key in group) {
						this.labelTag.push({
							label: 'target_info',
							name: '标签',
							key: key,
							delValue: group[key].map(e => e.id).join(','),
							value: group[key].length > 1 ? '键' + key : '键' + key + ' 值' + group[key].map(e => e.tag_name)
						})
					}
				}
				this.searchTag = this.searchTag.concat(this.labelTag).filter(e=> e.value !='')
				this.searchTag.forEach(e => {
					if(e.label == 'game') {
						e.value = this.gameInfo.filter(el => el.id == e.value)[0].cname
					}

					if(e.label == 'platform') {
						e.value = this.chooseValue(e.value, msg.game)
					}
				})
				// if(this.searchData.game) {
					this.searchData.game = 1
				// }
				searchServers(this.searchData, {menu: this.menuId})
					.then(json => {
						if(json.code == 200) {
							this.serverList = json.result
							this.total = json.result_info.total
							this.pages = this.total % this.pageSize == 0 ? ( this.total / this.pageSize ) : Math.ceil(this.total / this.pageSize)
						}

						this.clearErrorType()

						this.loading = false
					})
			},

			chooseValue(val, game) {
				var _game = this.gameInfo.filter(e => e.id == game)[0].nickname
				var _platforms = this.platformInfo[_game]
				var _v = []
				for(var i in _platforms) {
					_v.push({
						label: i,
						id: _platforms[i][0].id,
						name: _platforms[i][0].name,
					})
				}

				return _v.filter(el => el.id == val)[0].name
			},
			clearTag() {
				this.searchTag = []
				this.searchData = {
					machine_name: '',
					domain_name: '',
					extranet_ip: '',
					intranet_ip: '',
					cpu: '',
					instance_name: '',
					memory: '',
					game: '',
					platform: '',
					target_info: ''
				}
				this.loading = true
				this.labelTag=[]
				this.labelArr =[]
				searchServers(this.searchData, {menu: this.menuId})
					.then(json => {
						if(json.code == 200) {
							this.serverList = json.result
							this.total = json.result_info.total
							this.pages = this.total % this.pageSize == 0 ? ( this.total / this.pageSize ) : Math.ceil(this.total / this.pageSize)
						}
						this.clearErrorType()

						this.loading = false
					})
			},
			closeHandler(key) {
				this.loading = true
				this.searchTag = this.searchTag.filter(e => e.name != key.name || e.value != key.value)
				if(key.label=='target_info'){
				    var tagdata = this.searchData[key.label].split(",")
					var del = key.delValue.split(",")
					var temp = [];
					var temparray = [];
					for (var i = 0; i < del.length; i++) {
						temp[del[i]] = true;
					};
					for (var i = 0; i < tagdata.length; i++) {
						if (!temp[tagdata[i]]) {
							temparray.push(tagdata[i]);
						} ;
					};
					this.searchData[key.label] = temparray.join(",")
					this.labelTag = this.labelTag.filter(e=> e.key !=key.key)
					this.labelArr =this.labelArr.filter(e=> e.group_name !=key.key)
				}else{
					this.searchData[key.label] = ''
				}
				searchServers(this.searchData, {menu: this.menuId})
					.then(json => {
						if(json.code == 200) {
							this.serverList = json.result
							this.total = json.result_info.total
							this.pages = this.total % this.pageSize == 0 ? ( this.total / this.pageSize ) : Math.ceil(this.total / this.pageSize)
						}
						this.clearErrorType()
						this.loading = false
					})
			},
			toggleDetailForm() {
				this.detailFormShow = !this.detailFormShow
			},
			showTags(target_info, server_id) {
				this.tagVisible = true
				this.currentTags = target_info
				this.checkId = server_id
			},
			closeTag(fresh) {
				this.tagVisible = false
				if(fresh) {
					this.clearErrorType()
					this.getServerList({all_info: 'yes'})
				}
			},
			getAllTags() {
				getServerTags({}, {menu: this.menuId})
                    .then(json => {
                        this.allTags = json.result
                    })
			},
			handleTaginfo(tags) {
				if(!tags) {
					return null
				}

				var filter = this.allTags.filter(e => tags.split(',').indexOf(String(e.id)) > -1)
				if(filter && filter.length) {
					return filter.map(e => e.group_name + ' : ' + e.tag_name).join(' , ')
				}

				return null
			},
			handleTags(arr) {
			    this.labelArr = arr
				var target_info = arr.map(e => e.id).join(',')
				this.searchAction({target_info}, arr)
			},
			showMonitor(row) {
				this.monitorModal = true
				this.instanceData = row
			},
			closeMonitor() {
				this.monitorModal = false
			},
			getGamename(value) {
				var ret = value
				var filter = this.gameList.filter(e => value == e.value)
				ret = filter.length ? filter[0].name : ret
				return ret
			},
			getPlatformName(value) {
				var ret = value
				var filter = this.platformList.filter(e => value == e.id)
				ret = filter.length ? filter[0].platform_name : ret
				return ret
			},
			menuClick(index) {
                this.activeIndex = index
			},
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
			childreId(val) {
				this.eleData = val
				this.eleData.menu_id = this.menuId
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
			hides() {
				this.deployModal = false
			}
		},
		mounted() {
			Promise.all([
				this.getAllTags(),
				this.getServerList({all_info: this.all_info})
			])
		}
	}
</script>
