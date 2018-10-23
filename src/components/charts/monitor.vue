<template>
	<div class="mu-chart-monitor"></div>
</template>

<script>
	import echarts from 'echarts'
	import excelDL from 'utils/excel'

	export default {
		name: 'muMonitor',
		data() {
			var $fc = this.fillColor
			var $data = this.data
			return {
				fc: $fc,
				dt: $data
			}
		},
		props: ['data', 'options', 'title', 'subTitle', 'titlePosition', 'fillColor', 'areaStyle', 'asArea'],
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
				if(!this.data.xData) {
					return
				}

				this.handleData()

				this.init()
				this.setOption()
			},
			handleData() {
				var __options = this.options || {}

				/*
				 * title
				*/
				try {
					var _title = {}
					var _title_text = __options.title || ''
					var _title_subtext= __options.subtitle || ''

					_title.text = this.title || _title_text
					_title.subtext = this.subTitle || _title_subtext
					_title.x = this.titlePosition || 'center'

					__options.title = _title
				} catch(e) {
					console.error('chart title error')
					console.log(e)
				}

				/*
				 * tooltip
				 */


				try {
					var _defaultTTP = {
				        trigger: 'axis',
				        position: function (pt) {
				            return [pt[0], '10%']
				        }
				    }
					var _tooltip = __options.tooltip || _defaultTTP
					__options.tooltip = _tooltip
				} catch(e) {
					console.error(' chart tooltip error')
					console.log(e)
				}

				/*
				 * toolbox
				 */
				try {
					var _toolbox = __options.toolbox || {}

					_toolbox.show = true
					_toolbox.feature = _toolbox.feature || {}

					//always show saveImage and dataView
					// _toolbox.feature.saveAsImage = {
					// 	title: '保存'
					// }
					var $this = this
					_toolbox.feature. mySaveTool= {
						show: true,
						title: '下载Excel',
						icon: 'image://https://www.easyicon.net/api/resizeApi.php?id=1205415&size=48',
						onclick: function () {
							var $_d = []
							var $xd = $this.data.xData[0].data
							var $yd = $this.data.yData[0].data
							for(var i=0; i< $xd.length; i++) {
								$_d.push([$xd[i], $yd[i]])
							}

							return false
							excelDL('我的数据.xlsx', '数据', $_d)
						}
					}
					_toolbox.feature.dataView = {}

					__options.dataView && (_toolbox.feature.dataView.optionToContent = __options.dataView)

					__options.toolbox = _toolbox
				} catch(e) {
					console.error('chart toolbox error ', e)
				}

				/*
				 * dataZoom
				 */
				try {
					var _defaultDZ = [{
				        type: 'inside',
				        start: 0,
				        end: 10
				    }, {
				        start: 0,
				        end: 10,
				        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				        handleSize: '80%',
				        handleStyle: {
				            color: '#fff',
				            shadowBlur: 3,
				            shadowColor: 'rgba(0, 0, 0, 0.6)',
				            shadowOffsetX: 2,
				            shadowOffsetY: 2
				        }
				    }];

					var _dataZoom = __options.dataZoom || _defaultDZ
					if(__options.showDZ || __options.dataZoom) {
						__options.dataZoom = _dataZoom
					}
				} catch (e) {
					console.error('chart dataZoom error ', e)
				}

				/*data*/
				try {
					var _data = this.dt || {}

					var _xAxis = __options.xAxis || {}
					var _yAxis = __options.yAxis || {}
					_xAxis.title = _data.xData[0].title
					_xAxis.data = _data.xData[0].data || _xAxis.data || []
					_yAxis.data = _data.yData || _yAxis.data || []

					__options.xAxis = _xAxis
					__options.yAxis = _yAxis
				} catch (e) {
					console.error('chart data handle error ', e)
				}



				/*
				 * series
				 */

				try {
					var _series = __options.series || []
					var fc = this.fc
					var _defaultSer = {
			            type:'line',
			            smooth:true,
			            symbol: 'none',
			            sampling: 'average',
			            itemStyle: {
			                normal: {
			                    color: fc || '#438438'
			                }
			            }
			        }
			        var _asDefault = {
		                normal: {
		                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		                        offset: 0,
		                        color: 'rgb(255, 158, 68)'
		                    }, {
		                        offset: 1,
		                        color: 'rgb(255, 70, 131)'
		                    }])
		                }
		            }
			        var _areaStyle = this.areaStyle || _asDefault
			        var _asArea = this.asArea

			        if(!_series.length) {
			        	__options.yAxis.data.forEach((e) => {
			        		var _serObj = Object.assign({}, _defaultSer)
			        		_serObj.name = e.name
			        		_serObj.data = e.data

			        		if(_asArea == true) {
			        			_serObj.areaStyle = _areaStyle
			        		}

			        		_series.push(_serObj)
			        	})
			        }

			        __options.series = _series
				} catch (e) {
					console.error('chart monitor y data failed ', e)
				}

				this.option = __options
			}
		}
	}
</script>
