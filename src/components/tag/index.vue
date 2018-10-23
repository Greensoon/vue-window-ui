<template>
	<div :class="`${value == active ? 'mu-tag mu-tag-active': 'mu-tag'}`" @click="clickHandler">
		{{title}}
	</div>
</template>
<script>
	import $ from 'jquery'

	export default {
		name: 'muTag',
		props: ['title', 'click', 'value', 'active'],
		methods: {
			clickHandler() {
				this.$emit('click', this.value)
			}
		}
	}
</script>
