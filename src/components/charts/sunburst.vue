<template>
    <div class="mu-chart-sunburst"></div>
</template>
<style lang="less">
.mu-chart-sunburst {
    height: 100%;
}
</style>

<script>
import echarts from 'echarts'

    export default {
        name: 'muSunburst',
        data() {
			var $fc = this.fillColor
			var $dt = this.data
			return {
				fc: $fc,
				dt: $dt
			}
		},
		props: ['data', 'options', 'fillColor', 'nodeEvent'],
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
				if(!this.data.name && !this.data.length) {
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

			    __options.series = __options.series || [{
                    type: 'sunburst',
                    radius: ['15%', '80%'],
                    itemStyle: {
                        color: '#ddd',
                        borderWidth: 2
                    },
	                data: this.dt.length ? this.dt : [this.dt],
	                // radius: [0, '50%'],
                    label: {
                        rotate: 'radial'
                    }
			    }]

				this.option = __options
			}
		}
    }
</script>