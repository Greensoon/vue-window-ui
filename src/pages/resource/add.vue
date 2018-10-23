<template>
    <div class="mu-resource-add">
        <div class="">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedItems" @change="handleCheckedItemsChange">
                <el-checkbox v-for="(item, i) in items" :label="item.operation_name" :value="item.id" :key="i">{{item.operation_name}}</el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
</template>
<script>
    import { getResourceNames } from '../../apis/get'

    export default {
        props: ['resType'],
        data() {
            return {
                checkAll: false,
                checkedItems: [],
                items: [],
                isIndeterminate: false,
                needItems: []
            }
        },
        created() {
            this.getResNames()
        },
        watch: {
            needItems: {
                handler(newv) {
                    var ret = this.items.filter(e => {
                        if(newv[0] && newv[0].operation_name) {
                            return newv.map(e => e.operation_name).indexOf(e.operation_name) > -1
                        } else {
                            return newv.indexOf(e.operation_name) > -1
                        }
                        
                    })
                    this.$emit('get-checked', ret)
                },
                deep: true
            },
            resType(val) {
                this.getResNames()
            }
        },
        methods: {
            handleCheckAllChange(val) {
                this.checkedItems = val ? this.items.map(e => e.operation_name) : []
                this.needItems = val ? this.items : []
                this.isIndeterminate = false
            },
            handleCheckedItemsChange(value) {
                this.needItems = value
                let checkedCount = value.length
                this.checkAll = checkedCount === this.items.length
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.items.length
            },
            getResNames() {
                return getResourceNames({resource_type: this.resType})
                        .then(json => {
                            if(json.code == 200) {
                                this.items = json.result
                            }
                        })
            },
            reset() {
                this.needItems = []
                this.isIndeterminate = false
                this.checkAll = false
                this.checkedItems = []
            }
        }
    }
</script>