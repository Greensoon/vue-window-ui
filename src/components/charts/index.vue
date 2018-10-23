<template>
	<ve-line :extend="extend" :data="data" :toolbox="tlbox" :settings="options" v-if="vetype == 'line' " :legend-visible="legendVisible" legend-position="bottom" :loading="loading" :series="series"></ve-line>
	<ve-histogram :extend="extend" :data="data" :toolbox="tlbox" :settings="options" v-else-if="vetype == 'zhu' " :legend-visible="legendVisible" legend-position="bottom" :loading="loading" :series="series"></ve-histogram>
	<ve-bar :extend="extend" :data="data" :toolbox="tlbox" :settings="options" v-else-if="vetype == 'bar' " :legend-visible="legendVisible" legend-position="bottom" :loading="loading" :series="series"></ve-bar>
	<ve-pie :extend="extend" :data="data" :toolbox="tlbox" :settings="options" v-else-if="vetype == 'pie' " :legend-visible="legendVisible" legend-position="bottom" :loading="loading" :series="series"></ve-pie>
	<ve-pie :extend="extend" :data="data" :toolbox="tlbox" :settings="options" v-else-if="vetype == 'ring' " :legend-visible="legendVisible" legend-position="bottom" :loading="loading" :series="series"></ve-pie>
	<ve-radar :extend="extend" :data="data" :toolbox="tlbox" :settings="options" v-else-if="vetype == 'radar'" :series="series" legend-position="bottom"></ve-radar>
	<ve-map :extend="extend" :data="data" :toolbox="tlbox" :settings="options" v-else-if="vetype == 'map'" :series="series" legend-position="bottom"></ve-map>
	<mu-monitor :extend="extend" :data="data" :options="options" :title="title" :sub-title="subTitle" v-else-if="vetype == 'monitor' " :fill-color="fillColor" :area-style="areaStyle" :as-area="asArea" :loading="loading"></mu-monitor>
	<mu-tree :extend="extend" :data="data" :options="options || {}" v-else-if="vetype == 'tree' " :loading="loading" :node-event="nodeEvent" :orient="orient"></mu-tree>
	<mu-line :extend="extend" :data="data" :options="options || {}" v-else-if="vetype == 'zheline' "></mu-line>
	<mu-sunburst :extend="extend" :data="data" :options="options || {}" v-else-if="vetype == 'sunburst' " :loading="loading" :node-event="nodeEvent" ></mu-sunburst>
</template>
<script>
	import 'echarts/lib/component/toolbox'
	// import excelDL from 'utils/excel'

	export default {
		name: 'muChart',
		data() {
			var $tlbox = this.toolbox
			return {
				tlbox: $tlbox
			}
		},
		computed: {
			vetype() {
				return this.type || 'line'
			}
		},
		props: ['type', 'data', 'toolbox', 'options', 'title', 'legendPosition', 'legendVisible', 'subTitle', 'fillColor', 'areaStyle', 'asArea', 'loading', 'nodeEvent', 'orient', 'series', 'extend'],
		created() {
			var $this = this
			this.tlbox = {
				show: true,
				feature: {
					// saveAsImage: {},
					mySaveTool: {
						show: true,
						title: '下载Excel',
						icon: 'image://https://www.easyicon.net/api/resizeApi.php?id=1205415&size=48',
						onclick: function () {

							var $_d = []
							var $xd = $this.data.columns
							var $yd = $this.data.rows
							
							// for(var i=0; i< $yd.length; i++) {
							// 	$_d.push([$xd[i], $yd[i]])
							// }
							$_d.push($xd)
							$yd.forEach((e, i) => {
								var $tmp = []
								$xd.forEach((el, idx) => {
									$tmp.push(e[el])
								})
								$_d.push($tmp)
							})

							// console.log($_d)

							// console.log($_d)
							// return false
							// excelDL('我的数据.xlsx', '数据', $_d)
						}
					}
				}
			}
		},
		mounted() {
			this.echarts = this.$children[0].echarts
		}
	}
</script>

