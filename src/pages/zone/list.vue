<template>
    <div class="zone-list-wrap">
        <h2>总览</h2>
        <div class="zone-form1">
            <el-form label-width="80px" inline :model="zoneForm">
                <el-form-item label="游戏">
					<el-select width="180" @change="changeGame" v-model="zoneForm.game_id">
						<el-option v-for="(item, i) in games" :key="i" :label="item.cname" :value="item.id"></el-option>
					</el-select>
                </el-form-item>
				<el-form-item label="平台">
					<search-select ref="platform" placeholder="请选择平台" :data="platforms" @toggle-all="getChecked" @check-handle="getChecked" clazz="ip-ss" :width="180" type="platform_id"></search-select>
				</el-form-item>
				<el-form-item label="外网ip">
                    <el-input v-model="zoneForm.extranet_ip"></el-input>
                    <!-- <search-select ref="extranet_ip" width="180" @toggle-all="ssHandle" @check-handle="ssHandle" type="extranet_ip" :data="extranet_ips"></search-select> -->
                </el-form-item>
                <el-form-item label="内网ip">
                    <el-input v-model="zoneForm.intranet_ip"></el-input>
                    <!-- <search-select ref="intranet_ip" width="180" @toggle-all="ssHandle" @check-handle="ssHandle" type="intranet_ip" :data="intranet_ips"></search-select> -->
                </el-form-item>
                <el-form-item label="区服号">
                    <el-input v-model="zoneForm.game_partition_id"></el-input>
                </el-form-item>
                <el-form-item label="区服范围">
                    <el-input v-model="zoneForm.range_start" class="range-start"></el-input>
                    <span class="range-label">to</span>
                    <el-input v-model="zoneForm.range_end" class="range-end"></el-input>
                </el-form-item>

                <el-form-item label="分区">
                    <!-- <el-input v-model="zoneForm.zone"></el-input> -->
                    <search-select ref="zone" width="180" @toggle-all="ssHandle" @check-handle="ssHandle" type="section_id" :data="blocks"></search-select>
                </el-form-item>
                <el-form-item label="区服状态">
                    <search-select ref="qf_status" width="180" @toggle-all="ssHandle" @check-handle="ssHandle" type="game_partition_status" :data="qfStatus.game_partition_status"></search-select>
                    <!-- <el-input v-model="zoneForm.status"></el-input> -->
                </el-form-item>
                <el-form-item label="开服时间">
                    <el-date-picker v-model="zoneForm.opentime_range"
                        type="daterange"
                        end-placeholder="结束日期"
                        start-placeholder="开服日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="游戏状态">
                    <search-select ref="game_status" width="180" @toggle-all="ssHandle" @check-handle="ssHandle" type="game_status" :data="qfStatus.game_status"></search-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="qfSearchAction">搜索</el-button>
                    <el-button @click="clearAll">清空</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="flex zone-out-wrap">
            <div class="zone-tip-wrap">
                <!-- <span class="zone-tw-label">展示字段：</span>
                <el-checkbox-group v-model="customClnList">
                    <el-checkbox label="ip"></el-checkbox>
                    <el-checkbox label="heiheihei"></el-checkbox>
                    <el-checkbox label="hahaha"></el-checkbox>
                </el-checkbox-group>

                <span class="zone-tw-tip">说明：表中未勾选的列在此，勾选后展现在表中</span> -->
            </div>

            <div class="">
				<el-select v-model="method" defaultActive="2">
					<el-option :value="3" label="游戏">游戏</el-option>
					<el-option :value="2" label="路由">路由</el-option>
					<el-option :value="4" label="拓展">拓展</el-option>
					<el-option :value="5" label="全部">全部</el-option>
				</el-select>
                <el-button type="info" v-for="(ele, i) in elementIds" :key="i" @click="showModal('close', ele.element_id)" v-if="ele.element_code == 111">关闭</el-button>
                <el-button type="success" v-for="(ele, i) in elementIds" :key="i" @click="showModal('open', ele.element_id)" v-if="ele.element_code == 121">启动</el-button>
                <el-button type="danger" v-for="(ele, i) in elementIds" :key="i" @click="showModal('reopen', ele.element_id)" v-if="ele.element_code == 122">重启</el-button>
            </div>
        </div>
        <div class="zone-list">
            <el-table :data="tableData"
                v-loading="loading"
                stripe
                @selection-change="handleSelection"
                style="width: 100%">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
				<el-table-column
                    prop="game_partition_id"
					sortable
                    label="区服ID"
                    width="60">
                </el-table-column>
                <el-table-column
                    prop="game_name"
                    label="区服名字"
                    width="120">
                </el-table-column>
                <el-table-column
                    label="开服时间"
                    width="180" >
                    <template slot-scope="scope">
                        {{scope.row.createtime}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="游戏状态">
					<template slot-scope="scope">{{getName(scope.row.status)}}</template>
                </el-table-column>
                <el-table-column
                    prop="total_player"
                    label="总人数">
                </el-table-column>
                <el-table-column
                    prop="total_online_player"
                    label="在线人数">
                </el-table-column>
                <el-table-column
                    prop="game_extport"
                    label="游戏扩展端口">
                </el-table-column>
                <el-table-column
                    prop="game_gmport"
                    label="游戏gm端口">
                </el-table-column>
                <el-table-column
                    prop="ext_game_port"
                    label="扩展gm的port">
                </el-table-column>
                <el-table-column
                    prop="intranet_ip"
                    label="内网IP">
                </el-table-column>
                <el-table-column
                    prop="mode"
                    label="游戏运行模式">
                </el-table-column>
                <el-table-column
                    prop="game_port"
                    label="游戏端口">
                </el-table-column>
                <el-table-column
                    prop="gates_status"
                    label="网关状态">
                </el-table-column>
                <!-- <el-table-column
                    prop="ext_status"
                    label="扩展状态">
                </el-table-column> -->
            </el-table>
        </div>

        <el-dialog title="提示"
			width="50%"
			:modal-append-to-body="false"
  			:visible.sync="terminalVisible"
			:close-on-click-modal="false"	
		>
			<terminal :data="terminalData"
				:type="type"
				:element-id="eleId"
				:menu-id="menuId"
				@close="closeTerminal"
				:method="method"
				:stop="stopSocket"
			></terminal>
		</el-dialog>
    </div>
</template>
<script>
	import Terminal from './terminal'
	import { getQufuConst, getIps, getQfBlock, qfSearch, getResPlatform, getQufuList } from '../../apis/post'
	import { getGameInfo, getBlocks } from '../../apis/get'
	import { mapState, mapActions } from 'vuex'
	import gpMixins from '../game-platform.mixins'
	import dateMixins from '../date.mixins'

    export default {
		components: { Terminal },
		props: ['menuId', 'elementIds'],
		mixins: [gpMixins, dateMixins],
        data() {
            return {
                zoneForm: {
					range_start: '',
					range_end: '',
					game_id: 0,
					platform_id: [],
					extranet_ip: '',
					intranet_ip: '',
					game_partition_id: '',
					game_partition_status: [],
					opentime_range: [],
					game_status: [],
					request_type: 'list',
				},
				// game: 0,
				// platforms: [],
				// games: [],
				allGame: '',
				allPlatform: '',
				tableData: [],
				customClnList: [],
				loading: false,
				gameStatus: [],
				qufuStatus: [],
				intranet_ips: [],
				extranet_ips: [],
				blocks: [],
				checkedRows: [],
				terminalData: [],
				terminalVisible: false,
				type: '',
				method: 5,
				eleId: 0,
				stopSocket: false,
				// platformData: []
            }
		},
		computed: {
			...mapState({
				qfStatus: state => state.qufu.qfStatus
			})
		},
		watch: {
			GAME_ID(newv) {
				this.zoneForm.game_id = newv
			}
		},
        created() {
			if(!this.qfStatus.length) {
				this.getQfStatusAndGameStatus()
			}
		},
        methods: {
			...mapActions(['getQfStatusAndGameStatus']),
			changeGame(v) {
				this.$refs.platform.clear()
                this.platforms = this.handleData(v, this.games, this.platformData)
            },
            getChecked(vals, type) {
				this.zoneForm[type] = vals.map(e => e.value)
				if(type == 'platform_id') {
					if(vals.length == 1) {
						this.getBlocks({platform_id: vals[0].value})
					} else {
						this.blocks = []
					}
				}
			},
			getBlocks(params) {
				getBlocks(params, {menu: this.menuId})
					.then(json => {
						if(json.code == 200) {
							if(json.result[0]) {
								var ret = json.result
								this.blocks = ret.map(e => {
									e.value = e.id
									return e
								})
							}
						}
					})
			},
			ssHandle(vals, type) {
				this.zoneForm[type] = vals.map(e => e.value)
			},
			qfSearchAction() {
				this.loading = true

				if(this.zoneForm.opentime_range) {
					this.zoneForm.opentime_range = this.zoneForm.opentime_range.map(e => {
						return this.handleDate(e)
					})
				}

				getQufuList(this.zoneForm, {menu: this.menuId})
					.then(json => {
						this.loading = false
						if(json.code == 200) {
							if(json.result && json.result.length) {
								var ret = json.result
								this.tableData = ret.map(e => {
									e.game_partition_id = Number(e.game_partition_id)
									return e	
								})
							} else {
								this.tableData = []
							}
						}
					})
			},
			clearAll() {
				this.zoneForm = {
					range_start: '',
					range_end: '',
					game_id: '',
					platform_id: [],
					extranet_ip: '',
					intranet_ip: '',
					game_partition_id: '',
					game_partition_status: [],
					opentime_range: [],
					game_status: []
				}

				var refs = [
					'platform',
					'zone',
					'qf_status',
					'game_status'
				]

				refs.forEach(e => {
					this.$refs[e].clear()
				})
			},
			
			handleSelection(val) {
				this.checkedRows = val
			},
			checkRow() {
				if(!this.checkedRows.length) {
					this.$message.error('没有要操作的数据')
					return false
				}
			},
			collectParams(data) {
				return { servers: data.map(e => {
					return {
						id: e.id,
						game_partition_id: e.game_partition_id,
						game_name: e.game_name,
						ip : e.intranet_ip,
						gmport : e.game_gmport,
						port : e.game_port,
						extport : e.ext_game_port,
						method : this.method,
						game_mode : e.game_mode,
						game_id: e.id,
						platform_id: e.platform_id
					}
				})}
			},
			showModal(type, ele) {
				var flag = this.checkRow()
				if(flag != undefined) {return false}
				var params = this.collectParams(this.checkedRows)

				this.terminalData = params
				this.terminalVisible = true
				this.type = type
				this.eleId = ele
				this.stopSocket = false
			},

			closeTerminal() {
				this.terminalVisible = false
				this.stopSocket = true
			},
			getName(val) {
				var res =  this.qfStatus.game_status.filter(e=> e.value == val)
				return res[0] && res[0].name
			}
        }
    }
</script>
<style lang="less">
.zone-form1 {
	.el-form-item__label {
		line-height: 30px;
	}
}

.zone-form {
	.el-select {
		margin-right: 20px;
	}
	
	.search-select.ip-ss {
		display: inline-block;
		vertical-align: bottom;
		height: 30px;
	}

	.search-select-button {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		
		height: 30px;
		padding: 7px;
	}
}

.mu-zone-search-bar {
	margin-bottom: 20px;
}

.tag-btn {
	height: 36px;
	margin-left: 10px;
}

.zone-out-wrap {
	.el-select {
		margin-right: 10px;
	}
}
</style>
