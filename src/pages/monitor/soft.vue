<template>
	<div class="mu-monitor-soft">
		<h5 class="mu-monitor--title">
			应用监控
		</h5>
		<div class="mu-monitor-tag">
			<mu-tag :active="tagActive" :title="obj.name" v-for="(obj, i) in tags" :key="i" :value="obj.value" @click="filterData(obj.value)"></mu-tag>

			<div class="mu-monitor-dprange">
				<span class="mu-monitor-dp-text">选择时间范围：</span>
				<span>
					<el-date-picker
						v-model="daterange"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						@change="handleChange"
						:clearable="false"
						:picker-options="pickerOption"
					>
					</el-date-picker>
				</span>
			</div>
		</div>
		<div class="clearfix">
			<monitor-panel title="内存使用率(%)">
				<mu-chart :data="memory_data" :options="common_set" :loading="loading" :extend="chartExtend"></mu-chart>
			</monitor-panel>

			<monitor-panel title="在线人数(人)">
				<mu-chart :data="online" :options="common_set" :loading="loading" :extend="chartExtend"></mu-chart>
			</monitor-panel>

			<monitor-panel title="CPU使用率(%)">
				<mu-chart :data="cpu_data" :options="common_set" :loading="loading" :extend="chartExtend"></mu-chart>
			</monitor-panel>

			<monitor-panel title="发送速度(kb/s)">
				<mu-chart :data="send_speed_data" :options="common_set" :loading="loading" :extend="chartExtend"></mu-chart>
			</monitor-panel>

			<monitor-panel title="接收速度(kb/s)">
				<mu-chart :data="received_speed_data" :options="common_set" :loading="loading" :extend="chartExtend"></mu-chart>
			</monitor-panel>
		</div>

		<div class="clearfix">
			<h5 class="mu-monitor--title">
				EXT
			</h5>
			<monitor-panel title="内存使用率(%)">
				<mu-chart :data="ext_memory_data" :options="common_set" :loading="loading" :extend="chartExtend"></mu-chart>
			</monitor-panel>

			<monitor-panel title="CPU使用率(%)">
				<mu-chart :data="ext_cpu_data" :options="common_set" :loading="loading" :extend="chartExtend"></mu-chart>
			</monitor-panel>

			<monitor-panel title="发送速度(kb/s)">
				<mu-chart :data="ext_send_speed_data" :options="common_set" :loading="loading" :extend="chartExtend"></mu-chart>
			</monitor-panel>

			<monitor-panel title="接收速度(kb/s)">
				<mu-chart :data="ext_received_speed_data" :options="common_set" :loading="loading" :extend="chartExtend"></mu-chart>
			</monitor-panel>
		</div>

		<div class="fixed monitor-wrap-wrap">
			<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			<el-checkbox-group v-model="checkedGroup" @change="handleCheckedChange">
				<el-checkbox v-for="item in filters" :label="item" :key="item">{{item}}</el-checkbox>
			</el-checkbox-group>
		</div>
	</div>
</template>
<style lang="less">
.mu-monitor-tag {
	margin-bottom: 20px;
}

.mu-monitor-soft {
	transform: initial;
	position: relative;
}

.fixed.monitor-wrap-wrap {
    position: fixed;
    z-index: 999;
    top: 400px;
	right: 100px;
	width: 140px;
    padding: 20px;
    background: #eee;

	.el-checkbox+.el-checkbox {
		margin-left: 0;
	}
}
</style>

