<template>
	<div class="config-box">
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane label="配置管理" name="first">
				<!-- <h5 class="mu-monitor--title">
					配置文件
				</h5> -->

				<div>
					<!-- 搜索 -->
					<div class="top-select">
						<div>
							<label>平台：</label>
							<el-select v-model="listCode.platform_id"
								filterable
								@change="changePlatform"
								placeholder="请选择平台">
								<el-option v-for="item in platforms"
									:key="'888' + item.value"
									:label="item.name"
									:value="item.value">
								</el-option>
							</el-select>
						</div>
						<div>
							<label>分区：</label>
							<mu-select :options="sections"
								@change="changeSection"
								v-model="listCode.section_id"
								default-value
								placeholder="请选择分区">
							</mu-select>
						</div>
						<div>
							<label>类型：</label>
							<el-select v-model="listCode.type_id" filterable clearable placeholder="请选择类型" @change="changeType">
								<el-option v-for="item in types"
									:key="'aaa' + item.id"
									:label="item.name +'　'+ item.cname"
									:value="item.id">
								</el-option>
							</el-select>
						</div>
					</div>
					<!-- 上线按钮 -->
					<div class="center-btn">
						<div>
							<el-button type="info" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 125"  @click="upfile(ele)">上传文件</el-button>
							<p class="config-text">
								{{configText}}
							</p>
							<el-button type="danger" v-for="(ele, i) in elementIds" :key="'rba_' + i" v-if="ele.element_code == 132" @click="showRollback(ele.element_id)">一键回滚</el-button>
							<el-button type="primary" v-for="(ele, i) in elementIds" :key="'_pack_' + i" v-if="ele.element_code == 133" @click="showPack(ele.element_id)">打全量包</el-button>
						</div>
						<div>
							<el-button type="success" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 131" @click="locks(ele)">解锁表</el-button>
							<el-button type="primary" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 119" @click="uplines = true">上线</el-button>
						</div>
					</div>
					<el-table :data="tableData"
						stripe
						border
						style="width: 100%;">
						<el-table-column prop="type_name"
							label="配置类型"
							min-width="140">
						</el-table-column>
						<el-table-column label="中文名称"
							min-width="140">
							<template slot-scope="scope">
								<span>{{scope.row.cname}}</span>
								<el-tag v-if="scope.row.status == 'online'" size="mini">上线</el-tag>
								<el-tag v-else-if="scope.row.status == 'effective'" size="mini" type="success">有效</el-tag>
								<el-tag v-else-if="scope.row.status == 'invalid'" size="mini" type="danger">无效</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="版本" min-width="100">
							<template slot-scope="scope">
								<el-tag size="mini" type="success">{{scope.row.version}}</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="who" label="上传者" width="80"></el-table-column>
						<el-table-column label="时间" min-width="140">
							<template slot-scope="scope">
								{{handleDate(scope.row.upload_time * 1000)}}
							</template>
						</el-table-column>
						<el-table-column prop="desc" label="描述" min-width="120"></el-table-column>
						<el-table-column label="操作1" width="140" >
							<template slot-scope="scope">
								<el-button size="small" type="info" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 115" @click="editBtn(scope.row.config_id,ele,scope.row.desc)" >修改</el-button>
								<el-button size="small" type="warning" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 118 && scope.row.status == 'invalid'" :loading="loading" @click="valid(scope.row,ele)" >有效</el-button>
								<a style="margin-left:10px" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 116 && scope.row.status != 'invalid'" :href="gameUrl + '/service/config_download?id=' + scope.row.config_id + '&menu=' + menuId + '&ele=' + ele.element_id + '&authorization=' + token" download><el-button size="small" type="primary">下载</el-button></a>
							</template>
						</el-table-column>
						<el-table-column label="操作2" width="140" >
							<template slot-scope="scope">
								<el-button size="small" type="info" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 114" @click="details(scope.row,ele)">查看</el-button>
								<el-button size="small" type="primary" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 117" @click="historyVer(scope.row,ele)">对比</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="page-change">
						<el-pagination @size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							:current-page="page"
							:page-size="size"
							layout="total, sizes, prev, pager, next"
							:total="total">
						</el-pagination>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="操作记录" name="second" :lazy="true">
				<operate :active-flag="activeName"></operate>
			</el-tab-pane>
			<el-tab-pane label="定时加载" name="three">
				<online :menu="this.menuId" :eles="elementIds" :active="activeName"></online>
			</el-tab-pane>
		</el-tabs>

		<el-dialog title="上传文件信息"
			:visible.sync="uploadVisible"
			:before-close="closeUpload1"
			:modal="false"
			:fullscreen="true" >
			<upload @close-modal="closeUpload" :uploads="uploadVisible" :eles="upEle"></upload>
		</el-dialog>
		<!-- 上线 -->
		<el-dialog title="有效列表"
			:fullscreen="true"
			:before-close="closeUpline"
			:modal="false"
			:visible.sync="uplines"
			:modal-append-to-body="false"
			custom-class="upline-padding" >
			<upLine @close-upLine="closeUpline"
				@refresh-list="refreshList"
				:show="uplines"
				:eles="elementIds"
				:menu="menuId"
				@show-compare="showCompare">
			</upLine>
		</el-dialog>
		<!-- 修改描述 -->
		<el-dialog title="配置文件"
			:visible.sync="modificat"
			:modal-append-to-body="false"
			custom-class="edits">
			<div>
				<label>描述：</label>
				<el-input type="textarea"
					:rows="3"
					placeholder="请输入内容"
					resize="none"
					v-model="desc">
				</el-input>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="modificat = false">取 消</el-button>
				<el-button type="primary" @click="changeDesc">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 上传以后弹框 -->
		<el-dialog title="文件上传信息"
			width="80%"
			:visible.sync="uploadInfo"
			:modal-append-to-body="false">
			<div>
				<ul class="ul-box">
					<li class="ul-title">
						<p>平台</p>
						<p>分区</p>
						<p>文件类型</p>
						<p>文件名</p>
						<p>操作</p>
					</li>
					<li class="ul-main clearfloat" v-for="(item,index) in uploadSuccess" :key="index">
						<div class="ul-text1">
							{{item.platform_name}}
						</div>
						<div class="ul-text2">
							<div v-for="(val,i) in item.section" :key="i">
								<div class="ul-text4">
									<p>{{val.section_name}}</p>
								</div>
								<div class="ul-text3">
									<div v-for="(val1,j) in val.data" :key="j">
										<p>{{val1.type_name}}</p>
										<p>{{val1.filename}}</p>
										<p>
											<el-button type="text" @click="uploadCurr(val1,item.platform_id,val.section_id)">对比</el-button>
										</p>
									</div>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="uploadInfo = false">关 闭</el-button>
			</div>
		</el-dialog>
		<!-- 查看 -->
		<el-dialog :title="typeName" :visible.sync="examine" :fullscreen="true" :modal-append-to-body="false" >
			<el-table :data="detailList" >
				<el-table-column v-for='(item, index) in title1' :key='index' :label='item' >
					<el-table-column :label='title2[index]' :prop="title2[index]" min-width="200">
					</el-table-column>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary"  @click="examine = false">关 闭</el-button>
			</div>
		</el-dialog>
		<!-- 对比 -->
		<el-dialog :title="typeName" :visible.sync="vresions" :fullscreen="true" :modal="false" >
			<div class="contrast">
				<p>当前版本：{{nowVersion}}</p>

				<el-select filterable v-model="checkCP" @change="changeCP" placeholder="请选择">
					<el-option v-for="(item, i) in compPlatforms" :key="i" :label="item.name" :value="item.value">
					</el-option>
				</el-select>

				<!-- <el-select filterable v-model="checkSection" @change="changeSN" placeholder="请选择">
					<el-option v-for="(item, i) in compSections" :key="i" :label="item.name" :value="item.id">
					</el-option>
				</el-select> -->
				<mu-select :options="compSections" v-model="checkSection" @change="changeSN" default-value></mu-select>

				<el-select filterable v-model="checkVersion" @change="changeVersion" placeholder="请选择">
					<el-option v-for="item in versionsList" :key="item.id" :label="item.status == 'online'? '线上版本：'+ item.version : '版本：' + item.version" :value="item.id">
					</el-option>
				</el-select>
				<div class="contrast-tips">
					<p style="color: #67c23a">
						<span>行新增:</span><span :class="{'fontSizes':contrastObj.row_add_number > 0}">{{contrastObj.row_add_number}}</span>
					</p>
					<p style="color:#f56c6c">
						<span>行删除:</span><span :class="{'fontSizes':contrastObj.row_delete_number>0}">{{contrastObj.row_delete_number}}</span>
					</p>
					<p style="color:#e6a23c">
						<span>修改:</span><span :class="{'fontSizes':contrastObj.edit_number>0}">{{contrastObj.edit_number}}</span>
					</p>
					<p style="color:#67c23a;">
						<span>列新增:</span><span :class="{'fontSizes':contrastObj.column_add_number>0}">{{contrastObj.column_add_number}}</span>
					</p>
					<p style="color:#f56c6c">
						<span>列删除:</span><span :class="{'fontSizes':contrastObj.column_delete_number>0}">{{contrastObj.column_delete_number}}</span>
					</p>
				</div>
			</div>
			<el-table :data="contrastTable" border :header-cell-class-name="handlemyclass" :cell-class-name="cell" >
				<el-table-column v-for='(item, index) in table1' :key='index' :label='typeof item == "object"? item.data : item'>
					<el-table-column :label='typeof table2[index] == "object" ? table2[index].data : table2[index]' :autos="table2[index]" min-width="200">
						<template slot-scope="scope">
							<div v-if="typeof scope.row[index] == 'object' && scope.row[index].mark == 'edit'">
								<p>{{scope.row[index].data}}</p>
								<p style="color:rgb(245, 108, 108)">{{scope.row[index].origin_data}}</p>
							</div>
							<div v-else>{{typeof scope.row[index] == 'object' ? scope.row[index].data : scope.row[index]}}</div>
						</template>
					</el-table-column>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="vresions = false">关 闭</el-button>
			</div>
		</el-dialog>
		<!-- 解表锁 -->
		<el-dialog title="解除表锁" @close="lockShow = false" :visible="lockShow" :modal-append-to-body="false">
			<div class="lock-box">
				<label>操作密码：</label>
				<el-input v-model="lockpass" placeholder="请输入操作密码"></el-input>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="lockShow = false">取 消</el-button>
				<el-button type="primary" @click="unLocks">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 回滚和打包 -->
		<el-dialog :title="dialogTitle" @close="btnVisible = false" :visible="btnVisible" :modal-append-to-body="false">
			<div >
				<!-- <el-form :inline="true" :model="formInline">
					<el-form-item label="平台">
						<el-select filterable v-model="formInline.platform" placeholder="平台" @change="composeSections">
							<el-option :label="item.name" :value="item.value" v-for="(item, i) in platforms" :key="'rb_' + i"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="分区">
						<el-select filterable v-model="formInline.section" placeholder="分区">
							<el-option :label="item.name" :value="item.id" v-for="(item, i) in sections" :key="'ss_' + i"></el-option>
						</el-select>
					</el-form-item>
				</el-form> -->

				<el-form :inline="true" :model="formInline" >
					<p class="inlines-box">您确定要对
						<span>{{filterPlaf(listCode.platform_id)}}</span>
						平台
						<span>{{filterSection(listCode.section_id)}}</span>
						分区做{{dialogTitle}}操作吗？
					</p>
					<el-form-item label="操作密码">
						<el-input v-model="formInline.password" placeholder="请输入操作密码"></el-input>
					</el-form-item>
				</el-form>

				<div>
					<el-button @click="btnVisible = false">取消</el-button>
					<el-button type="primary" @click="btnAction" :disabled="execLoading">确定</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>

