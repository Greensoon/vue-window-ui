<template>
	<mu-dialog title="游戏部署" v-model="deployModal" @close="closeDeploy">
		<div class="warn-rule mu-monitor deploy-box">
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
			<div class="aar-container mu-deploy-bottom">
				<div class="aar-container-line">
					<div class="aar-container-left">游戏：</div>
					<div class="aar-container-right">
						<template>
							<el-select @change="changeGame" v-model="gameName" placeholder="请选择">
								<el-option v-for="(item,index) in gameList"
								:key="index"
								:label="item.label"
								:value="item.value"
								v-if="item.label == '作妖计'">
								</el-option>
							</el-select>
						</template>
					</div>
				</div>
				<div class="aar-container-line">
					<div class="aar-container-left">平台：</div>
					<div class="aar-container-right">
						<template>
							<el-select v-model="platform" placeholder="请选择">
								<el-option v-for="(item, index) in platformList"
									:key="index"
									:label="item.name"
									:value="item.value">
								</el-option>
							</el-select>
						</template>
					</div>
				</div>
				<div class="aar-container-line">
					<div class="aar-container-left">应用类型：</div>
					<div class="aar-container-right">
						<template>
							<el-select v-model="apptype" placeholder="请选择">
								<el-option-group
								v-for="(group,index) in apptypeList"
								:key="index"
								:label="group.label">
								<el-option
									v-for="(item,index) in group.option"
									:key="index"
									:label="item.label"
									:value="item.label">
								</el-option>
								</el-option-group>
							</el-select>
						</template>
					</div>
				</div>
				<div class="aar-container-line">
					<div class="aar-container-left">模式：</div>
					<div class="aar-container-right">
						<template>
							<el-select v-model="mode" placeholder="请选择">
								<el-option
									v-for="(item, index) in modes"
									:key="index"
									:label="item.name"
									:value="item.value">
								</el-option>
							</el-select>
						</template>
					</div>
				</div>
				<div class="aar-container-line">
					<div class="aar-container-left">本地数据库：</div>
					<div class="aar-container-right">
						<template>
							<el-select v-model="sqlType" placeholder="请选择">
								<el-option
									v-for="(item, index) in sqlTypes"
									:key="index"
									:label="item.name"
									:value="item.value">
								</el-option>
							</el-select>
						</template>
					</div>
				</div>
				<div v-if="sqlType == 0">
					<div class="aar-container-line">
						<div class="aar-container-left">IP：</div>
						<div class="aar-container-right">
							<el-input v-model="mysqlConfig.ip" placeholder="数据库IP"></el-input>
						</div>
					</div>
					<div class="aar-container-line">
						<div class="aar-container-left">数据库用户名：</div>
						<div class="aar-container-right">
							<el-input v-model="mysqlConfig.user" placeholder="数据库用户名"></el-input>
						</div>
					</div>
					<div class="aar-container-line">
						<div class="aar-container-left">数据库密码：</div>
						<div class="aar-container-right">
							<el-input v-model="mysqlConfig.password" placeholder="数据库密码"></el-input>
						</div>
					</div>
					<div class="aar-container-line">
						<div class="aar-container-left">数据库端口：</div>
						<div class="aar-container-right">
							<template>
								<el-input v-model="mysqlConfig.port" placeholder="数据库端口"></el-input>
							</template>
						</div>
					</div>
				</div>
				<div v-if="apptype == 'game'">
					<div class="aar-container-line">
						<div class="aar-container-left">acc内网IP：</div>
						<div class="aar-container-right">
							<el-input v-model="accConfig.ip" placeholder="acc内网IP"></el-input>
						</div>
					</div>

					<div class="aar-container-line">
						<div class="aar-container-left">acc端口：</div>
						<div class="aar-container-right">
							<el-input v-model="accConfig.port" placeholder="acc端口"></el-input>
						</div>
					</div>

					<div class="aar-container-line">
						<div class="aar-container-left">部署数量：</div>
						<div class="aar-container-right">
							<el-input v-model="accConfig.count" placeholder="部署数量"></el-input>
						</div>
					</div>
				</div>
				<div v-if="apptype == 'acc' || apptype == 'game'">
					<div class="aar-container-line">
						<div class="aar-container-left vertical-top">SQL上传：</div>
						<div class="aar-container-right vertical-top">
							<el-upload
							class="upload-demo"
							name="sql"
							:headers="{Authorization:token}"
							:action="INSTALL_ROOT+'/service/uploadsql'"
							multiple
							:on-success="uploadSuccess"
							:file-list="fileList">
								<el-button size="small" type="primary">点击上传</el-button>
								<div slot="tip" class="el-upload__tip">sql文件或zip文件</div>
							</el-upload>
						</div>
					</div>
					<div class="aar-container-line">
						<div class="aar-container-left vertical-top">代码上传：</div>
						<div class="aar-container-right vertical-top">
							<el-upload
							class="upload-demo"
							name="sql"
							:headers="{Authorization:token}"
							:action="INSTALL_ROOT+'/service/uploadsql'"
							multiple
							:on-success="codeUploadSuccess"
							:file-list="codeList">
							<el-button size="small" type="primary">点击上传</el-button>
								<div slot="tip" class="el-upload__tip">只能上传zip文件</div>
							</el-upload>
						</div>
					</div>
				</div>
				<div class="deploy-btn-top">
					<el-button size="mini" type="primary" @click="deploy" :loading="load">部署</el-button>
				</div>

				<div class="code-box">
					<div class="code-result shell" id="codehtml" v-html="code"></div>
				</div>
			</div>
			<div v-if="load" class="deploy-mask"></div>
		</div>
	</mu-dialog>
