<template>
    <div :class="`mu-search-bar ${clazz ? clazz : ''}`">
        <div class="search-bar">
            <el-popover
                placement="bottom-start"
                width="100"
                trigger="hover"
                :visible-arrow="false"
                popper-class="search-bar-pop"
            >
                <ul class="sb-list">
                    <li class="sb-item" v-for="(key, i) in tags" :key="i" @click="selectTag(key)">{{key.name}}</li>
                </ul>
                <div class="search-bar-wrap search-bar-wrap1" slot="reference">
                    <i class="el-icon-caret-bottom"></i>
                </div>
            </el-popover>

            <div class="search-bar-wrap search-bar-wrap2">
                <span class="search-bar-filter" v-if="tagType">{{tagType}}:</span>
				<el-autocomplete
					class="search-bar-input"
					v-if="tagType"
					v-model.trim="keyword"
					:fetch-suggestions="querySearchAsync"
					:placeholder="placeholder || '选择实例属性项搜索，或者输入机器名称搜索'"
					@select="search"
					popper-class="select-width"
				></el-autocomplete>
                <input v-else class="search-bar-input" v-model.trim="keyword" :placeholder="placeholder || '选择实例属性项搜索，或者输入机器名称搜索'">
                <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    .search-bar {
        width: 600px;
        display: flex;
        border: 1px solid #ccc;
        height: 36px;

        .search-bar-wrap1 {
            display: inline-block;
            // width: 50px;

            i {
                margin-top: 10px;
                color: #999;
                border-right: 1px solid #ccc;
                margin-left: 10px;
                padding-right: 10px;
            }
        }

        .search-bar-wrap2 {
            display: flex;
            width: 100%;

            .search-bar-input {
                width: 100%;
                padding-left: 10px;
				font-size: 12px;
				.el-input__inner{
					border: none;
					font-size: 12px;
                    padding-left: 0px;
                    height: 34px;
                    line-height: 34px;
				}

            }

            button {
                border: 0;
                border-left: 1px solid #ccc;
                border-radius: 0;
                color: #424242;
                background: #f8f8f8;
            }

            .search-bar-filter {
                white-space: nowrap;
                font-size: 12px;
                line-height: 38px;
                margin-left: 10px;
            }
        }
    }

    .search-bar-pop {
        padding: 0;
        min-width: 100px;
        border-radius: 0;
        .sb-item {
            height: 30px;
            line-height: 30px;
            cursor: pointer;
            font-size: 12px;
            padding-left: 20px;
            &:hover {
                background: #f8f8f8;
            }
        }
    }
	.select-width{
		width:545px !important;
		margin-left: -95px;
		margin-top: 0 !important;
		.popper__arrow {
			display: none;
		}
		.el-autocomplete-suggestion__wrap{
			border-radius:0;
			border-color: #ccc;
		}
	}

</style>

<script>
	import { getAutoSearch } from '../../apis/get'
    export default {
        name: 'muSearchbar',
        props: ['types', 'clazz', 'placeholder'],
        data() {
            return {
                tagType: null,
                currTag: [],
                keyword: '',
                tags: this.types,
                tagValue: null,
				searchAuthList: [],
				timeout:  null,
            }
        },
		watch:{
			tagType(){
			    this.keyword = ''
				this.searchAuthList=[]
			}
		},
        methods: {
            selectTag(tag) {
                tag.value && (this.tagType = tag.name) && (this.tagValue = tag.value)
                if(!tag.value) {
                    this.tagType = null
                    this.tagValue = null
                }
            },
            search() {
                if(this.keyword==''){
                    return
				}
                var filter= this.currTag.filter(e => e.label == this.tagType && e.keyword == this.keyword)
                if(filter.length) {
                    return
                }
                this.$emit('search-action', {[this.tagValue || 'machine_name']: this.keyword})
                this.keyword = ''
            },
			querySearchAsync(queryString, cb) {
                if(queryString) {
					getAutoSearch({
						[this.tagValue]: this.keyword
					}).then(body => {
						if (body.code == 200) {
							var ret = body.result
							this.searchAuthList = ret.map(e => {
								return {value: e[this.tagValue]}
							})
							this.$nextTick(() => {
								var searchAuthList = this.searchAuthList;
								var results = queryString ? searchAuthList.filter(this.createStateFilter(queryString)) : searchAuthList;
								cb(results);
							})
						}
					})
				}else{
					cb([])
				}

			},
			createStateFilter(queryString) {
				return (state) => {
					return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
				};
			}
        }
    }
</script>
