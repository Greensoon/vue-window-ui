<template>
	<div class="mu-chart-tree"></div>
</template>
<style lang="less">
	.mu-chart-tree {
		width: 100%;
		height: 100%;
	}
</style>
<script>
	import echarts from 'echarts'
	export default {
		name: 'muTree',
		data() {
			var $fc = this.fillColor
			var $dt = this.data
			return {
				fc: $fc,
				dt: $dt
			}
		},
		props: ['data', 'options', 'fillColor', 'nodeEvent', 'orient'],
		mounted() {
			this.draw()
		},
		watch: {
			data: {
				handler(nv, ov) {
					this.dt = nv
					this.draw()
				},
				deep: true
			},
			fillColor: {
				handler(nv, ov) {
					this.fc = nv
					this.draw()
				}
			}
		},
		methods: {
			init() {
				var _e = echarts.init(this.$el)
				this.echarts = _e
			},
			setOption() {
				this.echarts.setOption(this.option, true)
			},
			draw() {
				if(!this.data.name) {
					return
				}
				this.handleData()

				this.init()
				this.setOption()

				if(this.nodeEvent) {
					this.echarts.on('click', this.nodeEvent)
				}
			},
			handleData() {
				var __options = this.options || {}

				__options.tooltip = __options.tooltip ||
					{
			            trigger: 'item',
			            triggerOn: 'mousemove'
			        }

			    __options.series = __options.series || [{
			    	type: 'tree',
	                data: [this.dt],
	                top: '10%',
	                bottom: '10%',
					layout: this.orient ? '' : 'radial',
					orient: this.orient ? this.orient : '',
	                symbol: 'emptyCircle',
	                symbolSize: 7,
	                initialTreeDepth: 3,
	                animationDurationUpdate: 750
			    }]

				this.option = __options
			}
		}
	}
</script>
