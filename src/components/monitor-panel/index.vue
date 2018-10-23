<template>
	<div class="mu-monitor-panel">
		<div class="mu-monitor-panel__title">
			<div class="mu-monitor-panel__title-text">
				{{title}}
			</div>
			<div class="mu-monitor-panel__title-desc">
				<span class="mu-monitor-panel__title-desc-item" v-for="(x, i) in desc" :key="i">{{x.name}}：{{x.value}}</span>
			</div>

			<div class="mu-monitor-panel--settings" v-if="remind != undefined" @click="remindHandle($event)"><i class="el-icon-bell"></i></div>
		</div>
		<div class="mu-monitor-panel__content">
			<slot></slot>
		</div>
	</div>
</template>
<style lang="less">
.mu-monitor-panel {
	margin-bottom: 20px;
}
</style>

<script>
	export default {
		name: 'monitorPanel',
		props: ['title', 'desc', 'remind', 'remindClick'],
		methods: {
			remindHandle(e) {
				this.remindClick && this.remindClick(e)
			}
		}
	}
</script>