<template>
    <div class="menu-add">
        <el-form label-width="100px" :model="menuAdd">
            <el-form-item label="菜单名字">
                <el-input v-model="menuAdd.menu_name"></el-input>
            </el-form-item>
            <el-form-item label="菜单描述">
                <el-input v-model="menuAdd.menu_desc"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标">
                <el-input v-model="menuAdd.menu_icon"></el-input>
            </el-form-item>
            <el-form-item label="对应组件">
                <el-input v-model="menuAdd.menu_component"></el-input>
            </el-form-item>
            <el-form-item label="是否对应页面">
                <el-radio v-model="menuAdd.has_element" label="0">是</el-radio>
                <el-radio v-model="menuAdd.has_element" label="1">否</el-radio>
            </el-form-item>
            <el-form-item label="菜单父级">
                <el-input v-model="menuAdd.menu_pid"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="saveHandle" type="primary" :loading="loading">添加</el-button>
                <el-button @click="cancelHandle">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { addMenu } from '../../apis/post'

    export default {
        data() {
            return {
                menuAdd: {
                    menu_name: '',
                    menu_desc: '',
                    menu_icon: '',
                    menu_component: '',
                    has_element: '',
                    menu_pid: 0
                },
                loading: false
            }
        },
        methods: {
            saveHandle() {
                addMenu(this.menuAdd)
                    .then(json => {
                        if(json.code == 200) {
                            this.$message.success('添加成功')
                            this.$emit('close-modal')
                            this.$emit('fresh')
                        }
                    })
            },
            cancelHandle() {
                this.$emit('close-modal')
            }
        }
    }
</script>