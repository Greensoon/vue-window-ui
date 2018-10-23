<template>
	<div class="mu-button">
		<el-button plain v-if="!icon" :disabled="disabled" @click="CLICK_EVENT" :loading="loading">{{label}}<img><i :class="img" v-if="img"></i></el-button>
		<el-tooltip :content="label" v-if="icon">
			<el-button plain :icon="icon" @click="CLICK_EVENT" :loading="loading"></el-button>
		</el-tooltip>
	</div>
</template>
<script>
	import $ from 'jquery'
	export default {
		name: 'muButton',
		props: ['type', 'label', 'icon', 'hover', 'small', 'disabled', 'img', 'middle', 'clickEvent', 'loading'],
		methods: {
			CLICK_EVENT() {
				this.clickEvent && this.clickEvent()
			}
		},
		mounted() {
			if(this.hover) {
				$(this.$el.querySelector('.el-button')).addClass(`mu-hover-${this.hover}`)
			}

			if(this.small != undefined) {
				$(this.$el).addClass('mu-button-small')
			}

			if(this.middle != undefined) {
				$(this.$el).addClass('mu-button-middle')
			}
		}
	}
</script>
