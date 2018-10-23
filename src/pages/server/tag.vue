<template>
    <div class="mu-server-tags">
        <div class="mu-tags-wrap">
            <el-tag :key="i"
                v-for="(tag, i) in tagList"
                closable
                @close="handleClose(tag)">
                {{tag.group_name + ' : ' + tag.tag_name}}
            </el-tag>
        </div>

        <div class="mu-tags-bottom">
            <span class="">绑定：</span>
            <el-popover width="400"
                :visible-arrow="false"
                trigger="click" popper-class="tag-wrap">
                <tag-bind  @handle-item="handleTag"
                    :all-tags="allTags"
                    :tag-lists="tagList"
                ></tag-bind>
                <el-button type="info" slot="reference">已有标签</el-button>
            </el-popover>
            <el-button type="info" @click="toggleInput" v-if="!showTagInput">新建标签</el-button>
            <span class="mu-tags-input" v-if="showTagInput">
                <span>分组：</span><input v-model="tagAdd.group_name">
                <span>标签：</span><input v-model="tagAdd.target_name">
                <el-button @click="addTag">确认</el-button>
                <el-button @click="toggleInput">取消</el-button>
            </span>
        </div>

        <div class="tags-btn-wrap">
            <el-button type="primary" @click="saveTag">确定</el-button>
            <el-button @click="closeModal">取消</el-button>
        </div>
    </div>
</template>
<style lang="less">
.mu-tags-wrap {
    border: 2px dashed #ccc;
    padding: 25px;
    min-height: 120px;

    .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}

.mu-tags-bottom {
    margin: 20px 0;
    border-bottom: 1px dotted #ccc;
    padding-bottom: 20px;

    .el-button {
        padding: 8px 10px;
        border-radius: 0;
        font-size: 12px;
    }

    .mu-tags-input input {
        border: 1px solid #ccc;
        height: 30px;
        line-height: 30px;
        width: 80px;
        padding-left: 5px;
    }
}
</style>

<script>
    import { getServerTags } from '../../apis/get'
    import { addTag } from '../../apis/post'
    import { deleteTag } from '../../apis/delete'
    import { modifyServerTag } from '../../apis/put'

    import tagBind from './tag-bind'

    export default {
        components: { tagBind },
        props: ['tags', 'serverId', 'allTag', 'menuid'],
        data() {
            var $this = this
            var $filter = this.tags ? $this.allTag.filter(e => $this.tags.split(',').indexOf(String(e.id)) > -1) : [];
            return {
                tagList: $filter,
                showTagInput: false,
                tagAdd: {
                    group_name: '',
                    target_name: ''
                },
                allTags: $this.allTag,
                server_id: $this.serverId,
                tempArr: []
            }
        },
        watch: {
            serverId(newv) {
                this.server_id = newv
            },
            tags(newv) {
                this.tagList = !newv ? [] : this.allTag.filter(e => this.tags.split(',').indexOf(String(e.id)) > -1)
            }
        },
        methods: {
            handleClose(tag) {
                this.tagList = this.tagList.filter(e=> {
                    return (e.tag_name != tag.tag_name || e.group_name != tag.group_name)
                })

            },
            toggleInput() {
                this.showTagInput = !this.showTagInput
            },
            addTag() {
				if(!this.tagAdd.group_name){
					this.$message.error('请输入分组名')
					return false
				}
				if(!this.tagAdd.target_name){
					this.$message.error('请输入标签名')
					return false
				}
                addTag(this.tagAdd,{ menu: this.menuid})
                    .then(json => {
                        if(json.code == 200) {
                            this.tempArr = [{group_name: this.tagAdd.group_name, tag_name: this.tagAdd.target_name, id: json.result[0].id}]
                            this.tagList = this.tagList.concat(this.tempArr)
                            this.allTags = this.allTags.concat(this.tempArr)
							this.$emit('refresh-tag')
                            this.tagAdd = {
                                group_name: '',
                                target_name: ''
                            }
                        } else {
							this.tempArr = []
							this.tagAdd = {
                                group_name: '',
                                target_name: ''
                            }
						}
                    })
            },
            handleTag(item) {
                this.tagList = item
            },
            filterTags(arr1, arr2) {
                if(!arr2 || !arr2.length) {
                    return arr1
                }
                arr1.forEach(e => {
                    var filter = arr2.filter(el => el.id == e.id)
                    if(filter && filter.length) {
                        e = null
                    }
                })
                return arr1.filter(e => !!e)
            },
            closeModal(fresh = false) {
                this.tagList = this.filterTags(this.tagList, this.tempArr)
                this.allTags = this.filterTags(this.allTags, this.tempArr)
                this.showTagInput = false
                this.$emit('close-modal', fresh)
                this.fresh = false
                this.tagAdd = {
                    group_name: '',
                    target_name: ''
                }
            },
            saveTag() {
                var tag_ids = this.tagList.map(e => e.id)
                if(tag_ids == this.tags) {
                    this.closeModal()
                    return
                }
                var server_id = this.server_id
                modifyServerTag({
                    target_info: tag_ids.join(','),
                    server_id
                },{menu: this.menuid}).then(json => {
                    if(json.code == 200) {
                        this.closeModal(true)
                    }
                })
            }
        }
    }
</script>
