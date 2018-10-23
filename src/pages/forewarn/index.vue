<template>
    <div class="forewarn">
        <div class="forewarn-left">
			<el-menu class="panel-menu" width="220" :default-active="defaultActive">
				<el-menu-item index="warnrule">
					<i class="el-icon-menu"></i>
					<span slot="title">预警规则</span>
				</el-menu-item>
			</el-menu>
        </div>
        <div class="forewarn-right">
			<!--:element-ids="needIds" :menu-id="menuId"-->
            <rule v-if="defaultActive == 'warnrule'" ></rule>
        </div>
    </div>
</template>
<script>
	import rule from './warn-rules.vue'
	// import rule from '../monitor/warn-list'

    export default {
        components: {
			rule
        },

        data() {
            return {
                defaultActive: 'warnrule',
                // needIds: [],
                menuId: 0,
                roleElementIds: []
            }
        },
        computed: {

        },
        watch: {
            defaultActive(newv) {
                var filter = this.submenus.filter(e => e.data.menu_component == newv)
                if(filter && filter.length) {
                    this.needIds = filter[0].data.element_ids
                    this.menuId = filter[0].menu_id
                }
            }
        },
        methods: {
        }
    }
</script>
<style lang="less">
    .forewarn {
        display: flex;

        &-left {
            width: 180px;
            border-right: 1px solid #ccc;
        }

        &-left,
        &-right {
            height: 100%;
        }

        &-right {
            padding: 20px;

            overflow: auto;
        }

        &-flex {
            justify-content: space-between;
            margin-top: 10px;
        }
    }

</style>
<style>
.forewarn-right {
    width: calc(100% - 180px);
}
</style>
