<template>
	<div :class="`mu-panel ${!!type ? (type + '-panel') : ''}`">
		<slot></slot>
	</div>
</template>
<script>
	import $ from 'jquery'
	import { isMobile } from 'utils/dom'

	export default {
		name: 'panel',
		data() {
			return {
				defaultBorder: {'box-shadow': '0px 1px 4px #8F949A'}
			}
		},
		props: ['border', 'type'],
		mounted() {
			var _wrap = this.$el
			if(this.border != undefined) {
				$(_wrap).css(this.defaultBorder)
			}

			if(isMobile()) {
				$(_wrap).css('width', '100%!important')
			}
		}
	}
</script>