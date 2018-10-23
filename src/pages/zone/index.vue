<template>
	<div class="page-zone flex">
		<lr-layout
			:menus="submenus"
			@menu-click="menuChange"
		>
			<dashboard v-if="activeIndex == 'dashboard'" :menu-id="menuId" :element-ids="needIds"></dashboard>
            <list v-if="activeIndex == 'list'" :menu-id="menuId" :element-ids="elementIds"></list>
            <online-player v-if="activeIndex == 'onlinePlayer'" :menu-id="menuId" :element-ids="elementIds"></online-player>
		</lr-layout>
	</div>
</template>
<style lang="less">
.page-zone {
	.zone-form {
		margin-top: 15px;
	}

	.zone-form1 {
		margin: 20px 0;
		border: 1px solid #ddd;
		padding: 15px 10px;
		.el-form-item {
			margin-bottom: 10px;
		}

		.search-select-button {
			padding: 0 5px;
			overflow: hidden;
			text-overflow: ellipsis;
			height: 30px;
			line-height: 30px;
		}

		.el-form-item__content {
			height: 30px;
			line-height: 30px;
		}

		.search-select {
			display: inline-block;
			vertical-align: middle;
			height: 30px;
		}
	}

	.el-checkbox-group {
		display: inline-block;
	}

	.zone-tw-tip,
	.zone-tw-label {
		font-size: 12px;
	}

	.zone-tw-tip {
		margin-left: 30px;
		color: #ccc;
	}

	.zone-list {
		border: 1px solid #ddd;
		margin-top: 20px;

		th, td {
			font-size: 12px;
		}

		.el-table {
			thead th {
				background: #f1f1f1;
			}

			tbody td {
				color: #333;
			}
		}
	}

	.el-input {
		width: 180px;
	}

	.range-start,
	.range-end {
		display: inline-block;
		width: 78px;
	}

	.range-label {
		display: inline-block;
		padding: 0 1px;
		height: 30px;
		line-height: 30px;
		vertical-align: middle;
	}

	.el-range-editor {
		width: 180px;

		.el-range-input {
			font-size: 12px;
		}
	}

	.el-date-editor .el-range__icon {
		line-height: 25px;
	}

	.el-input__icon.el-range__close-icon {
		display: none;
	}

	.search-select.ip-ss {
		display: inline-block;
	}

	.zone-out-wrap {
		justify-content: space-between;
	}

	.el-input__icon {
		line-height: 1;
	}
}
</style>
<script>

	import Dashboard from './dashboard'
	import List from './list'
	import OnlinePlayer from './online-player'
	import menuMixins from '../menu.mixins.js'

	export default {
		components: { List, Dashboard, OnlinePlayer },
		mixins: [menuMixins],
		data() {
			return {
				activeIndex: 'dashboard',
			}
		},
		created() {
			this.getSubmenus('区服管理', submenus => {
				this.submenus = submenus
				this.getElementIds(menuId => {
					this.menuId = menuId
				})
			})
		},
		watch: {
			needIds: {
				handler(newv) {
					this.elementIds = newv
				}
			},
			activeIndex(newv) {
				var filter = this.submenus.filter(e => e.menu_component == newv)
                if(filter && filter.length) {
                    this.needIds = filter[0].element_ids
                    this.menuId = filter[0].menu_id
                }
            }
		},
		methods: {
			menuChange(val) {
				this.activeIndex = val
			}
		}
	}
</script>