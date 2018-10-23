<template>
	<div class="mu-hard">
		<h5 class="mu-monitor--title">
			基础信息监控
		</h5>
		<div class="mu-monitor-tag">
			<mu-tag :active="tagActive" :title="obj.name" v-for="(obj, i) in tags" :key="i" :value="obj.value" @click="filterData"></mu-tag>

			<div class="mu-monitor-dprange">
				<span class="mu-monitor-dp-text">选择时间范围：</span>
				<span>
					<el-date-picker
						v-model="daterange"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						@change="handleRange"
						:clearable="false"
						:picker-options="pickerOption"
					>
					</el-date-picker>
				</span>
			</div>
		</div>

		<!-- <monitor-panel title="CPU使用率(%)" :desc="desc">
			<mu-chart type="line" :data="chartData" :settings="chartSettings" :legend-visible="false" ref="chart1" ></mu-chart>
		</monitor-panel>

		<monitor-panel title="网络流入带宽(bit/s)" :desc="desc" >
			<mu-chart type="monitor" :data="monitorData" :options="testOption" title="CPU使用率" ref="chart2" :fill-color="fillColor" ></mu-chart>
		</monitor-panel> -->
		<div class="clearfix">
			<h5 class="mu-monitor--title">
				内存/CPU/负载
			</h5>
			<!-- <div class="flex clearfix"> -->
			<monitor-panel title="内存使用率(%)">
				<ve-line :data="memory_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="CPU使用率(%) && 在线人数(人)">
				<ve-line :data="on_merge_data" :settings="merge_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="CPU使用率(%)">
				<ve-line :data="cpu_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="系统平均负载">
				<ve-line :data="load_average_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="总进程数(个)">
				<ve-line :data="process_total_num_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="tcp连接数量(个)">
				<ve-line :data="tcp_total_num_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="Mysql连接数(个)">
				<ve-line :data="mysql_data" :settings="mysql_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>
			<!-- </div> -->

		</div>
		<div class="clearfix">
			<h5 class="mu-monitor--title">
				磁盘监控
			</h5>
			<monitor-panel title="数据盘使用率(%)">
				<ve-line :data="disk_vdb_use_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="系统盘使用率(%)">
				<ve-line :data="disk_vda_use_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="iops(次/s)">
				<ve-line :data="iops_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="磁盘IO写取速率(Bytes/s)">
				<ve-line :data="iops_write_speed_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="磁盘IO读取速率(Bytes/s)">
				<ve-line :data="iops_read_speed_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="数据盘inode使用率(%)">
				<ve-line :data="inode_vdb_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="系统盘inode使用率(%)">
				<ve-line :data="inode_vda_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>
		</div>
		<!-- <monitor-panel title="iops_write_data">
			<ve-line :data="iops_write_data_data" :settings="common_set" :loading="loading"></ve-line>
		</monitor-panel>

		<monitor-panel title="iops_read_data">
			<ve-line :data="iops_read_data_data" :settings="common_set" :loading="loading"></ve-line>
		</monitor-panel> -->
		<div class="clearfix">
			<h5 class="mu-monitor--title">
				网络监控
			</h5>
			<monitor-panel title="发送速度(kb/s)">
				<ve-line :data="send_speed_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>

			<monitor-panel title="接收速度(kb/s)">
				<ve-line :data="received_speed_data" :settings="common_set" :loading="loading" :extend="chartExtend"></ve-line>
			</monitor-panel>
		</div>
	</div>
</template>
<style lang="less">
.mu-monitor-dprange {
    display: inline;
	margin-left: 50px;
	.mu-monitor-dprange {
		font-size: 14px;
	}
}
.mu-monitor-dp-text {
	font-size: 14px;
}
</style>

