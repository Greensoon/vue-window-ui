<template>
    <div class="types-modify">
        <el-form label-width="80px" :model="modifyTypes">
           <el-form-item label="名称*">
                <el-input v-model="modifyTypes.name"></el-input>
            </el-form-item>
            <el-form-item label="中文名称*">
                <el-input v-model="modifyTypes.cname"></el-input>
            </el-form-item>
            <el-form-item label="主键(key)*">
                <el-input v-model="modifyTypes.type_key"></el-input>
                多个主键,以英文逗号隔开
            </el-form-item>

            <el-form-item >
                <el-button type="primary" @click="modify">确定</el-button>
                <el-button @click="closeModal">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { update } from './api'

    export default {
        props: ['modifyData', 'eleId', 'menuId'],
        watch: {
            modifyData: {
                handler(newv) {
                    this.modifyTypes = {
                        name: newv.name,
                        type_key: newv.type_key,
                        cname: newv.cname,
                        id: newv.id
                    }
                },
                deep: true
            }
        },
        data() {
            return {
                modifyTypes: {
                    name: this.modifyData.name,
                    type_key: this.modifyData.type_key,
                    cname: this.modifyData.cname,
                    id: this.modifyData.id
                }
            }
        },
        methods: {
            closeModal() {
                this.$emit('close-modal')
            },
            modify() {
                var msg = []
                if(!this.modifyTypes.name) {
                    msg.push('端口不能为空')
                }

                if(!this.modifyTypes.cname) {
                    msg.push('中文名称不能为空')
                }

                if(!this.modifyTypes.type_key) {
                    msg.push('主键不能为空')
                }

                if(msg.length) {
                    this.$message.error(msg.shift())
                    return false
                }

                update(this.modifyTypes, {
                    ele: this.eleId,
                    menu: this.menuId
                }).then(json => {
                    if(json.code == 200) {
                        this.$notify({
                            type: 'success',
                            message: '保存成功'
                        })
                        this.closeModal()
                    } else {
                        this.$message.error(json.message)
                    }
                })
            }
        }
    }
</script>