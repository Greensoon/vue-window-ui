<template>
	<div class="mu-datepicker">
		<div class="mu-datepicker-pc" v-if="!is_mobile">
			<el-date-picker
				:type="adapt_type"
				:align="align"
				:placeholder="placeholder"
				:pickerOptions="pickerOptions"
				:range-separator="rangeSeparator"
				:start-placeholder="startPlaceholder"
				:end-placeholder="endPlaceholder"
				v-model="mv"
			></el-date-picker>
		</div>
		<div class="mu-datepicker-mobile" v-else >
			<div class="mu-datepicker-mobile__date" v-if="adapt_type == 'date'">
				<i class="el-icon-date"></i>
				
			</div>
			<DateRange :start-placeholder="startPlaceholder"
				:end-placeholder="endPlaceholder"
				:range-separator="rangeSeparator"
				v-if="adapt_type== 'daterange'"
			></DateRange>
		</div>

	</div>
</template>
<style lang="less">
	.mu-datepicker-mobile {
		background: #ffffff;
		height: 40px;
		line-height: 40px;

		padding-left: 4px;
		border-radius: 4px;

		border: 1px solid #ddd;

		&__input {
			height: 40px;
			background: none;
		}
	}

	.mu-datepicker-mobile-wrap {
		display: none;
	}
</style>

<script>
	import { isMobile } from 'utils/dom'
	import Picker from 'pickerjs/dist/picker.min'
	import $ from 'jquery'

	import DateRange from './date-range'

	export default {
		name: 'muDatepicker',
		components: {
			DateRange
		},
		props: ['value', 'type',  'align', 'placeholder', 'pickerOptions', 'rangeSeparator', 'startPlaceholder', 'endPlaceholder', 'change'],
		data() {
			var $type = this.type
			var $value = this.value
			return {
				hook: `js-hook-date_${new Date().getTime()}`,
				is_mobile: isMobile(),
				adapt_type: $type || 'date',
				mv: $value
			}
		},
		watch: {
			mv(nv, ov) {
				this.change && this.change(nv)
			}
		},
		mounted() {
			if(this.$el.querySelector(`.${this.hook}`)) {
				this.init()
			}
		},
		methods: {
			init() {
				// const $this = this
				// this.picker = new Picker(document.querySelector(`.${$this.hook}`), {
				// 	format: 'YYYY-MM-DD',
				// 	text: {
                //         title: '开始日期',
                //         confirm: '确定',
                //         cancel: '取消'
				// 	}
				// })
			}
		}
	}
</script>