<template>
    <div class="mu-chart-line--notsmooth"></div>
</template>
<script>
    import echarts from 'echarts'

    export default {
        name: 'muLine',
        data() {
			var $fc = this.fillColor
			var $dt = this.data
			return {
				fc: $fc,
				dt: $dt
			}
		},
		props: ['data', 'options', 'fillColor'],
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

			},
			handleData() {
				var __options = this.options || {}

			    __options.series = __options.series || [{
                    type: 'line',
                    itemStyle: {
                        color: '#ddd',
                        borderWidth: 2
                    },
                    smooth: false,
	                data: this.dt.length ? this.dt : [this.dt]
                }]
				this.option = __options
			}
		}
    }
</script>