import { list } from '../sections/api'
import * as typeApi from '../types/api'
import gpMixins from '../game-platform.mixins'
import dateMixins from '../date.mixins'
import Upload from './upload'
import $ from 'jquery'

const checkPWD = 'wozhendeyaozhemezuo'

import {
	configList,
	unlock,
	configEdit,
	configDownload,
	configDetail,
	historyVersion,
	configCompare,
	effectives,
	rollback,
	pack,
	lastLog,
} from './api.js'

import { GAME_ROOT } from '../../apis/config'
import upLine from './upline'

import operate from './operateHistory'
import online from './timeOnline'

import { getToken } from '../../utils/auth'

export default {
	props: ['elementIds', 'menuId'],
	mixins: [gpMixins, dateMixins],
	components: { Upload, upLine, operate, online },
	data() {
		return {
			lockele: {},
			lockpass: '',
			lockShow: false,
			table1: [],
			table2: [],
			contrastTable: [],
			uplines: false,
			checkVersion: '',
			nowVersion: '',
			nowVersionid: '',
			vresions: false,
			versionsList: [],
			title1: [],
			title2: [],
			detailList: [],
			typeName: '',
			examine: false,
			gameUrl: GAME_ROOT,
			modificat: false,
			checkId: '',
			ele: '',
			total: 0,
			page: 1,
			size: 10,
			loading: false,
			desc: '',
			listCode: {
				platform_id: '',  // 平台ID 可选
				section_id: '',   // 分区ID 可选
				type_id: '',      // 类型ID 可选
				page: 1,         // 当前页 可选 默认1
				per_page: 15,
			},
			gameId: 1,
			sections: [],
			types: [],
			tableData:[],
			uploadVisible: false,
			activeName: 'first',
			contrastObj: {},
			typesCurr: [],
			uploadInfo: false,
			uploadSuccess: [],
			upEle: {},
			token: encodeURIComponent(getToken()),
			btnVisible: false,
			formInline: {
				platform: '',
				section: '',
				password: ''
			},
			dialogTitle: '',
			btnType: '',
			configText: '',
			compPlatforms: [],
			checkCP: '',
			compSections: [],
			checkSection: '',
			checkType: '',
			execLoading: false,
		}
	},
	watch: {
		platforms(val) {
			this.listCode.platform_id = val[0].value
			this.getSections()
				.then(json => {
					if(json.code == 200) {
						this.page = 1
						this.lastLogAction()

						this.configSearch()
					}
				})

			this.compPlatforms = [...val]
		},
	},
	methods: {
		filterPlaf(id) {
			let plafname = this.platforms.filter(e=> e.value == id)
			if(plafname && plafname.length > 0) {
				return plafname[0].name
			} else {
				return ''
			}

		},
		filterSection(id) {
			let sectionName = this.sections.filter(e=> e.id == id)
			if(sectionName && sectionName.length > 0) {
				return sectionName[0].name
			} else {
				return ''
			}
		},
		changeSN(val) {
			// this.checkSection = val
			const params = {
				platform_id: this.checkCP,
				section_id: this.checkSection,
				type_id: this.checkType
			}
			historyVersion(params, {
				menu: this.menuId
			}).then(body=> {
				if(body.code == 200) {
					this.versionsList = body.result
					if(body.result && body.result.length > 0) {
						this.checkVersion = body.result[0].id
						this.changeVersion()
					} else {
						this.checkVersion = ''
						this.contrastTable = []
						this.title1 = []
						this.title2 = []
					}
				}
			})
		},
		changeCP() {
			list({
				game_id: this.gameId,
				platform_id: this.checkCP,
				all: 'yes'
			}, {
				menu: this.menu
			}).then(json => {
				if(json.code == 200) {
					this.compSections = json.result
					if(json.result && json.result.length > 0) {
						this.checkSection = json.result[0].id
						this.changeSN()
					} else {
						this.checkSection = ''
						this.title1 = []
						this.title2 = []
						this.contrastTable = []
					}
				}
			})
		},
		lastLogAction() {
			lastLog({
				platform: this.listCode.platform_id,
				section: this.listCode.section_id || 0
			}).then(json => {
				if(json.code == 200) {
					this.configText = json.result.created_time ? json.result.platform_name + json.result.section_name + this.handleDate(json.result.created_time * 1000) + ' ' + json.result.message : ''
				}
			})
		},
		//在上线中调用对比的接口
		showCompare(row) {
			this.nowVersionid = row.id
			this.nowVersion = row.version

			/**
			 *
			 */
			this.composeFN(row.type)

			let params = {
				platform_id: row.platform,
				section_id: row.section,
				type_id: row.type,
			}
			return historyVersion(params, {
				menu: this.menuId
			}).then(body => {
				if(body.code == 200) {
					this.vresions = true
					this.versionsList = body.result
					this.checkVersion = body.result[0].id
					this.contrastList( row.id, body.result[0].id)
				}
			})
		},
		showRollback(eleId) {
			this.btnVisible = true
			this.ele = eleId
			this.dialogTitle = '一键回滚'
			this.btnType = 'rollback'
			this.execLoading = false
		},
		showPack(eleId) {
			this.btnVisible = true
			this.ele = eleId
			this.dialogTitle = '打全量包'
			this.btnType = 'pack'
			this.execLoading = false
		},
		btnAction() {
			if(this.formInline.password != checkPWD) {
				this.$message.error('请输入正确的操作密码')
				return false
			}
			this.execLoading = true
			const _action = this.btnType == 'rollback' ? rollback : pack
			return _action({
				platform: this.listCode.platform_id,
				section: this.listCode.section_id
			}, { menu: this.menuId, ele: this.ele })
			.then(json => {
				this.execLoading = false
				if(json.code == 200) {
					this.$message.success(this.btnType == 'rollback' ? '回滚成功！' : '打包成功')
					this.btnVisible = false
				}
			})
			.catch(_=> {
				this.execLoading = false
			})
		},
		composeSections() {
			list({
				game_id: this.gameId,
				platform_id: this.formInline.platform_id,
				all: 'yes'
			}, {
				menu: this.menuId
			}).then(json => {
				if(json.code == 200) {
					this.sections = json.result
				}
			})
		},

		locks(ele) {
			this.lockele = ele
			this.lockShow = true
		},
		unLocks() {
			if(this.lockpass != checkPWD) {
				this.$message.error('请输入正确的操作密码')
				return
			}
			unlock({
				password: this.lockpass
			},{
				menu: this.menuId,
				ele:this.lockele.element_id
			}).then(body=> {
				if(body.code == 200) {
					this.lockShow = false
					this.$message.success('解表锁成功')
				}
			})
		},
		// 上传文件
		upfile(ele) {
			this.uploadVisible = true
			this.upEle.ele = ele
			this.upEle.menuId = this.menuId
		},
		//表头添加颜色
		handlemyclass({row, column, rowIndex, columnIndex}) {
			if(rowIndex == 1 && typeof this.table2[columnIndex] == 'object') {
				if(this.table2[columnIndex].mark == 'add') {
					return 'color4'
				} else if(this.table2[columnIndex].mark == 'delete') {
					return 'color5'
				}
			}
		},
		// 表格颜色
		cell({row, column, rowIndex, columnIndex}) {
			if(typeof row[columnIndex] == 'object') {
				if(row[columnIndex].mark == 'add' && column.label == this.typesCurr[columnIndex]) {
					return 'color1'
				} else if(row[columnIndex].mark == 'delete' && column.label == this.typesCurr[columnIndex]) {
					return 'color3'
				} else if(row[columnIndex].mark == 'edit' && column.label == this.typesCurr[columnIndex]) {
					return 'color2'
				}
			}

		},
		getSections() {
			return list({
				game_id: this.gameId,
				platform_id: this.listCode.platform_id,
				all: 'yes'
			}, {
				menu: this.menu
			}).then(json => {
				if(json.code == 200) {
					// setTimeout(_ => {
					this.sections = json.result.length ? json.result : [...json.result]
					this.listCode.section_id = json.result[0] ? json.result[0].id : ''
					// }, 100)
					this.configSearch()
				}
				return json
			})
		},
		getTypeList() {
			return typeApi.list({
				all: 'yes'
			})
		},
		changePlatform() {
			this.page = 1
			this.listCode.type_id = ''
			this.getSections()
		},
		changeSection() {
			this.page = 1
			this.listCode.type_id = ''
			this.configSearch()
		},
		changeType() {
			this.page = 1
			this.configSearch()
		},
		editBtn(id, ele, desc) {
			this.checkId = id
			this.ele = ele
			this.desc = desc
			this.modificat = true
		},
		changeDesc() {
			if(this.desc == '') {
				this.$message.error("请输入描述")
				return
			}
			configEdit({
				id: this.checkId,
				desc: this.desc
			},{
				menu: this.menuId,
				ele: this.ele.element_id
			}).then(body=> {
				this.modificat = false
				this.configSearch()
				this.$message.success("修改完成")
			})
		},

		// 分页
		handleCurrentChange(val) {
			this.page = val
			this.configSearch()
		},
		//每页个数
		handleSizeChange(val) {
			this.size = val
			this.page = 1
			this.configSearch()
		},
		configSearch() {
			let that = this
			let code = that.listCode
			let params = {
				platform_id: code.platform_id,
				section_id: code.section_id,
				type_id: code.type_id,
				page: this.page,
				per_page: this.size,
			}
			configList(params, {menu: this.menuIds}).then(body => {
				if (body.code == 200) {
					this.tableData = body.result
					this.total = body.result_info.total
				}else{
					that.$message.error({showClose: true, message: body.message, duration: 2000})
				}
			}).catch(function (error) {
				that.loading = false
				that.$message.error({showClose: true, message: error.message, duration: 2000})
			})
		},
		details(row,ele) {
			this.typeName = row.type_name+row.cname
			configDetail({
				id: row.config_id
			},{
				menu:this.menuId,
				ele:ele.element_id
			}).then(body=> {
				if(body.code == 200) {
					this.detailList = []
					this.title1 = []
					this.title2 = []
					this.examine = true
					let datas = body.result.data
					for(let k in datas) {
						this.detailList.push(datas[k])
					}
					let cnames = body.result.key[0]
					for(let i in cnames) {
						this.title1.push(cnames[i])
					}
					let types = body.result.key[1]

					for(let j in types) {
						this.title2.push(types[j])
					}
				}
			})
		},
		closeUpload(data) {
			this.uploadVisible = false
			this.page = 1
			this.configSearch()
			if(data && typeof data == 'object') {
				this.uploadInfo = true
				this.uploadSuccess = data
			}

		},
		closeUpload1() {
			this.uploadVisible = false
			this.page = 1
			this.configSearch()
		},
		closeUpline() {
			this.uplines = false
			this.page = 1
			this.configSearch()
		},
		refreshList() {
			this.configSearch()
		},
		composeFN(type,plaf,section) {
			/**
			 * start
			 * 新增对比的平台分区功能
			 */
			if(plaf) {
				this.checkCP = plaf
			} else {
				this.checkCP = this.listCode.platform_id
			}
			this.checkType = type

			// this.checkSection = this.listCode.section_id

			list({
				game_id: this.gameId,
				platform_id: this.checkCP,
				all: 'yes'
			},{
				menu: this.menu
			}).then(json => {
				if(json.code == 200) {
					this.compSections = json.result
					if(plaf) {
						this.checkSection = this.compSections.filter(el => el.id == section)[0]
					} else {
						this.checkSection = this.compSections.filter(el => el.id == this.listCode.section_id)[0]
					}
				}
			})

			/**
			 * end
			 */
		},
		historyVer(row, ele) {
			this.typeName = row.type_name + row.cname
			this.nowVersion = row.version
			this.nowVersionid = row.config_id

			this.composeFN(row.type_id)

			let version = this.listCode
			let params = {
				platform_id: version.platform_id,
				section_id: version.section_id,
				type_id: row.type_id,
			}

			historyVersion(params, {
				menu: this.menuId,
				ele: ele.element_id
			}).then(body=> {
				if(body.code == 200) {
					this.vresions = true
					this.versionsList = body.result
					if(body.result[0]) {
						this.checkVersion = body.result[0].id
						this.contrastList( row.config_id,body.result[0].id)
					}
				}
			})
		},
		//上线对比
		uploadCurr(row,plaf,sections) {
			this.typeName = row.type_name + row.cname + ''
			this.nowVersion = row.version
			this.nowVersionid = row.id

			this.composeFN(row.type,plaf,sections)

			let params = {
				platform_id: row.platform,
				section_id: row.section,
				type_id: row.type,
			}
			historyVersion(params, {
				menu: this.menuId
			}).then(body=> {
				if(body.code == 200) {
					this.vresions = true
					this.versionsList = body.result
					this.checkVersion = body.result[0].id
					this.contrastList( row.id, body.result[0].id)
				}
			})
		},
		changeVersion() {
			this.contrastList( this.nowVersionid, this.checkVersion)
		},
		//对比接口
		contrastList(current, compare) {
			configCompare({
				current_id: current,
				compare_id: compare
			}, {
				menu: this.menuId,
			}).then(body=> {
				if(body.code == 200) {
					this.contrastTable = []
					this.table1 = []
					this.table2 = []
					this.typesCurr = []
					this.contrastObj = body.result
					let datas = body.result.data.data
					for(let k in datas) {
						this.contrastTable.push(datas[k])
					}
					let cnames = body.result.data.key[0]
					for(let i in cnames) {
						this.table1.push(cnames[i])
					}
					let types = body.result.data.key[1]
					for (let i in types) {
						if(typeof types[i] == 'object') {
							this.typesCurr.push(types[i].data)
						} else {
							this.typesCurr.push(types[i])
						}
					}
					for(let j in types) {
						this.table2.push(types[j])
					}
				}
			})
		},
		valid(rows,ele) {
			let that = this
			that.loading = true
			effectives({ id: rows.config_id },{
				menu: this.menuId,
				ele: ele.element_id
			}).then(body=> {
				that.loading = false
				if(body.code == 200) {
					this.configSearch()
				}
			}).catch(function (error) {
				that.loading = false
				console.log(error);
				that.$message.error({showClose: true, message: error.message, duration: 2000});
			});
		},
	},
	created() {
		this.getTypeList()
			.then(json => {
				if(json.code == 200) {
					this.types = json.result
				}
			})
	}
}
</script>