<script>
	import dayjs from 'dayjs'
	import { getAppMonitor } from '../../apis/get'
	import { FORMAT, HOUR_FORMAT, MONTH_FORMAT } from './format'

	export default {
		props: ['serverId', 'menuId'],
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
				isIndeterminate: false,
				checkAll: true,
				checkedGroup: [],
				tags,
				tagActive: tags[0].value,
				daterange: '',
				start_time: dayjs().subtract(tags[0].value, 'hour').format(FORMAT),
				end_time: dayjs().format(FORMAT),
				memory_data: {},
				cpu_data: {},
				send_speed_data: {},
				received_speed_data: {},
				online: {},
				common_data: {
					columns: ['date'],
					rows: []
				},
				common_set: {
					dimension: ['date'],
					labelMap: {
						date: '日期',
						data: '数据'
					}
				},
				filters: [],
				chooseAll: false,
				ext_memory_data: {},
				ext_cpu_data: {},
				ext_send_speed_data: {},
				ext_received_speed_data: {},
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
						}
					}
				}
			}
		},
		watch: {
			serverId(newv) {
				this.getBigData(newv)
			}
		},
		methods:{
			handleCheckAllChange(val) {
				this.checkedGroup = val ? this.filters : [];
				this.isIndeterminate = false;
				this.handleMonitorDatas(this.checkedGroup)
			},
			handleCheckedChange(val) {
				let checkedCount = val.length
				this.checkAll = checkedCount === this.filters.length
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.filters.length
				this.handleMonitorDatas(val)
			},
			filterData(value) {
				this.tagActive = value
				if(value <24) {
					this.format = HOUR_FORMAT
				} else {
					this.format = MONTH_FORMAT
				}
				this.setStartAndEnd(value)
			},
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
				getAppMonitor({
					server_id: serverId,
					start_time: this.start_time,
					end_time: this.end_time,
					menu: this.menuId
				})
				.then(json => {
					if(json.code == 200) {
						this.loading = false
						var _data = {}

						if(json.result.length) {
							json.result.forEach(e => {
								var __d = dayjs(e.update_time * 1000).format(FORMAT)
								_data[e.platform + '-' + e.game_id] = _data[e.platform + '-' +  e.game_id] || {}

								this.hd1('memory', _data[e.platform + '-' + e.game_id], e.game_memory, __d)
								this.hd1('cpus', _data[e.platform + '-' + e.game_id], e.game_cpu, __d)
								this.hd1('send_speed', _data[e.platform + '-' + e.game_id], e.game_send_speed, __d)
								this.hd1('received_speed', _data[e.platform + '-' + e.game_id], e.game_received_speed, __d)
								this.hd1('ext_memory', _data[e.platform + '-' + e.game_id], e.ext_memory, __d)
								this.hd1('ext_cpu', _data[e.platform + '-' + e.game_id], e.ext_cpu, __d)
								this.hd1('ext_send_speed', _data[e.platform + '-' + e.game_id], e.ext_send_speed, __d)
								this.hd1('ext_received_speed', _data[e.platform + '-' + e.game_id], e.ext_received_speed, __d)
								this.hd1('online', _data[e.platform + '-' + e.game_id], e.online, __d)
							})

							this.handleData(_data)
						}

					}
				})
			},
			handleMonitorDatas(vals) {
				var fn = function(dd) {
					dd.columns = ['date'].concat(vals)
				}

				fn(this.cpu_data)
				fn(this.memory_data)
				fn(this.send_speed_data)
				fn(this.received_speed_data)
				fn(this.ext_memory_data)
				fn(this.ext_cpu_data)
				fn(this.ext_send_speed_data)
				fn(this.ext_received_speed_data)
				fn(this.online)
			},
			hd1(key, obj, val, __d) {
				obj[key] = obj[key] || []
				obj[key].push({
					date: __d,
					data: val,
				})
			},
			handleChange(value) {
				this.loading = true
				var _start_time = dayjs(value[0]).format(FORMAT)
				var _end_time = dayjs(value[1]).format(FORMAT)
				if(_start_time != this.start_time || _end_time != this.end_time) {
					this.start_time = _start_time
					this.end_time = _end_time
					this.getBigData(this.serverId)
				}
			},
			hd2(_keys, key, _data, data) {
				var __ret = []
				_data.forEach((e, i) => {
					var _temp = {}
					_keys.forEach((el, idx) => {
						_temp.date = e.date
						_temp[el] = data[el][key][i] && data[el][key][i].data
					})
					__ret.push(_temp)
				})

				return __ret
			},
			handleData(data) {
				var _keys = Object.keys(data)
				this.common_data.columns = [this.common_data.columns[0], ..._keys]
				this.filters = this.common_data.columns.slice(1)
				this.checkedGroup = this.filters
				this.cpu_data = Object.assign({}, this.common_data)
				this.cpu_data.rows = this.hd2(_keys, 'cpus', data[_keys[0]].cpus, data)

				this.memory_data = Object.assign({}, this.common_data)
				this.memory_data.rows = this.hd2(_keys, 'memory', data[_keys[0]].memory, data)

				this.send_speed_data = Object.assign({}, this.common_data)
				this.send_speed_data.rows = this.hd2(_keys, 'send_speed', data[_keys[0]].send_speed, data)

				this.received_speed_data = Object.assign({}, this.common_data)
				this.received_speed_data.rows = this.hd2(_keys, 'received_speed', data[_keys[0]].received_speed, data)

				this.ext_memory_data = Object.assign({}, this.common_data)
				this.ext_memory_data.rows = this.hd2(_keys, 'ext_memory', data[_keys[0]].ext_memory, data)

				this.ext_cpu_data = Object.assign({}, this.common_data)
				this.ext_cpu_data.rows = this.hd2(_keys, 'ext_cpu', data[_keys[0]].ext_cpu, data)

				this.ext_send_speed_data = Object.assign({}, this.common_data)
				this.ext_send_speed_data.rows = this.hd2(_keys, 'ext_send_speed', data[_keys[0]].ext_send_speed, data)

				this.ext_received_speed_data = Object.assign({}, this.common_data)
				this.ext_received_speed_data.rows = this.hd2(_keys, 'ext_received_speed', data[_keys[0]].ext_received_speed, data)

				this.online = Object.assign({}, this.common_data)
				this.online.rows = this.hd2(_keys, 'online', data[_keys[0]].online, data)
			}
		},

		created() {
			this.getBigData(this.serverId)
		}
	}
</script>
