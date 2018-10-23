<template>
	<div class="tag-bind">
		<div class="tag-list">
			<ul class="tag-group-list">
				<li class="tgl-title">分组</li>
				<li v-for="(ti, i) in tagList"
					:key="i"
					@mouseenter="hoverGroup(ti)"
					:class="`${ti.group_name == current_hover ? 'current-hover' : ''} ${hasTags.filter(e => e.group_name == ti.group_name) && hasTags.filter(e => e.group_name == ti.group_name).length ? 'checked' : ''}`"
				>{{ti.group_name}}</li>
			</ul>
			<ul class="tag-item-list" v-if="tlChildren.length">
				<li class="til-title">标签</li>
				<li v-for="(tc, i) in tlChildren"
					:key="i"
					@click="handleClickItem(tc)"
					:class="`${hasTags.filter(e => e.tag_name == tc.tag_name) && hasTags.filter(e => e.tag_name == tc.tag_name).length ? 'checked' : ''}`"
				>{{tc.tag_name}}</li>
			</ul>
		</div>
	</div>
</template>
<style lang="less">
.tag-bind {
    .tag-list {
        display: flex;
    }

    .tag-group-list {
        width: 50%;
        background: #fff;
        border: 1px solid #ccc;
        height: fit-content;

        li {
            padding: 5px;
            border-bottom: 1px solid #ccc;
            border-left: 3px solid #fff;
            cursor: pointer;
            &:last-child {
                border-bottom: 0;
            }

            &.checked {
                position: relative;

                &:after {
                    position: absolute;
                    content: '';
                    width: 10px;
                    height: 10px;
                    background: url(../../../assets/img/right.png) no-repeat center;
                    background-size: 10px 10px;
                    right: 10px;
                    top: 0;
                    bottom: 0;
                    margin: auto;
                }
            }
        }

        .current-hover {
            border-left-color: #09c;
        }

        .tgl-title {
            background: #e1e1e1;
            border-left-color: #e1e1e1;
        }
    }

    .tag-item-list {
        width: 50%;
        background: #fff;
        border: 1px solid #ccc;
        // border-left: 0;
        height: fit-content;
        .til-title {
            background: #e1e1e1;
            border-bottom: 1px solid #ccc;
        }

        li {
            padding: 5px;
            border-bottom: 1px solid #ccc;
            cursor: pointer;

            &:last-child {
                border-bottom: 0;
            }

            &.checked {
                position: relative;

                &:after {
                    position: absolute;
                    content: '';
                    width: 10px;
                    height: 10px;
                    background: url(../../../assets/img/right.png) no-repeat center;
                    background-size: 10px 10px;
                    right: 10px;
                    top: 0;
                    bottom: 0;
                    margin: auto;
                }
            }
        }
    }
}
.tag-wrap {
    background: none;
    background: none;
    padding: 0;
    border-radius: 0;
    border: 0;
    box-shadow: none;
    margin-left: 15%;
}
</style>

<script>
	import { handleTagList } from './util'

	export default {
		props: ['allTags', 'tagLists'],
		data() {
			var $this = this
			return {
				tagList: $this.handleTagList($this.allTags),
				tlChildren: [],
				current_hover: '',
				hasTags: this.tagLists || []
			}
		},
		watch: {
			allTags: {
				handler(newv) {
					this.tagList = this.handleTagList(newv)
				},
				deep: true
			},
			tagLists: {
				handler(newv) {
					this.hasTags = newv
				},
				deep: true
			}
		},
		methods: {
			hoverGroup(it) {
				this.tlChildren = this.tagList.filter(e => e.group_name == it.group_name)[0].children
				// this.tlChildren = this.tlChildren.filter(e => e.tag_name != "")
				this.current_hover = it.group_name
			},
			handleTagList(data) {
				return handleTagList(data)
			},
			handleClickItem(item) {
				var filter = this.hasTags.filter(e => e.id == item.id)
				var flag = filter && filter.length

				if(flag) {
					this.hasTags = this.hasTags.filter(e => e.id != item.id)
				} else {
					this.hasTags.push(item)
				}

				this.$emit('handle-item', this.hasTags)

			}
		}
	}
</script>
