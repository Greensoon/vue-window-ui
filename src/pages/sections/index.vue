<template>
    <div class="mu-section">
        <el-tabs type="border-card" v-model="activeTab">
            <el-tab-pane label="分区管理" name="one">
                <list :menu-id="menuId"
                    :element-ids="elementIds" >
                </list>
            </el-tab-pane>
            <el-tab-pane label="分区迁移" name="two">
                <move :menu-id="menuId"
                    :element-ids="elementIds" >
                </move>
            </el-tab-pane>
            <el-tab-pane label="迁移操作日志" name="three">
                <log-list :menu-id="menuId"
                    :element-ids="elementIds"
					:active="activeTab">
                </log-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style lang="less">
.mu-section {
    .section-bottom {
        margin-top: 20px;
    }
    .section-bottom .el-button {
        padding: 5px 10px;
        border-radius: 0;
    }
}
</style>

<script>

    import List from './list'
    import Move from './move'
    import LogList from './log-list'

    export default {
        components: {
            List,
            Move,
            LogList,
        },
        props: ['elementIds', 'menuId'],
        data() {
            return {
                activeTab: 'one'
            }
        }
    }
</script>