</template>

<script>
import { getGameInfo, getApptype } from '../../apis/get'
import { deploy } from '../../apis/post'
import { INSTALL_ROOT, INSTALL_WS_ROOT } from '../../apis/config'
import { getToken } from '../../utils/auth'
// import hljs from 'highlight.js'
import $ from 'jquery'
import socket from '../../apis/socket'

const modes = [{
	name: '标准模式',
	value: 1
}, {
	name: '性能模式',
	value: 2
}]

const sqlTypes = [{
	name: '否',
	value: '0'
}, {
	name: '是',
	value: '1'
}]
export default {
	name: 'muMonitor',
	props: ['instanceData', 'show'],
	data() {
		var $d = this.instanceData
		var $show = this.show
		return {
			mysqlConfig: {
				ip: '',
				user: '',
				password: '',
				port: ''
			},
			accConfig: {
				ip: '',
				port: '',
				count: ''
			},
			INSTALL_ROOT,
			fileList: [],
			codeList: [],
			instance: $d || {},
			gameName: 'zyj',
			platform: '',
			apptype: 'game',
			gameList:[],
			platformList: {},
			apptypeList: [],
			code: '',
			token: '',
			modes,
			sqlTypes,
			mode: 2,
			sqlType: '0',
			sqlPath: '',
			codePath: '',
			load: false,
			resGames: [],
			res: [],
			deployModal: $show || false
		}
	},
	watch: {
		instanceData: {
			handler(newv) {
				this.instance = newv
			},
			deep: true
		},
		show: {
			handler(newv) {
				this.deployModal = newv
			},
			deep: true
		}
	},
	methods: {
		uploadSuccess(json) {
			if(json.code == 200) {
				this.$message.success('上传成功')
				this.sqlPath = json.result.fullpath
			}
		},
		deploy() {
			this.load = true
			this.code = ''
			var params = {}
			if(this.apptype == 'game') {
				params = this.getGameParams()
				for (var i in params) {
					if(params[i] == '' || params[i] == null) {
						if(i != 'sql_path' && i != 'code_path') {
							this.$message.error('参数不能为空')
							this.load = false
							return
						}

						if(i =='sql_path' && !params[i]) {
							this.$message.error('请上传sql')
							this.load = false
							return
						} else if (i == 'code_path' && !params[i]) {
							this.$message.error('请上传代码')
							this.load = false
							return
						}

					}
				}
			}

			var _this = this
			deploy(params)
				.then(json => {
					if(json.code == 200) {
						socket.init(INSTALL_WS_ROOT)
						socket.send(null, function(e) {
							var info = JSON.parse(e.data)

							if(info.result.status == 200) {
								socket.close()
								_this.load = false
							} else {
								_this.code = _this.code + `<p>${info.result.info}</p>`
								_this.divScroll()
							}
						})
					} else {
						socket.close()
						_this.load = false
					}
				}).catch(function() {
					socket.close()
					_this.load = false
				})
		},
		getGameParams() {
			var params = {
				game: this.gameName,
				platfrom: this.platform,
				appname: this.apptype,
				mode: this.mode,
				is_local_db: this.sqlType,
				deploy_amount: this.accConfig.count,
				sql_path: this.sqlPath,
				code_path: this.codePath,
				acc_ip: this.accConfig.ip,
				acc_port: this.accConfig.port,
			}

			if(this.sqlType == '0') {
				params = Object.assign(params, {
					db_host: this.mysqlConfig.ip,
					db_username: this.mysqlConfig.user,
					db_password: this.mysqlConfig.password,
					db_port: this.mysqlConfig.port,
				})
			}
			return params
		},
		codeUploadSuccess(json) {
			if(json.code == 200) {
				this.$message.success('上传成功')
				this.codePath = json.result.fullpath
			}
		},
		closeDeploy() {
			this.deployModal = false
			socket.close()
			this.load = false
			this.code = ''
			this.$emit('hidedeploy')
		},
		// handleRemove(file, fileList) {
		// 	console.log(file, fileList);
		// },
		// handlePreview(file) {
		// 	console.log(file);
		// },
		// checkType(file) {
		// 	console.log(file)
		// 	if(file.name.endsWith('.sql') || file.name.endsWith('.zip')) {
		// 		return true
		// 	}

		// 	return false
		// },
		// beforeRemove(file, fileList) {
		// 	return this.$confirm(`确定移除 ${ file.name }？`);
		// },
		handleData(id, games, data) {
			var _n = games.filter(e => e.id == id)[0].nickname
			var ret = []
			var _d = data[_n]
			for(var i in _d) {
				ret.push({
					name: _d[i][0].name,
					value: _d[i][0].id
				})
			}
			return ret
		},
		changeGame(val) {
			this.platformList = this.handleData(val, this.resGames, this.res)
			this.platform = ''
			if(this.platformList) {
				this.platform = this.platformList[0].value
			}
		},
		divScroll() {
			if(this.load) {
				var div = document.getElementById('codehtml');
				div.scrollTop = div.scrollHeight;
			}
		}
	},
	mounted() {
		// $('pre code').each(function(i, block) {
		// 	hljs.highlightBlock(block)
		// })
		this.token = getToken()
		//游戏信息获取
		getGameInfo().then(body=> {
			if(body.code == 200) {
				var res = body.result.platform_info
				var resGame = body.result.game
				this.res = res
				this.resGames = resGame
				this.gameList = resGame.map(e => {
					return {
						value: e.id,
						label: e.cname
					}
				})

				this.gameName = this.gameList[0].value
				this.platformList = this.handleData(this.gameName, resGame, res)
				this.platform = ''
				if(this.platformList) {
					this.platform = this.platformList[0].value
				}
			}
		})

		//应用类型获取
		getApptype().then(body=> {
			var res = body.result.apptype
			var arr = []
			for (var key in res) {
				arr = res[key].map(e=> {
					return {
						label: e
					}
				})

				this.apptypeList = [{
					label: '业务应用',
					option: [
						{
							label: 'game'
						}
					]
				}]
			}
		})
	}

}
</script>

<style lang="less">
	.deploy-box {
		position: relative;
		.deploy-mask {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(255,255,255,0)
		}
	}
	.mu-deploy-bottom {
		margin: 20px 0!important;
		.deploy-btn-top {
			margin-top: 20px;
		}
		.code-box {
			padding-top: 20px;
			background: #000;
			margin-top: 30px;
		}
		.code-result {
			// width: 80%;
			height: 400px;
			// overflow-x: scroll;
			padding: 20px;
			p {
				width: 100%;
				height: 28px;
				font-size: 14px;
				color: #fff;
			}
		}
	}
</style>
