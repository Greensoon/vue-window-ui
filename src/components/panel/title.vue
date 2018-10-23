<template>
	<div class="mu-panel-title ">
		{{title}}
		<slot></slot>
	</div>
</template>
<script>
	export default {
		name: 'panelTitle',
		props: ['title']
	}
</script>