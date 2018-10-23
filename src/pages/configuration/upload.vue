<template>
    <div class="con-upload">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="平台">
                <el-select v-model="form.platform"
                    style="width: 100%"
                    filterable
                    placeholder="请选择平台"
                    multiple
                    @change="changePlatform"
                    @remove-tag="removeTags">
                    <el-option v-for="(opt, idx) in platforms"
                        :key="idx"
                        :label="opt.name"
                        :value="opt.value" ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="分区">
                <el-select v-model="form.sections" style="width: 100%" filterable multiple placeholder="请选择分区">
                    <el-option-group v-for="(group, idx) in platform_arr"
                        :key="idx"
                        :label="group.name">
                        <el-option v-for="(item, i) in group.sections"
                            :key="i"
                            :label="group.name+' - '+item.name"
                            :value="item.platform_id + '_' + item.id">
                        </el-option>
                    </el-option-group>
                </el-select>
            </el-form-item>

            <el-form-item label="excel文件">
                <el-upload drag
                    :headers="{Authorization: getToken()}"
                    :on-success="uploadSuccess"
                    :action="upload_url"
                    name="files"
                    :on-remove="handleRemove"
                    :before-upload="beforeUpload"
                    :file-list="fileList"
                    multiple >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
                </el-upload>
            </el-form-item>

            <el-form-item label="状态">
                <el-select v-model="form.status" placeholder="请选择活动区域">
                    <el-option v-for="(opt, o) in options"
                        :key="o"
                        :label="opt.name"
                        :value="opt.value"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="描述">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
                <el-button @click="close">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { upload_url, saveConfig } from './api'
    import { getToken } from '../../utils/auth'
    const statuses = [{ name: '有效', value: 'effective'}, { name: '无效', value: 'invalid' }]
    import gpMixins from '../game-platform.mixins'
    import { list } from '../sections/api'

    export default {
		mixins: [gpMixins],
		props:['eles','uploads'],
        data() {
            return {
                upload_url,
                options: statuses,
                gameId: 1,
                form: {
                    files: [],
                    platform: [],
                    sections: [],
                    status: 'effective',
                    desc: ''
                },
				platform_arr: [],
				chacksection: true,
                fileList: [],
                fileFails: [],
            }
		},
		watch: {
			uploads: {
				handler(val) {
					if(!val) {
						this.clear()
					}
				},
				deep:true
			}
		},
        methods: {
            getSections(ret) {
                return list({
                    game_id: this.gameId,
                    platform_id: ret.value,
                    all: 'yes'
                }).then(json => {
                    if(json.code == 200) {
                        ret.sections = json.result
                        this.platform_arr.push(ret)
                    }
                })
            },
            changePlatform(val) {
                this.platform_arr = []
                val.forEach(e => {
                    var ret = this.platforms.filter(el => e == el.value)[0]
                    this.getSections(ret)
                })
            },
            onSubmit() {
				this.chacksection = true
				var params = Object.assign({}, this.form)
				var ret = this.hd(params.platform, params.sections)

                params.platform = JSON.stringify(ret)
                delete params.sections

                const save = _ => {
                    return saveConfig(params, {
                        menu: this.eles.menuId,
                        ele: this.eles.ele.element_id
                    }).then(json => {
                        if(json.code == 200) {
                            this.clear()
                            this.$message.success('添加成功')
                            this.closeModal(json.result)
                        }
                    })
				}

				if(this.chacksection) {
                    if(this.fileFails.length) {
                         this.$confirm(this.fileFails.map(e => e.file + ' ' + e.msg).join('') + ' , 这些文件将不会保存，确定继续操作？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            center: true
                        }).then(() => {
                            save()
                        }).catch(() => {})
                    } else {
                        save()
                    }
				}
            },

            closeModal(msg) {
                this.$emit('close-modal', msg)
            },

            beforeUpload(file) {
				if(file.name.indexOf('.xls','.xlsx') > -1) {
					return true
				} else {
					this.$message.error('上传文件必须是excel')
					return false
				}
            },
            hd(p, s) {
                var ret = []
                p.forEach(e => {
                    var tmp = []
                    s.forEach(el => {
                        if(el.startsWith(e + '_')) {
                            tmp.push(el.split('_')[1])
                        }
                    })
                    if(tmp.length) {
                        ret.push({
                            platform_id: e,
                            section: tmp
                        })
                    } else{
						this.$message.error('有平台未选择分区！')
						this.chacksection = false
					}
                })
                return ret
            },
            uploadSuccess(response, file, filelist) {
                if(response.code != 200) {
                    this.$message.error(file.name + ' ' + response.message)
                    this.fileFails.push({file: file.name, msg: response.message})
                } else {
                    this.fileList = filelist
                    this.form.files.push(response.result.name)
                }
            },
            removeTags(tag) {
                this.form.sections = this.form.sections.filter(e => {
                    return !e.startsWith(tag + '_')
                })
            },
            getToken() {
                return getToken()
            },
            handleRemove(file, filelist) {
				this.fileFails = this.fileFails.filter(e=> e.file != file.name)
                if(filelist && filelist.length) {
                    this.form.files =JSON.stringify( filelist.map(el => el.name))
                } else {
                    this.form.files = []
                }
            },
            close() {
                this.clear()
                this.closeModal()
            },

            clear() {
                this.form= {
                    files: [],
                    platform: [],
                    sections: [],
                    status: 'effective',
                    desc: ''
				}
				this.fileList = []
				this.fileFails = []
            }
        }
    }
</script>
