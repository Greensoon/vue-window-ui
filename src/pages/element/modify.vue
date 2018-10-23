<template>
    <div class="element-modify">
        <el-form label-width="80px" :model="elementModify">
            <el-form-item label="元素名称">
                <el-input v-model="elementModify.element_name"></el-input>
            </el-form-item>
            <el-form-item label="元素描述">
                <el-input v-model="elementModify.element_desc"></el-input>
            </el-form-item>
            <el-form-item label="元素代码">
                <el-input v-model="elementModify.element_code"></el-input>
            </el-form-item>

            <el-form-item >
                <el-button type="primary" @click="modifyElementAction">修改</el-button>
                <el-button @click="closeModal">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { modifyElement } from '../../apis/put'
    import { getElementById } from '../../apis/get'

    export default {
        props: ['element', 'menuId', 'elementId'],
        data() {
            var $this = this
            return {
                elementModify: $this.element
            }
        },
        watch: {
            element: {
                handler(newv) {
                    this.elementModify = newv
                },
                deep: true
            }
        },
        methods: {
            closeModal() {
                this.$emit('close-modal')
            },
            modifyElementAction() {
                modifyElement(this.elementModify, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.$notify({
                                message: '修改成功',
                                type: 'success'
                            })

                            this.$emit('close-modal')
                            this.$emit('fresh')
                        }
                    })
            },
            closeModal() {
                this.$emit('close-modal')
            }
        }
    }
</script>
