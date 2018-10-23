<template>
    <div class="tree-table">
        <table class="tree-table-item">
            <thead>
                <tr >
                    <td>菜单节点</td>
                    <td v-for="(hd, i) in headData"
                        :key="i"
                        :data-id="hd.element_id"
                    >{{hd.element_name}}</td>
                    <td>全选</td>
                </tr>
            </thead>
            <tbody v-html="tpls.join('')"></tbody>
        </table>
        <div class="check-all-wrap">
            <span>全选</span>
            <input type="checkbox" class="tb-check-all">
        </div>
    </div>
</template>
<style lang="less">
.tree-table {
    overflow: auto;
    .tree-table-item {
        border-collapse: collapse;
        width: 100%;
        td {
            border: 1px solid #ccc;
            padding: 5px;
            white-space: nowrap;
            span {
                margin-left: 5px;
                cursor: pointer;
            }
        }

        .checkbox-td {
            text-align: center;
        }
    }

    .check-all-wrap {
        position: absolute;
        right: 0;
        bottom: 5px;
        input {
            vertical-align: middle;
        }
    }
}
.tree-table .tree-table-item .sub-row .menu-col {
    padding-left: 40px;
}

.tree-table .tree-table-item .sub2-row .menu-col {
    padding-left: 60px;
}
.tree-table .tree-table-item .sub3-row .menu-col {
    padding-left: 80px;
}

.tree-table .tree-table-item .menu-col {
    text-align: left;
    padding-left: 20px;
}
.tree-node-close {
    transform: rotate(-90deg);
    transition: all ease-in-all 0.3s;
}
</style>

<script>
    import $ from 'jquery'

    export default {
        name: 'tree-table',
        props: ['tableData', 'headData', 'checkedIds'],
        data() {
            return {
                tpls: [],
                allCheckeds: []
            } 
        },
        watch: {
            checkedIds: {
                handler(newv) {
                    this.getCheckeds(newv)
                },
                deep: true
            }
        },
        created() {
            this.appendRows()
                .then(_ => {
                    this.getCheckeds(this.checkedIds)
                    this.setCheckRows()
                    this.listenInputs()
                    this.listenCheckall()
                    this.toggleTriggle()
                    var _this = this
                    $('.tb-check-all').click(function() {
                        if(this.checked) {
                            $('.checkbox-row').each(function() {
                                this.checked = false    
                                $(this).trigger('click')
                            })
                        } else {
                            $('.checkbox-row').each(function() {
                                this.checked = true    
                                $(this).trigger('click')
                            })
                        }
                    })
                })
        },
        methods: {
            //设置是否已经选择
            getCheckeds(data) {
                var values = []
                data.forEach(e => {
                    var menu_id = e.menu_id
                    var element_ids = e.element_ids
                    element_ids.forEach(el => {
                        values.push(menu_id + '-' + el)
                    })
                })
                
                $(this.$el).find('input[name="elementRow"]').each((i, e) => {
                    var _val = e.value
                    if(values.indexOf(_val) > -1) {
                        e.checked = true
                    }
                })
            },

            //监听行全选的checkbox
            listenCheckRow(target) {
                const inputs = $(target).parent().parent().find('input[name="elementRow"]')
                var arr = []
                if(target.checked) {
                    inputs.each(function() {
                        this.checked = true
                        arr.push(this.value)
                    })
                } else {
                    inputs.each(function() {
                        this.checked = false
                        arr.push(this.value)
                    })
                }
                
                this.$emit('get-rows', target.checked, arr)
            },

            //监听table内所有input事件
            listenInputs() {
                const _this = this
                $('.tree-table-item').click(function(e) {
                    var target = e.target
                    if(target.tagName == 'INPUT') {
                        if(!$(target).hasClass('checkbox-row')) { 
                            //如果不是行全选，执行该方法
                            _this.setCheckRows()
                            _this.$emit('get-checked', target.checked, target.value)
                        } else {
                            //否则执行该方法
                            _this.listenCheckRow(target)
                        }
                        _this.listenCheckall()
                    }
                })
            },

            //监听全选input
            listenCheckall() {
                const checkRows = $('.checkbox-row')
                const filters = checkRows.filter(function(i, e) {return e.checked})
                if(checkRows.length == filters.length) {
                    $('.tb-check-all').get(0).checked = true
                } else {
                    $('.tb-check-all').get(0).checked = false
                }
            },

            //检查该行是否全选，如果全选，最后的勾选
            setCheckRows() {
                $('.check-rows-td').each(function () {
                    const _inputs = $(this).parent().find('.checkbox-td').filter(function() {
                        return !$(this).hasClass('check-rows-td')
                    }).find('input[type="checkbox"]')

                    const _checkeds = _inputs.filter(function() { return this.checked == true })
                    
                    if(_inputs.length == 0) {
                        $(this).find('input').remove()
                    }

                    if(_inputs.length > 0) {
                        if(_inputs.length == _checkeds.length ) {
                            $(this).find('input').get(0).checked = true
                        } else {
                            $(this).find('input').get(0).checked = false
                        }
                    }
                })
            },

            //获取搜有元素的列
            getCols(row) {
                return this.headData.map(col => `
                    <td class="checkbox-td">
                        ${
                            row.element_ids.indexOf(String(col.element_id)) > -1 ? `
                            <input type="checkbox" name="elementRow" value="${row.menu_id + '-' + col.element_id}" />
                            ` : ''
                        }
                    </td>
                `).join('')
            },

            //获取所有的行
            getRows(data, isSub) {
                return data.map(row => `
                    <tr class="${isSub ? 'sub-row' : 'row'} " data-toggle="open" :data-treeId="${row.menu_id}" >
                        <td class="${isSub ? 'menu-col' : ''}">${row.menu_name} ${ row.children && row.children.length ? '<span class="el-icon-caret-bottom" ></span>' : ''}</td>
                        ${
                            this.getCols(row)
                        }
                        <td class="checkbox-td check-rows-td"><input type="checkbox" class="checkbox-row"></td>
                    </tr>
                    ${
                        this.getRows(row.children || [], 'true')
                    }
                `).join('')
            },

            //添加行
            appendRows() {
                return new Promise(resolve => {
                    this.tpls.push(this.getRows(this.tableData))
                    resolve()
                })
            },
            toggleTriggle() {
                const closeCss = {
                    transition: 'all .2s ease-in',
                    transform: 'rotate(-90deg)'
                }

                const openCss = {
                    transition: 'all .2s ease-in',
                    transform: 'rotate(0)'
                }
                $('.el-icon-caret-bottom').click(function() {
                    var $p = $(this).parent().parent()
                    var $sub = $p.nextUntil('.row')
                    var $flag = $p.attr('data-toggle')
                    if($flag == 'open') {
                        $(this).css(closeCss)
                        $p.attr('data-toggle', 'close')
                        $sub.hide()
                    } else {
                        $(this).css(openCss)
                        $p.attr('data-toggle', 'open')
                        $sub.show()
                    }
                })
            }
        }
    }
</script>