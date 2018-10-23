<template>
    <div class="element-add">
        <el-form label-width="80px" :model="elementAdd">
            <el-form-item label="元素名称">
                <el-input v-model="elementAdd.element_name"></el-input>
            </el-form-item>
            <el-form-item label="元素描述">
                <el-input v-model="elementAdd.element_desc"></el-input>
            </el-form-item>
            <el-form-item label="元素代码">
                <el-input v-model="elementAdd.element_code"></el-input>
            </el-form-item>

            <el-form-item >
                <el-button type="primary" @click="addElementAction">保存</el-button>
                <el-button @click="closeModal">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { addElement } from '../../apis/post'

    export default {
        props: ['menuId', 'elementId'],
        data() {
            return {
                elementAdd: {
                    element_name: '',
                    element_desc: '',
                    element_code: ''
                }
            }
        },
        methods: {
            addElementAction() {
                addElement(this.elementAdd, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.$notify({
                                message: '元素添加成功',
                                type: 'success'
                            })
                            this.$emit('close-modal')
                            this.$emit('fresh', json.result)
                        } else {
                            this.$message.error(json.message)
                        }
                    })
            },
            closeModal() {
                this.$emit('close-modal')
            }
        }
    }
</script>