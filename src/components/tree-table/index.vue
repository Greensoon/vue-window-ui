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
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, i) in tableData" :key="i" class="row" data-toggle="open" :data-treeId="row.menu_id" >
                    <td class="menu-col">{{row.menu_name}}<span class="el-icon-caret-bottom" v-if="row.children && row.children.length"></span></td>
                    <td v-for="(col, j) in headData" :key="j"><input type="checkbox" name="elementRow" :value="row.menu_id + '-' + col.element_id" /></td>
                    <td v-if="row.children &&row.children.length" style="display:none">
                        <tr v-for="(l1, k) in row.children" class="sub-row" data-toggle="open" :key="k" :data-treeId="row.menu_id + '-' + l1.menu_id">
                            <td class="menu-col">{{l1.menu_name}}<span class="el-icon-caret-bottom" v-if="l1.children && l1.children.length"></span></td>
                            <td v-for="(col1, j1) in headData" :key="j1"><input type="checkbox" name="elementRow" :value="l1.menu_id + '-' + col1.element_id" /></td>
                            <td v-if="l1.children &&l1.children.length">
                                <tr v-for="(l2, k1) in l1.children" class="sub2-row" data-toggle="open" :key="k1" :data-treeId="row.menu_id + '-' + l1.menu_id + '-' + l2.menu_id">
                                    <td class="menu-col">{{l2.menu_name}}<span class="el-icon-caret-bottom" v-if="l2.children && l2.children.length"></span></td>
                                    <td v-for="(col2, j2) in headData" :key="j2"><input type="checkbox" name="elementRow" :value="l2.menu_id + '-' + col2.element_id" /></td>
                                    <td v-if="l2.children &&l2.children.length">
                                        <tr v-for="(l3, k2) in l2.children" class="sub3-row" data-toggle="open" :key="k2" :data-treeId="row.menu_id + '-' + l1.menu_id + '-' + l2.menu_id + '-' + l3.data.data.menu_id">
                                            <td class="menu-col">{{l3.menu_name}}<span class="el-icon-caret-bottom" v-if="l3.children && l3.children.length"></span></td>
                                            <td v-for="(col3, j3) in headData" :key="j3"><input type="checkbox" name="elementRow" :value="l3.data.data.menu_id + '-' + col3.element_id" /></td>
                                        </tr>
                                    </td>
                                </tr>
                            </td>
                        </tr>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
</template>
<style lang="less">
.tree-table {
    .tree-table-item {
        border-collapse: collapse;
        width: 100%;
        td {
            border: 1px solid #ccc;
            padding: 5px;
            text-align: center;
            span {
                margin-left: 5px;
                cursor: pointer;
            }
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
        watch: {
            checkedIds: {
                handler(newv) {
                    this.setCheckeds(newv)
                },
                deep: true
            }
        },
        created() {
            this.appendRows()
            this.setCheckeds(this.checkedIds)
        },
        methods: {
            setCheckeds(data) {
                var values = []
                data.forEach(e => {
                    var menu_id = e.menu_id
                    var element_ids = e.element_ids
                    element_ids.forEach(el => {
                        values.push(menu_id + '-' + el)
                    })
                })
                var $this = this
                setTimeout(function() {
                    $($this.$el).find('input[name="elementRow"]').each((i, e) => {
                        var _val = e.value
                        if(values.indexOf(_val) > -1) {
                            e.checked = true
                        }
                    })
                })
            },

            appendRows() {
                var $this = this
                setTimeout(function() {
                    var $rows = $($this.$el).find('td').find('tr')
                    $rows.each(function(i, e) {
                        var $treeId = $(e).data('treeid')
                        $treeId = $treeId.split('-')

                        if($treeId.length == 2) {
                            var l1 = $($this.$el).find('tbody tr')
                            l1.each(function(ii, el) {
                                if($(el).data('treeid') == $treeId[0]) {
                                    var cp = $(e).clone()
                                    if(cp.find('.el-icon-caret-bottom').length> 0) {
                                        cp.children('td').last().remove()
                                    }

                                    cp.insertAfter(el)
                                }
                            })
                        }

                        if($treeId.length == 3) {
                            var l2 = $($this.$el).find('.sub-row')
                            l2.each(function(ii, el) {
                                if($(el).data('treeid') == ($treeId[0] + '-' + $treeId[1])) {
                                    var cp = $(e).clone()
                                    if(cp.find('.el-icon-caret-bottom').length> 0) {
                                        cp.children('td').last().remove()
                                    }
                                    cp.insertAfter(el)
                                }
                            })
                        }

                        if($treeId.length == 4) {
                            var l3 = $($this.$el).find('.sub2-row')
                            l3.each(function(ii, el) {
                                if($(el).data('treeid') == ($treeId[0] + '-' + $treeId[1] + '-' + $treeId[2])) {
                                    var cp = $(e).clone()
                                    if(cp.find('.el-icon-caret-bottom').length> 0) {
                                        cp.children('td').last().remove()
                                    }
                                    cp.insertAfter(el)
                                }
                            })
                        }

                        if($treeId.length == 5) {
                            var l4 = $($this.$el).find('.sub3-row')
                            l4.each(function(ii, el) {
                                if($(el).data('treeid') == ($treeId[0] + '-' + $treeId[1] + '-' + $treeId[2] + '-' + $treeId[3])) {
                                    var cp = $(e).clone()
                                    if(cp.find('.el-icon-caret-bottom').length> 0) {
                                        cp.children('td').last().remove()
                                    }
                                    cp.insertAfter(el)
                                }
                            })
                        }
                    })

                    $('.tree-table-item .row').each(function(i,e) {
                        $(e).children('td:hidden').last().remove()
                    })

                    $('.el-icon-caret-bottom').click(function(e) {
                        var $t = $(e.target)
                        var $p = $t.parent().parent()
                        var $idx = $p.index()
                        var $treeId = $p.data('treeid')
                        var $toggle= $p.data('toggle')
                        $($this.$el).find('.tree-table-item tr:gt(' + ($idx + 1) + ')').each(function(i, el) {
                            var _treeId = $(el).data('treeid')

                            if(String(_treeId).indexOf($treeId) == 0) {
                                if($toggle == 'open') {
                                    $(el).hide()
                                    $p.data('toggle', 'close')
                                    $t.addClass('tree-node-close')
                                } else {
                                    $(el).show()
                                    $p.data('toggle', 'open')
                                    $t.removeClass('tree-node-close')
                                }
                            }
                        })

                    })

                    $($this.$el).find('input[name="elementRow"]').change(function(e) {
                        $this.$emit('get-checked', e.target.checked, $(this).val())
                    })
                })
            },

            checkAll() {
                var inputs = $(this.$el).find('input[name="elementRow"]')
                var vals= []
                inputs.each(function() {
                    this.checked = true
                    vals.push($(this).val())
                })
                this.$emit('check-all', vals)
            },
            clearAll() {
                var inputs = $(this.$el).find('input[name="elementRow"]')
                var vals = []
                inputs.each(function() {
                    this.checked = false
                    vals.push($(this).val())
                })
                this.$emit('clear-all', vals)
            }
        }
    }
</script>
