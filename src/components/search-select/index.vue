<template>
    <div :class="`search-select ${clazz ? clazz : ''}`" :style="{width: `${width}px`}">
        <el-popover placement="bottom-start"
            popper-class="ss-wrap"
            :visible-arrow="false"
            :width="width"
            trigger="click">
            <div class="search-select-wrap">
                <input class="ss-filter" v-model.trim="filterModal">
                <ul class="ss-list">
                    <li @click="toggleAll($event)"><input @click.stop="toggleAll($event,1)" type="checkbox" :checked="checkedAll" :disabled="!this.listCp.length">选择全部</li>
                    <li v-for="(item, i) in listCp" :key="i" @click="everyChange($event)"><input @click.stop="everyChange($event, 1)" type="checkbox" :checked="item.checked" :value="item.value">{{item.name}}</li>
                </ul>
            </div>
            <div class="search-select-button" slot="reference">{{buttonTxt}}</div>
        </el-popover>
    </div>
</template>
<style lang="less">
.search-select {
    width: 100%;
    text-align: center;
    span {
        display: inline-block;
        width: 100%;
    }
    .search-select-button {
        width: 100%;
        background: #fff;
        border: 1px solid #ccc;
        padding: 8px 0;
        font-size: 12px;
    }
}

body .ss-wrap {
    border-radius: 0;
    margin-top: 0px!important;
    padding: 10px;

    .ss-filter {
        border: 1px solid #ccc;
        margin-bottom: 10px;
        padding: 3px 5px;
        width: 100%;
    }

    .ss-list {
        max-height: 120px;
        overflow-y: scroll;
    }

    input[type="checkbox"] {
        vertical-align: middle;
        margin-right: 5px;
    }

    li {
        margin-bottom: 10px;
        cursor: pointer;
    }
}
</style>

<script>
    export default {
        name: 'searchSelect',
        props: ['clazz', 'data', 'width', 'placeholder', 'type'],
        data() {

            var $this = this
            var lists = $this.data || []
            return {
                buttonTxt: this.placeholder || ' == 请选择 == ',
                checkedList: [],
                filterModal: '',
                lists,
                listCp: [...lists],
                checkedAll: false,
            }
        },
        watch: {
            data: {
                handler(newv) {
                    var lists = newv.map(e=> {
                        if(e.checked == undefined) {
                            e.checked = false
                        }
                        return e
                    })
                    this.lists = lists
                    this.listCp = [...lists]
                },
                deep: true
            },
            filterModal(val) {
                this.inputChange(val)
            }
        },
        methods: {
            toggleAll(e, msg) {
				if(msg) {
					var target = e.target
					target.checked = !target.checked
				} else {
					var target = e.target.querySelector('input')
				}
                if(target.disabled) {
                    return
				}
                if(!target.checked) {
                    this.checkedAll = true
                    this.listCp.forEach(e => e.checked = true)
                    this.lists = [...this.listCp]
                    this.checkedList = [...this.listCp]
                } else {
                    this.listCp.forEach(e => e.checked = false)
                    this.lists = [...this.listCp]
                    this.checkedList = []
                    this.checkedAll = false
                }

                this.buttonTxt = this.checkedList.length ? this.checkedList.map(e => e.name).join(',') : this.placeholder || ' == 请选择 == '
                this.$emit('toggle-all', this.checkedList, this.type)
            },
            inputChange(value) {
                if(!value) {
                    this.listCp = this.lists
                }
                this.listCp = this.lists.filter( el => el.name.indexOf(value) > -1)
            },
            everyChange(e, msg) {
				if(msg) {
					var target = e.target
					target.checked = !target.checked
				} else {
					var target = e.target.querySelector('input')
				}

                var _checked = target.checked
                if(!_checked) {
                    this.lists.forEach(e => {
                        if(e.value == target.value) {
                            e.checked = true
                        }
                    })
                    this.listCp.forEach(e => {
                        if(e.value == target.value) {
                            e.checked = true
                            this.filterPut(e, 'put')
                        }
                    })
                } else {
                    this.lists.forEach(e => {
                        if(e.value == target.value) {
                            e.checked = false
                        }
                    })
                    this.listCp.forEach(e => {
                        if(e.value == target.value) {
                            e.checked = false
                            this.filterPut(e, 'remove')
                        }
                    })
                }

                var filter = this.checkedList.filter(e => e.checked)
                if(filter.length != this.lists.length) {
                    this.checkedAll = false
                } else {
                    this.checkedAll = true
                }
                this.buttonTxt = filter.length == 0 ? this.placeholder || ' == 请选择 == ' : filter.map(e=>e.name).join(',')
                this.$emit('check-handle', filter, this.type)
            },
            filterPut(e, flag) {
                var filter = this.checkedList.filter(el => el.value == e.value)
                if(filter.length) {
                    this.checkedList.forEach(el => {
                        if(el.value == e.value) {
                            el.checked = flag == 'put' ? true : false
                        }
                    })
                } else {
                    e.checked = true
                    this.checkedList.push(e)
                }
            },
            clear() {
                this.checkedList = []
                this.listCp.forEach(e => {
                    e.checked = false
                })
                this.checkedAll = false
                this.buttonTxt = this.placeholder || ' == 请选择 == '
            }
        }
    }
</script>
