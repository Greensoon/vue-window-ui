<template>
    <div class="tag-bind">
        <div class="tag-list">
            <ul class="tag-group-list">
                <li class="tgl-title">标签键</li>
                <li v-for="(ti, i) in tagList"
                    :key="i"
                    @mouseenter="hoverGroup(ti)"
					@click="handGroup(ti)"
                    :class="`${ti.group_name == current_hover ? 'current-hover' : ''} ${hasTags.filter(e => e.group_name == ti.group_name) && hasTags.filter(e => e.group_name == ti.group_name).length ? 'checked' : ''}`"
                >{{ti.group_name}}</li>
            </ul>
            <ul class="tag-item-list" v-if="tlChildren.length">
                <li class="til-title">标签值</li>
                <li v-for="(tc, i) in tlChildren"
                    :key="i"
                    @click="handleClickItem(tc)"
                    :class="`${hasTags.filter(e => e.tag_name == tc.tag_name) && hasTags.filter(e => e.tag_name == tc.tag_name).length && hasTags.filter(e => e.group_name == tc.group_name).length < tlChildren.length || (tlChildren.length<=1 && hasTags.filter(e => e.group_name == tc.group_name).length == tlChildren.length)? 'checked' : ''}`"
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
				padding: 12px;
				border-bottom: 1px solid #ccc;
				border-left: 3px solid #fff;
				cursor: pointer;
				font-size: 12px;
				color: #222;
				font-weight: 500;

				&:last-child {
					border-bottom: 0;
				}

				&.checked {
					position: relative;

					&:after {
						position: absolute;
						content: '';
						width: 20px;
						height: 20px;
						background: url(../../../assets/img/right.png) no-repeat center;
						background-size: 20px 20px;
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
				padding: 14px;
				color: #909399;
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
				padding: 14px;
				color: #909399;
			}

			li {
				padding: 12px;
				border-bottom: 1px solid #ccc;
				cursor: pointer;
				font-size: 12px;
				color: #222;
				font-weight: 500;

				&:last-child {
					border-bottom: 0;
				}

				&.checked {
					position: relative;

					&:after {
						position: absolute;
						content: '';
						width: 20px;
						height: 20px;
						background: url(../../../assets/img/right.png) no-repeat center;
						background-size: 20px 20px;
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
				var filter = this.hasTags.filter(e => e.group_name == item.group_name)
				var flag = filter && filter.length
				var allList = this.tagList.filter(e=> e.group_name == item.group_name)
				var inList = this.hasTags.filter(e => e.id == item.id)
				if(flag) {
				    if(allList&& filter.length == allList[0].children.length){
				        if(allList[0].children.length==1){
							this.hasTags = this.hasTags.filter(e => e.group_name != item.group_name)
						}else{
							this.hasTags = this.hasTags.filter(e => e.group_name != item.group_name)
							this.hasTags.push(item)
						}
					} else{
				        if(inList && inList.length){
							this.hasTags = this.hasTags.filter(e => e.id != item.id)
						}else{
							this.hasTags = this.hasTags.filter(e => e.group_name != item.group_name)
							this.hasTags.push(item)
						}

					}
				} else {
					this.hasTags.push(item)
				}
				this.isallCheck = false
                this.$emit('handle-item', this.hasTags)

            },
			checkItem(item) {
				var filter = this.hasTags.filter(e => e.id == item.id)
				var flag = filter && filter.length
				if(!flag) {
					this.hasTags.push(item)
				}
			},
			handGroup(group){
				var children = this.tagList.filter(e => e.group_name == group.group_name)[0].children
				let hasTagslength=this.hasTags.filter(e => e.group_name == group.group_name).length
				if(hasTagslength < children.length){
					children.map(e => {
						this.checkItem(e)
					})
					this.isallCheck = true
				}else if(hasTagslength == children.length){
					this.hasTags = this.hasTags.filter(e => e.group_name != group.group_name)
					this.isallCheck = false
				}
				this.$emit('handle-item', this.hasTags)
			}
        }
    }
</script>
