<template>
    <div class="online-player">
        <div >
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="游戏">
                    <el-select @change="changeGame" v-model="formInline.game_id" placeholder="游戏">
                        <el-option v-for="(p, i) in games" :key="i" :label="p.cname" :value="p.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="平台">
                    <el-select @change="changePlatform" v-model="formInline.platform_id" placeholder="平台" filterable>
                        <el-option v-for="(p, i) in pss" :key="i" :label="p.name" :value="p.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="区服">
                    <el-select @change="changeSection" v-model="formInline.game_partition_id" placeholder="区服" filterable>
                        <el-option v-for="(p, i) in sections" :key="i" :label="p.name" :value="p.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="时间">
                    <el-date-picker
                        @change="changeTime"
                        v-model="formInline.time"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>

        <div>
            <el-tabs type="border-card" v-model="timeTab" @tab-click="changeType">
                <el-tab-pane label="日" name="day">
                    <div id="dayChart" :style="{minHeight: '300px'}"></div>
                </el-tab-pane>
                <el-tab-pane label="月" name="month">
                    <ve-histogram :extend="extendConfig" :data="monthChartData" ref="chart_month"></ve-histogram>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import gpMixins from '../game-platform.mixins'
    import { list } from '../sections/api'
    import { onlineCount } from '../../apis/post'
    // const dayX = Array.from(Array(24)).map((e, i) => i + '点')
    import dayjs from 'dayjs'
    const monthX = Array.from(Array(dayjs().daysInMonth())).map((e, i) => i + 1)
    import draw from '../../lib/flot'
    import $ from 'jquery'

    export default {
        mixins: [gpMixins],
        props: ['menuId', 'elementIds'],
        data() {
            this.extendConfig = {
                xAxis: [{
                    axisLabel: {
                        rotate: 90
                    }
                }]
            }
            return {
                formInline: {
                    game_id: 1,
                    platform_id: '',
                    game_partition_id: '',
                    time: dayjs().subtract(2, 'day')
                },
                pss: [],
                sections: [{name: '全部', id: ''}],
                timeTab: 'day',
                monthChartData: {
                    columns: [],
                    rows: []
                }
            }
        },
        created() {
            this.getData()
        },
        methods: {
            changeGame() {
                const _tmp = this.handleData(this.formInline.game_id, this.games, this.platformData)
                if(_tmp.length) {
                    this.platforms = [..._tmp]
                } else {
                    this.platforms = []
                }
            },
            changePlatform() {
                list({
                    game_id: this.formInline.game_id,
                    platform_id: this.formInline.platform_id
                }, { menu: this.menuId })
                .then(json => {
                    if(json.code == 200) {
                        this.sections = json.result
                    }
                })
            },
            getData() {
                return onlineCount({
                    game_id: this.formInline.game_id,
                    platform_id: this.formInline.platform_id || 0,
                    game_partition_id: this.formInline.game_partition_id || 0,
                    time: this.formInline.time,
                    time_type: this.timeTab
                }, { menu: this.menuId })
                .then(json => {
                    if(json.code == 200) {
                        if(this.timeTab == 'day') {
                            draw( [json.result.the_time_data, json.result.yester_data, json.result.today_data], $('#dayChart'), dayjs(this.formInline.time).format('YYYY-MM-DD'))
                        }

                        if(this.timeTab == 'month' && json.result.length) {
                            this.renderHistogram(json.result)
                        }
                    }
                })
            },
            changeSection() {
                this.getData()
            },
            changeTime() {
                this.getData()
            },
            changeType() {
                this.getData()
            },
            renderHistogram(data) {
                this.monthChartData.columns = ['date', 'value']
                const month = dayjs().format('YYYY-MM')

                this.monthChartData.rows = monthX.map(e => {
                    return {
                        date: month + '-' + e,
                        value: data.filter(el => Number(e) == Number(el.time.split('-')[2]))[0] ? data.filter(el => Number(e) == Number(el.time.split('-')[2]))[0].most_online : null
                    }
                })
            },
            hideTooltip() {
                if($('#tooltip').length) {
                    $('#tooltip').hide()
                }
            }
        },
        watch: {
            timeTab (v) {
                this.$nextTick(_ => {
                    this.$refs[`chart_${v}`] && this.$refs[`chart_${v}`].echarts && this.$refs[`chart_${v}`].echarts.resize()
                })

                this.hideTooltip()
            },
            platforms(newv) {
                this.pss = [{name: '全部', value: ''}, ...newv]
            }
        },
        beforeDestroy() {
            this.hideTooltip()
        }
    }
</script>

<style lang="less">
#tooltip {
    z-index: 20;
}
</style>

