<template>
	<div>
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane label="自动切分区" name="first">
				<auto :element-ids="elementIds" :menu-id="menuId"></auto>
			</el-tab-pane>
			<el-tab-pane label="任务记录" name="second">
				<history :element-ids="elementIds" :menu-id="menuId" :active-flag="activeName"></history>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import auto from './auto'
import history from './history'

export default {
	props: ['elementIds', 'menuId'],
	data() {
		return {
			activeName: 'first'
		}
	},
	components: {
		auto,
		history
	}
}
</script>