<template>
    <div class="zone-dashboard">
        <div class="zone-form1">
            <el-form label-width="80px" inline :model="zoneForm">
                <el-form-item label="游戏">
					<el-select width="180" v-model="zoneForm.game_id" @change="changeGame">
						<el-option v-for="(obj, i) in games" :key="i" :value="obj.id" :label="obj.cname"></el-option>
					</el-select>
                </el-form-item>
				<el-form-item label="平台">
					<search-select ref="platform"
                        width="180"
                        @toggle-all="toggleAll"
                        @check-handle="toggleAll"
                        placeholder="请选择平台"
                        :data="platforms">
                    </search-select>
				</el-form-item>
                <el-form-item label="外网ip">
                    <el-input v-model="zoneForm.extranet_ip"></el-input>
                </el-form-item>
                <el-form-item label="内网ip">
                    <el-input v-model="zoneForm.intranet_ip"></el-input>
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
                    <search-select ref="block" width="180" :data="blocks" @toggle-all="toggleAllBlocks" @check-handle="toggleAllBlocks"></search-select>
                </el-form-item>
                <el-form-item label="区服状态">
                    <search-select ref="qf_status" @toggle-all="toggleAllQfStatus" @check-handle="toggleAllQfStatus" width="180" :data="qfStatus.game_partition_status"></search-select>
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
                    <search-select ref="game_status" @toggle-all="toggleAllGameStatus" @check-handle="toggleAllGameStatus" width="180" :data="qfStatus.game_status"></search-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button @click="clearAll">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- <div class="zd-select-wrap"> -->
            <!-- <search-select :data="platforms" placeholder="请选择平台" width="200" @check-handle="checkPlatform"></search-select> -->
            <!-- <el-select v-model="platform" @change="changePlatform">
                <el-option :value="item.value"
                    :label="item.name"
                    v-for="(item, i) in platforms"
                    :key="i" >
                </el-option>
            </el-select>
        </div> -->
        <mu-wrap title="总览">
            <wrap-block title="服务器">
                <wrap-block-item label="总区服" :value="total_server"></wrap-block-item>
                <wrap-block-item label="运行" :value="total_running"></wrap-block-item>
                <wrap-block-item label="关闭" :value="total_shutdown"></wrap-block-item>
                <wrap-block-item label="在线人数" :value="total_online"></wrap-block-item>
                <wrap-block-item label="物理服务器" :value="total_physical_server"></wrap-block-item>
            </wrap-block>
        </mu-wrap>

        <mu-wrap title="错误" width="20%">
            <wrap-block title="服务器">
                <wrap-block-item label="后端错误" color="danger" :value="total_gameserver_error" type="link" @click="showErrors"></wrap-block-item>
            </wrap-block>
        </mu-wrap>

        <el-table :data="tableData"
            v-loading="loading"
            class="dashboard-list"
            stripe
            style="width: 100%;">
            <el-table-column
                prop="game_name"
                label="区服名称"
                width="80">
            </el-table-column>
            <el-table-column
                prop="platform"
                width="60"
                label="平台">
            </el-table-column>
            <el-table-column
                prop="createtime"
                label="开服时间"
                width="140" >
            </el-table-column>
            <el-table-column
                prop="status"
                label="游戏状态">
            </el-table-column>
            <el-table-column label="错误数量">
                <template slot-scope="scope">
                    <el-button @click="showErrorModal(scope.row, 0)" type="danger" round>{{scope.row.error_count}}</el-button>
                </template>
            </el-table-column>
            <el-table-column
                prop="error_tag"
                label="错误标签">
            </el-table-column>
            <el-table-column
                prop="game_extport"
                min-width="100"
                label="游戏扩展端口">
            </el-table-column>
            <el-table-column
                prop="game_gmport"
                min-width="100"
                label="游戏gm端口">
            </el-table-column>
            <el-table-column
                prop="ext_game_port"
                min-width="120"
                label="扩展gm的port">
            </el-table-column>
            <el-table-column
                prop="intranet_ip"
                label="内网IP">
            </el-table-column>
            <el-table-column
                prop="game_mode"
                min-width="100"
                label="游戏运行模式">
            </el-table-column>
            <el-table-column
                prop="game_port"
                label="游戏端口">
            </el-table-column>
        </el-table>
        <div class="pagination-top">
            <el-pagination :current-page="currentNum" :page-size="pageSIZE" v-if="tableData.length" :total="TOTAL" background layout="total, prev, pager, next" @current-change="currentChange" style="float:right"></el-pagination>
        </div>


        <el-dialog title="错误信息 (按Esc键关闭)" width="80%" :visible.sync="errorDialogVisible" :modal-append-to-body="false">
            <el-table :data="errorData" width="80%" stripe style="width: 100%">
                <el-table-column prop="create_time"
					width="200"
                    label="创建日期">
                    <template slot-scope="scope">{{scope.row.create_time}}</template>
                </el-table-column>

                <el-table-column
                    prop="tag"
                    width="150"
                    label="错误类型">
                </el-table-column>

                <el-table-column
                    prop="message"
					min-width="300"
                    label="错误信息">
                </el-table-column>
            </el-table>

            <div class="pagination-wrap">
                <el-pagination background layout="total, prev, pager, next" :current-page="current"  @current-change="handleCurrentChange" :total="error_total" :page-size="10"></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { getDashboardData, getBErrorData, getBErrorDetail, getGameInfo, getBlocks } from '../../apis/get'
    import { getOverview, getQufuList } from '../../apis/post'
    import { mapState, mapActions } from 'vuex'
    import gpMixins from '../game-platform.mixins'
    import dateMixins from '../date.mixins'

    export default {
        props: ['menuId', 'elementIds'],
        mixins: [gpMixins, dateMixins],
        data() {
            return {
                searchTypes: [{
                    name: '外网IP',
                    value: 'extranet_ip'
                }, {
                    name: '内网IP',
                    value: 'intranet_ip'
                }],
                tableData: [],
                loading: false,
                platforms: [],
                total_gameserver_error: [],
                total_online: [],
                total_physical_server: [],
                total_running: [],
                total_server: [],
                total_shutdown: [],
                game: 1,
                platform: 0,
                errorDialogVisible: false,
                errorData: [],
				error_total: 0,
				pageMsg: {},
                current: 1,
                pageSIZE: 15,
                currentNum: 1,
                TOTAL: 0,
                zoneForm: {
                    game_id: 0,
                    extranet_ip: '',
                    intranet_ip: '',
                    game_partition_id: '',
                    platform_id: [],
                    game_partition_status: [],
                    game_status: [],
                    section_id: [],
                    range_start: '',
                    range_end: '',
                    opentime_range: []
                },
                games: [],
                platformData: [],
                blocks: []
            }
        },
        computed: {
            ...mapState({
                qfStatus: state => state.qufu.qfStatus
            })
        },
		watch: {
			errorDialogVisible(newValue) {
				if(newValue == false) {
					this.current = 1
				}
            },
            GAME_ID(newv) {
                this.zoneForm.game_id = newv
            }
		},
        created() {
            if(!this.qfStatus.length) {
                this.getQfStatusAndGameStatus()
            }

            setTimeout(_ => {
                this.getDashboardData({game_id: this.GAME_ID})
            }, 100)
        },
        methods: {
            ...mapActions(['getQfStatusAndGameStatus']),
            search() {
                var params = this.zoneForm
                if(params.opentime_range.length) {
                    params.opentime_range = params.opentime_range.map(e =>  this.handleDate(e))
                }
                this.getDashboardData(params)
            },
            toggleAll(value) {
                this.zoneForm.platform_id = value.map(e => e.value)
                if(value.length == 1) {
                    this.platform = value[0].value
                    this.getBlocks()
                } else {
                    this.blocks = []
                }
            },
            toggleAllBlocks(value) {
                this.zoneForm.section_id = value.map(e => e.value)
            },
            toggleAllGameStatus(value) {
                this.zoneForm.game_status = value.map(e => e.value)
            },
            toggleAllQfStatus(value) {
                this.zoneForm.game_partition_status = value.map(e => e.value)
            },
            getBlocks() {
                return getBlocks({platform_id: this.platform}, {menu: this.menuId})
                    .then(json => {
                        if(json.code == 200) {
                            this.blocks = json.result.map(e => {
                                return {
                                    name: e.name,
                                    value: e.id
                                }
                            })

                            this.section_id = json.result.map(e => e.id)
                        }
                    })
            },
            changeGame(v) {
                this.zoneForm.game_id = v
				this.$refs.platform.clear()
                this.platforms = this.handleData(v, this.games, this.platformData)
            },
            getDashboardData(params = {}) {
                getOverview(params, {menu: this.menuId})
                    .then(json => {
                        if(json.code == 200) {
                            this.total_online = json.result.server_online_gamer
                            this.total_physical_server = json.result.server_machine_amount
                            this.total_running = json.result.server_run
                            this.total_server = json.result.server_amount
                            this.total_shutdown = json.result.server_close
                            this.total_gameserver_error = json.result.server_error
                        }
                    })
            },
            showErrors(page) {
                if(page) {
                    this.currentNum = page
                } else {
                    this.currentNum = 1
                }
                // return getBErrorData({
                //     game: this.game,
                //     platform: this.platform,
                //     page: this.currentNum - 1
                // }, { menu: this.menuId })
                // .then(json => {
                //         if(json.code == 200) {
                //             this.tableData = json.result.length ? json.result.map(e => {
                //                 e._platform_id = e.platform.id
                //                 e.platform = e.platform.name
                //                 return e
                //             }) : []

                //             this.TOTAL = json.result_info.max_count
                //         }
                //     })
                const params = Object.assign({request_type: 'error'}, this.zoneForm)
                return getQufuList(params)
                    .then(json => {
                        if(json.code == 200) {
                            this.tableData = json.result.length ? json.result.map(e => {
                                e._platform_id = e.platform_id
                                e.platform = e.platform_id
                                return e
                            }) : []

                            this.TOTAL = json.result_info.total_count
                        }
                    })
			},
			handleCurrentChange(val) {
				this.showErrorModal(this.pageMsg, val-1)
			},

            showErrorModal(scope, page) {
				this.pageMsg = scope
                this.current = page + 1
                
                getBErrorDetail({
                    server: scope.game_partition_id,
					platform_id: scope._platform_id,
                }, { page: page || 1 , menu: this.menuId}).then(json => {
                    if(json.code == 200) {
                        this.errorDialogVisible = true
                        this.errorData = json.result
                        if(json.result_info) {
                            this.error_total = json.result_info.total_count
                        }
                    }
                })
            },
            changePlatform(val) {
                this.platform = val
                var params = { game: this.game }
                if(this.platform != undefined) {
                    params.platform = val
                }
                this.currentNum = 1

                this.getDashboardData(params)
            },
            currentChange(page) {
                this.currentNum = page
                this.showErrors(page)
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
					'block',
					'qf_status',
					'game_status'
				]

				refs.forEach(e => {
					this.$refs[e].clear()
				})
            }
        }
    }
</script>
<style lang="less">
.dashboard-list {
    border: 1px solid #ddd;
    margin-top: 20px;
}
.pagination-top {
    margin-top: 10px;
}

.zd-select-wrap {
    float: right;

    .el-input__inner {
        height: 25px;
        line-height: 27px;
    }
}

.el-table {
    .el-button.is-round {
        padding: 5px 8px!important;
    }
}

.pagination-wrap {
    margin-top: 20px;
    text-align: right;
}
</style>
