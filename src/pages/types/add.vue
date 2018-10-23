<template>
    <div class="types-add">
        <el-form label-width="80px" :model="addTypes">
            <el-form-item label="名称*">
                <el-input v-model="addTypes.name"></el-input>
            </el-form-item>
            <el-form-item label="中文名称*">
                <el-input v-model="addTypes.cname"></el-input>
            </el-form-item>
            <el-form-item label="主键(key)*">
                <el-input v-model="addTypes.type_key"></el-input>
                多个主键,以英文逗号隔开
            </el-form-item>

            <el-form-item >
                <el-button type="primary" @click="save">确定</el-button>
                <el-button @click="closeModal">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { add } from './api'
    export default {
        props: ['eleId', 'menuId'],
        data() {
            return {
                addTypes: {
                    name: '',
                    type_key: '',
                    cname: ''
                }
            }
        },
        methods: {
            closeModal() {
                this.$emit('close-modal')
            },
            save() {
                var msg = []
                if(!this.addTypes.name) {
                    msg.push('端口不能为空')
                }

                if(!this.addTypes.cname) {
                    msg.push('中文名称不能为空')
                }

                if(!this.addTypes.type_key) {
                    msg.push('主键不能为空')
                }

                if(msg.length) {
                    this.$message.error(msg.shift())
                    return false
                }
                add(this.addTypes, {
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
