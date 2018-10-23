import $ from 'jquery'
require('./jquery.flot.js')
require('./jquery.flot.resize.js')
require('./jquery.flot.stack.js')
require('./jquery.flot.crosshair.js')
require('./jquery.flot.time')
// var Interval = 1000 * 300

import dayjs from 'dayjs'

const computeData = function(data, day) {
    var draw_data_high_yes = []
    var draw_data_high_tod = []
    var draw_data_high_qd = []
    if (data != null && data[0]) {
        for (var i = 0; i < data[0].length; i++) {
            draw_data_high_qd.push([data[0][i] && dayjs(day + ' ' + data[0][i].time).$d.getTime(), data[0][i] ? data[0][i]['sum_online'] : null])
            draw_data_high_yes.push([data[1][i] && dayjs(day + ' ' + data[0][i].time).$d.getTime(), data[1][i] ? data[1][i]['sum_online'] : null])
            draw_data_high_tod.push([data[2][i] && dayjs(day + ' ' + data[0][i].time).$d.getTime(), data[2][i] ? data[2][i]['sum_online'] : null])
        }
        
        const ret = [
            {
                label: day + '在线人数',
                data: draw_data_high_qd
            },
            {
                label: '昨日在线人数',
                data: draw_data_high_yes
            },
            {
                label: '今日在线人数',
                data: draw_data_high_tod
            }
        ]

        return ret
    }
}
const drawLineChartTime = function (dataset, div_flot) {
    var options = {
        series: {
            lines: {
                show: true,
                lineWidth: 1,
                fill: false,
                fillColor: {
                    colors: [
                        {
                            opacity: 0.05
                        },
                        {
                            opacity: 0.01
                        }
                    ]
                }
            },
            points: {
                show: true,
                radius: 1
            },
            shadowSize: 1
        },
        grid: {
            hoverable: true,
            clickable: true,
            tickColor: '#eee',
            borderWidth: 0
        },
        xaxis:{
            mode: 'time',
            tickSize: [1, 'hour'],
            tickFormatter: function(v) {
                var date = new Date(v)
                return date.getHours() + '点'
            },
            axisLabel: 'Time'
        },
        legend: {
            position: 'nw'
        },
        colors: ['#67809f', '#999', '#d12610'],
        yaxis: {
            ticks: 11,
            tickDecimals: 0,
            min:0
        }
    }

    $.plot(div_flot, dataset, options)
}

const tooltip = function() {
    $('<div id=\'tooltip\'></div>').css({
        position: 'absolute',
        display: 'none',
        border: '1px solid #fdd',
        padding: '2px',
        'background-color': '#fee',
        opacity: 0.80
    }).appendTo('body')
}

export default function(data_set, dom, day) {
    tooltip()
    drawLineChartTime(computeData(data_set, day), dom)

    dom.bind('plothover', function (event, pos, item) {
        if (item) {
            var x = item.datapoint[0],
                y = item.datapoint[1]

            $('#tooltip').html(item.series.label + '(' + dayjs(x).format('YYYY-MM-DD HH:mm') + ') = ' + y + '人')
                .css({top: item.pageY+5, left: item.pageX+5})
                .fadeIn(200);
        } else {
            $('#tooltip').hide()
        }
    })
}