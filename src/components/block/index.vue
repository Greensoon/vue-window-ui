<template>
	<div :class="`mu-block bg-${type} ${theme}` " >
		<div v-if="type!='empty'">
			<div class="mu-block-inner">
	          	<h3 class="mu-block-num">{{num}}</h3>
	          	<p class="mu-block-label">{{label}}</p>
	        </div>
	        <div class="mu-block-icon">
	          	<i :class="`iconfont icon-${icon}`"></i>
	        </div>
	        <router-link :to="link" class="mu-block-footer" v-if="!!link">更多 <i class="el-icon-back rotatex-180"></i></router-link>
	        <a :href="link" class="mu-block-footer" v-if="!link">更多 <i class="el-icon-back rotatex-180"></i></a>
		</div>
		<div v-if="type=='empty'"></div>
  	</div>
</template>
<script>
	export default {
		name: 'muBlock',
		data() {
			return {theme: ''}
		},
		props: ['type', 'num', 'label', 'link', 'icon', 'light'],
		created() {
			if(this.light!=undefined) {
				this.theme = 'light'
			}
		}
	}
</script>