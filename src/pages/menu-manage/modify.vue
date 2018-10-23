<template>
    <div class="menu-modify">
        <el-form label-width="100px" :model="modifyForm">
            <el-form-item label="菜单名称">
                <el-input v-model="modifyForm.menu_name"></el-input>
            </el-form-item>
            <el-form-item label="菜单描述">
                <el-input v-model="modifyForm.menu_desc"></el-input>
            </el-form-item>
            <el-form-item label="对应组件">
                <el-input v-model="modifyForm.menu_component"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标">
                <el-input v-model="modifyForm.menu_icon"></el-input>
            </el-form-item>
            <el-form-item label="是否对应组件">
                <el-radio v-model="modifyForm.has_element" :label="0">是</el-radio>
                <el-radio v-model="modifyForm.has_element" :label="1">否</el-radio>
            </el-form-item>
            <el-form-item label="菜单父级">
                <el-input v-model="modifyForm.menu_pid"></el-input>
            </el-form-item>

            <el-form-item label="菜单状态">
                <el-input v-model="modifyForm.status"></el-input>
            </el-form-item>

            <el-form-item label="活动形式">
                <el-button type="primary" @click="modifyAction">确定</el-button>
                <el-button @click="closeModal">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { modifyMenu } from '../../apis/put'

    export default {
        props: ['menu'],
        data() {
            return {
                modifyForm: {
                    menu_name: '',
                    menu_desc: '',
                    menu_code: '',
                    menu_component: '',
                    has_element: 0,
                    menu_pid: 0
                }
            }
        },
        created() {
            this.modifyForm = Object.assign({}, this.menu)
        },
        watch: {
            menu: {
                handler(newv) {
                    this.modifyForm = Object.assign({}, newv)
                },
                deep: true
            }
        },
        methods: {
            closeModal() {
                this.$emit('close-modal')
            },
            modifyAction() {
                modifyMenu(this.modifyForm)
                    .then(json => {
                        if(json.code == 200) {
                            this.$notify({
                                type: 'success',
                                message: '修改成功'
                            })
                            this.closeModal()
                            this.$emit('fresh')
                        }
                    })
            }
        }
    }
</script>
