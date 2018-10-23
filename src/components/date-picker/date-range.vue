<template>
    <div class="mu-daterange">
        <i class="el-icon-date"></i>
        <input :class="`mu-daterange-input ${startHook}`" :placeholder="startPlaceholder || '开始日期'">
        <span class="mu-daterange-label">{{rangeSeparator || '-'}}</span>
        <input :class="`mu-daterange-input ${endHook}`" :placeholder="endPlaceholder || '结束日期'" />
    </div>
</template>
<style lang="less">
.mu-daterange-input {
    width: 80px;
}

.mu-daterange-mobile-wrap {
    display: none;
}
</style>

<script>
    import Picker from 'pickerjs/dist/picker.min'
    // import 'vant/lib/vant-css/picker.css'
    export default {
        props: ['startPlaceholder', 'endPlaceholder', 'rangeSeparator'],
        data() {
            return {
                startHook: `mu-daterange-start_${new Date().getTime()}`,
                endHook: `mu-daterange-end_${new Date().getTime()}`,
                startDate: new Date(),
                endDate: new Date(),
                daterangeModel: new Date()
            }
        },
        mounted() {
            this.initStart()
            this.initEnd()
        },
        methods: {
            initStart() {
                const startConfig = {
                    format: 'YYYY-MM-DD',
                    text: {
                        title: '开始日期',
                        confirm: '确定',
                        cancel: '取消'
                    }
                }
                this.startPicker = new Picker(document.querySelector(`.${this.startHook}`), startConfig)
            },
            initEnd() {
                const endConfig = {
                    format: 'YYYY-MM-DD',
                    text: {
                        title: '结束日期',
                        confirm: '确定',
                        cancel: '取消'
                    }
                }
                this.endPicker = new Picker(document.querySelector(`.${this.endHook}`), endConfig)
            }
            
        }
    }
</script>
