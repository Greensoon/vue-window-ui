<template>
	<div class="mu-table">
		<el-table :data="tableData"
		    stripe
		    :ref="tableId"
		    style="width: 100%"
			@selection-change="change"
			@select-all="selectAll"
			:empty-text="emptyText"
		>
		    <el-table-column type="selection" v-if="showCheckbox != undefined"
		      	width="55" >
		    </el-table-column>
		    <el-table-column type="index" v-if="showIndex!=undefined"
		      width="50">
		    </el-table-column>
		    <el-table-column :prop="key.prop"
		      	:label="key.label"
		      	:width="key.width" v-for="(key, i) in columns" :key="i">
		    </el-table-column>
	  	</el-table>
	  	<div class="mu-table-bottom clearfix">
	  		<div class="mu-table-bottom__left">
	  			<el-checkbox v-model="checked"
				  	@change="changeCheckbox"
					:indeterminate="isIndeterminate"
					v-if="showCheckbox != undefined"
				></el-checkbox>
	  			<slot></slot>
	  		</div>
	  		<div class="mu-table-bottom__right">
  			 	<el-pagination
			      	@size-change="handleSizeChange"
			      	@current-change="handleCurrentChange"
			      	:current-page.sync="currentPage"
			      	:page-sizes="[...pageSizes]"
			      	:page-size="pageSize"
			      	layout="sizes, prev, pager, next"
		      		:total="total"
				>
			    </el-pagination>
	  		</div>
	  	</div>
		<div class="mu-table-loading" v-if="isLoading">
			<i class="el-icon-loading mu-table--loading" ></i>
		</div>
	</div>
</template>
<style lang="less">
.mu-table {
	border: 1px solid #eee;
	position: relative;

	.mu-table-loading {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0,0,0,0.2);
		z-index: 2;

		.mu-table--loading {
			position: absolute;
			font-size: 25px;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			width: 25px;
			height: 25px;
		}
	}
}

.el-table td,
.el-table th {
	padding: 8px 0;
}
</style>

<script>
	import $ from 'jquery'

	export default {
		data() {
			return {
				checked: false,
				selectFlag: false,
				isIndeterminate: false,
				tableId: `muTable_${new Date().getTime().toString().slice(0,14)}`,
				selectRows: [],
				currentPage: 1
			}
		},
		name: 'muTable',
		props: [
			'showIndex',
			'showCheckbox',
			'tableData',
			'stripe',
			'pageSize',
			'columns',
			'pageSizes',
			'total',
			'emptyText',
			'isLoading'
		],
		methods: {
			handleCurrentChange() {},
			handleSizeChange() {},
			selectAll(selection) {
				if(typeof selection != 'boolean') {
					if(selection.length == this.tableData.length) {
						this.checked = true
						this.selectRows = selection
					}

					if(selection.length == 0) {
						this.checked = false
						this.selectRows = []
					}

					this.$emit('askTableData', this.selectRows)
				}
			},
			change(selection) {
				this.selectRows = selection
				if(this.selectRows.length == this.tableData.length) {
					this.checked = true
					this.isIndeterminate = false
				} else if(this.selectRows.length == 0) {
					this.checked = false
					this.isIndeterminate = false
				} else {
					this.isIndeterminate = true
				}

				this.$emit('askTableData', this.selectRows)
			},
			changeCheckbox(val) {
				if(!val) {
					this.$refs[this.tableId].clearSelection()
					this.selectRows = []
				} else {
					this.tableData.forEach((row) => {
						this.$refs[this.tableId].toggleRowSelection(row, true)
					})

					this.selectRows = this.tableData
				}

				this.$emit('askTableData', this.selectRows)
			}
		}
	}
</script>