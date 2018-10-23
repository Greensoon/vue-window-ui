<template>
	<div class="mu-instance-panel__title">
		{{title}}
		<div class="mu-instance-panel__title-right">
			<slot></slot>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'instancePanelTitle',
		props: ['title']
	}
</script>