<script>
	import { getBasicMonitor } from '../../apis/get'
	import dayjs from 'dayjs'
	import { FORMAT, HOUR_FORMAT, MONTH_FORMAT } from './format'

	export default {
		name: 'monitorHard',
		props: ['showRemind', 'serverId', 'menuId'],
		data() {
			var tags = [{
	      		name: '1小时',
	      		value: 1
	      	}, {
	      		name: '6小时',
	      		value: 6
	      	}, {
	      		name: '12小时',
	      		value: 12
	      	}, {
	      		name: '1天',
	      		value: 24
			}, {
				name: '3天',
				value: 3*24
			}, {
				name: '7天',
				value: 7 * 24,
			}, {
				name: '14天',
				value: 14 * 24
			}]
			var $this = this
			return {
				tags,
				tagActive: tags[0].value,
				daterange: '',
				start_time: dayjs().subtract(tags[0].value, 'hour').format(FORMAT),
				end_time: dayjs().format(FORMAT),
				common_set: {
					labelMap: {
						date: '时间',
						min: '最小峰值',
						max: '最大峰值'
					}
				},
				merge_set: {
					labelMap: {
						date: '时间',
						min: '内存最小峰值',
						max: '内存最大峰值',
						max_player: '在线人数最大峰值',
						min_player: '在线人数最小峰值'
					}
				},
				common_data: {
					columns: ['date', 'min', 'max'],
					rows: []
				},
				mysql_set: {
					labelMap: {
						date: '时间'
					}
				},
				mysql_data: {columns: ['date', 'value'], rows: []},
				memory_data: {},
				cpu_data: {},
				disk_vdb_use_data: {},
				disk_vda_use_data: {},
				load_average_data: {},
				process_total_num_data: {},
				tcp_total_num_data: {},
				iops_data: {},
				iops_write_speed_data: {},
				iops_read_speed_data: {},
				iops_write_data_data: {},
				iops_read_data_data: {},
				send_speed_data: {},
				received_speed_data: {},
				inode_vdb_data: {},
				inode_vda_data: {},
				mysql_data: {},
				on_merge_data: {
					columns: ['date', 'max', 'min', 'max_player', 'min_player'],
					rows: []
				},
				loading: true,
				format: HOUR_FORMAT,
				pickerOption: {
					disabledDate(time) {
						var now = new Date().getTime()
						var tl = time.getTime()
						var min = dayjs(now).subtract(30, 'day')
						return tl > now || tl < min
					}
				},
				chartExtend: {
					series(v) {
						v.forEach(e => e.symbolSize = 0)
						return v
					},
					legend(v) {
						v.type = 'scroll'
						v.bottom= 20
						return v
					},
					axisLabel: {
						formatter: function (value, idx) {
							var date = dayjs(value)
							return date.format($this.format)
							// return value
						}
					}
				}
			}
		},
		created() {
			this.desc= [{
				name: '周期',
				value: '60s'
			}, {
				name: '聚合方式',
				value: 'Average'
			}]
			this.getBigData(this.serverId)
		},
		watch: {
			serverId(newv) {
				this.getBigData(newv)
			}
		},
		methods: {
			setStartAndEnd(value) {
				var now = dayjs()
				var _end = now.format(FORMAT)
				var _start = now.subtract(value, 'hour').format(FORMAT)
				if(_start != this.start_time || _end != this.end_time) {
					this.end_time = _end
					this.start_time = _start
					this.daterange = [dayjs(_start).$d, dayjs(_end).$d]
					this.getBigData(this.serverId)
				}
			},
			getBigData(serverId) {
				this.loading = true
				getBasicMonitor({
					server_id: serverId,
					start_time: this.start_time,
					end_time: this.end_time,
					menu: this.menuId
				})
				.then(json => {
					var memories = []
					var cpus = []
					var disk_vdb_use = []
					var disk_vda_use = []
					var load_average = []
					var process_total_num = []
					var tcp_total_num = []
					var iops = []
					var iops_write_speed = []
					var iops_read_speed = []
					var iops_write_data = []
					var iops_read_data = []
					var send_speed = []
					var received_speed = []
					var inode_vdb = []
					var inode_vda = []
					var online_player = []

					var mysql_data = []

					if(json.code == 200) {
						var _data = json.result
						this.loading = false
						if(!json.result.length) {
							return
						}

						_data.forEach(e => {
							var __d = dayjs(e.update_time * 1000).format(FORMAT)
							memories.push({
								date: __d,
								max: e.memory_used[0],
								min: e.memory_used[1]
							})

							cpus.push({
								date: __d,
								max: e.cpu_percent[0],
								min: e.cpu_percent[1]
							})

							disk_vdb_use.push({
								date: __d,
								max: e.disk_vdb_use[0],
								min: e.disk_vdb_use[1]
							})

							disk_vda_use.push({
								date: __d,
								max: e.disk_vda_use[0],
								min: e.disk_vda_use[1]
							})

							load_average.push({
								date: __d,
								max: e.load_average[0],
								min: e.load_average[1]
							})

							process_total_num.push({
								date: __d,
								max: e.process_total_num[0],
								min: e.process_total_num[1]
							})

							tcp_total_num.push({
								date: __d,
								max: e.tcp_total_num[0],
								min: e.tcp_total_num[1]
							})

							iops.push({
								date: __d,
								max: e.iops[0],
								min: e.iops[1]
							})

							iops_write_speed.push({
								date: __d,
								max: e.iops_write_speed[0],
								min: e.iops_write_speed[1]
							})

							iops_read_speed.push({
								date: __d,
								max: e.iops_read_speed[0],
								min: e.iops_read_speed[1]
							})

							iops_write_data.push({
								date: __d,
								max: e.iops_write_data[0],
								min: e.iops_write_data[1]
							})

							iops_read_data.push({
								date: __d,
								max: e.iops_read_data[0],
								min: e.iops_read_data[1]
							})

							send_speed.push({
								date: __d,
								max: e.send_speed[0],
								min: e.send_speed[1]
							})

							received_speed.push({
								date: __d,
								max: e.received_speed[0],
								min: e.received_speed[1]
							})

							inode_vdb.push({
								date: __d,
								max: e.inode_vdb[0],
								min: e.inode_vdb[1]
							})

							inode_vda.push({
								date: __d,
								max: e.inode_vda[0],
								min: e.inode_vda[1]
							})

							online_player.push({
								date: __d,
								max_player: e.total_online[0],
								min_player: e.total_online[1],
								max: e.cpu_percent[0],
								min: e.cpu_percent[1]
							})

							e.mysql_connected.date = __d
							mysql_data.push(e.mysql_connected)

						})

						this.on_merge_data.rows = online_player

						this.memory_data = Object.assign({}, this.common_data)
						this.memory_data.rows = memories

						this.cpu_data = Object.assign({}, this.common_data)
						this.cpu_data.rows = cpus

						this.disk_vdb_use_data = Object.assign({}, this.common_data)
						this.disk_vdb_use_data.rows = disk_vdb_use

						this.disk_vda_use_data = Object.assign({}, this.common_data)
						this.disk_vda_use_data.rows = disk_vda_use

						this.load_average_data = Object.assign({}, this.common_data)
						this.load_average_data.rows = load_average

						this.process_total_num_data = Object.assign({}, this.common_data)
						this.process_total_num_data.rows = process_total_num

						this.tcp_total_num_data = Object.assign({}, this.common_data)
						this.tcp_total_num_data.rows = tcp_total_num

						this.iops_data = Object.assign({}, this.common_data)
						this.iops_data.rows = iops

						this.iops_write_speed_data = Object.assign({}, this.common_data)
						this.iops_write_speed_data.rows = iops_write_speed

						this.iops_read_speed_data = Object.assign({}, this.common_data)
						this.iops_read_speed_data.rows = iops_read_speed

						this.iops_write_data_data = Object.assign({}, this.common_data)
						this.iops_write_data_data.rows = iops_write_data

						this.iops_read_data_data = Object.assign({}, this.common_data)
						this.iops_read_data_data.rows = iops_read_data

						this.send_speed_data = Object.assign({}, this.common_data)
						this.send_speed_data.rows = send_speed

						this.received_speed_data = Object.assign({}, this.common_data)
						this.received_speed_data.rows = received_speed

						this.inode_vdb_data = Object.assign({}, this.common_data)
						this.inode_vdb_data.rows = inode_vdb

						this.inode_vda_data = Object.assign({}, this.common_data)
						this.inode_vda_data.rows = inode_vda

						var _keys = Object.keys(mysql_data[0])
						_keys = _keys.filter(e => e != 'date')
						this.mysql_data.columns = ['date', ..._keys]
						this.mysql_data.rows = mysql_data

					}
				})
			},
			filterData(value) {
				this.tagActive = value
				if(value <= 12) {
					this.format = HOUR_FORMAT
				} else {
					this.format = MONTH_FORMAT
				}
				this.setStartAndEnd(value)
			},
			changeColor(e, value) {
				this.fillColor = value
			},
			handleRange(value) {
				var _start_time = dayjs(value[0]).format(FORMAT)
				var _end_time = dayjs(value[1]).format(FORMAT)
				if(_start_time != this.start_time || _end_time != this.end_time) {
					this.start_time = _start_time
					this.end_time = _end_time
					this.getBigData(this.serverId)
				}
			}
		}
	}
</script>
