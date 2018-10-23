<template>
	<div class="mu-mobile-menu">
		<!-- <side-menus :menus="menus" :select="closeMenu" ></side-menus> -->
		<el-menu class="main-menu" :default-active="$route.path" router @select="closeMenu">
			<el-submenu :index="o.index" v-if="o.children && o.children.length" v-for="(o, i) in menus" :key="i">
				<template slot="title">
					<i :class="`el-icon-${o.icon}`"></i>
					<span>{{o.name}}</span>
				</template>
				<el-menu-item :index="ele.index" v-bind:class="{'is-active': $route.path.indexOf(ele.index) >= 0}" v-for="(ele, idx) in o.children" :key="idx">
					<i :class="`el-icon-${ele.icon}`"></i>
					{{ele.name}}
				</el-menu-item>
			</el-submenu>
			<el-menu-item :index="o.index" v-bind:class="{'is-active': $route.path.indexOf(o.index) >= 0}" v-if="!o.children || !o.children.length" v-for="(o, i) in menus" :key="i">
				<i :class="`el-icon-${o.icon}`"></i>
				<span slot="title">{{o.name}}</span>
			</el-menu-item>
		</el-menu>
	</div>
</template>
<script>
import $ from 'jquery'
import { isMobile } from '../../utils/dom'

	export default {
		name: 'mobileMenu',
		data() {
			var $isVisible = this.value
			return {
				isVisible: $isVisible
			}
		},
		props: ['menus', 'value', 'change'],
		watch: {
			value(nv, ov) {
				this.isVisible = nv
				this.toggleVisible()
			},
			isVisible(nv, ov) {
				this.toggleVisible()
			}
		},
		mounted() {
			this.toggleVisible()
			var $el = this.$el
			var $this = this
			$(window).resize(function() {
				if(!isMobile()) {
					$el.style.display = 'none'
					$this.isVisible = false
				}
			})
		},
		beforeDestroy() {
			$(window).unbind('resize')
		},
		methods: {
			toggleVisible() {
				if(this.isVisible) {
					this.$el.style.display = 'block'
				} else {
					this.$el.style.display = 'none'
				}
			},
			closeMenu() {
				this.change()
				this.isVisible = false
			}
		}
	}
</script>

<style lang="less">
	.mu-mobile-menu {
	    position: absolute;
	    width: 100%;
	    background: rgba(0,0,0,0.5);
	    z-index: 11;
	    left: 0;
	    right: 0;
	    top: 78px;
		bottom: 0;
		
		border-top: 1px solid #ddd;

	    .main-menu {
	    	background: #fff;

	    	.main-menu-toggle {
	    		display: none;
	    	}
	    }
	}
</style>