<style lang="less">
.config-box {
	.el-button:first-child {
		padding: 6px 10px !important;
	}
	.el-input__icon {
		line-height: 25px;
	}
	.top-select {
		margin: 20px 0;
		& > div {
			margin-bottom: 10px;
			margin-right: 10px;
			display: inline-block;
			.el-input {
				width: 220px;
			}
		}
	}
	.center-btn {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		// margin-right: 20px;
		.config-text {
			display: inline-block;
			margin: 0 10px;
		}
	}
	.page-change {
		margin: 20px 0 0;
		text-align: right;
	}
	.edits {
		label {
			vertical-align: top;
		}
		.el-textarea {
			width: 90%;
			vertical-align: top;
		}
	}
	.config-details table{
		width: 100%;
	}
	.contrast {
		position: relative;
		margin-bottom: 20px;
		& > p {
			display: inline-block;
			margin-right: 20px;
		}

	}
	.contrast-tips {
		// position: absolute;
		// left: 50%;
		// top: 50%;
		// transform: translate(-50%,-50%);

		float: right;
		P{
			display: inline-block;
			margin-right: 10px;
		}
		.fontSizes {
			font-size: 30px;
		}

	}
	.color1 {
		background: #dff0d8;
	}
	.color2 {
		background:#fcf8e3;
	}
	.color3 {
		background: #fdd2d2;
	}
	.color4{
		background: #dff0d8 !important;
	}
	.color5 {
		background: #fdd2d2 !important;
	}
	.el-table .warning-row {
		background: oldlace;
	}

	.el-table .success-row {
		background: #f0f9eb;
	}
	.upline-padding {
		.el-dialog__body{
			padding: 0;
		}
	}
	.ul-box {
		width: 80%;
		height: auto;
		margin: 0 auto;
		border: 1px solid #ccc;
		.ul-title {
			display: flex;
			justify-content: space-around;
			align-content: center;
			background: #eee;
			border-bottom: 1px solid #ccc;
			height: 40px;
			line-height: 40px;
			p{
				flex: 1;
				border-right: 1px solid #ccc;
				text-align: center;

			}
			p:last-child{
				border-right: none;
			}
		}
	}
	.ul-main {
		display: flex;
		justify-content: space-around;
		align-content: center;
		text-align: center;
		.ul-text1 {
			flex: 1;
			border-right: 1px solid #ccc;
			display: flex;
			justify-content: center;
			flex-direction: column;
			border-bottom: 1px solid #ccc;
		}

	}
	.ul-text2 {
		flex: 4;
		border-bottom: 1px solid #ccc;
		& > div {
			width: 100%;
			display: flex;
			justify-content: space-around;
		}

	}

	.ul-text4 {
		flex: 1;
		border-bottom: 1px solid #ccc;
		border-right: 1px solid #ccc;
		display: flex;
		justify-content: center;
		flex-direction: column;
		p {
			padding: 10px;
		}
	}

	.ul-text3 {
		flex: 3;
		border-bottom: 1px solid #ccc;
		display: flex;
		justify-content: center;
		flex-direction: column;
		height: auto;
		& > div{
			height: 100%;
			display: flex;
			justify-content: space-around;
			& > p {
				flex: 1;
				border-bottom: 1px solid #ccc;
				border-right: 1px solid #ccc;
				height: 100%;
				min-height: 36px;
				display: flex;
				justify-content: center;
				flex-direction: column;
				word-break:break-all;
				padding: 5px;
			}
			& > p:last-child {
				border-right: none;
			}
		}
		& > div:hover {
			background: rgb(252, 244, 244);
		}
		& > div:last-child{
			& > p{
				border-bottom: none;
			}
		}
	}
	.ul-text2 > div:last-child >.ul-text3, .ul-text2 > div:last-child >.ul-text4{
		border-bottom: none;
	}
	li:last-child .ul-text1,li:last-child .ul-text2{
		border-bottom: 0px;
	}
}
.el-input__icon {
	line-height: 30px;
}
.lock-box {
	.el-input {
		width: 220px;
	}
}
.inlines-box {
	margin: -10px 0 20px;
	span {
		color: rgb(241, 57, 57);
	}
}
</style>
