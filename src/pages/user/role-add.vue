<template>
    <div class="mu-user-add-wrap">
        <el-form label-width="80px" :model="roleAdd">
            <el-form-item label="角色名称">
                <el-input v-model="roleAdd.role_name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
                <el-input v-model="roleAdd.role_desc"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="saveHandle" type="primary" :loading="loading">保存</el-button>
                <el-button @click="cancelHandle">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { addRoleInfo } from '../../apis/post'

    export default {
        props: ['menuId', 'elementId'],
        data() {
            return {
                roleAdd: {
                    role_name: '',
                    role_desc: ''
                },
                loading: false
            }
        },
        methods: {
            saveHandle() {
                this.loading = true
                var msg = null
                for(var i in this.roleAdd) {
                    if(!this.roleAdd[i]) {
                        msg = '资料不能为空'
                    }
                }

                if(msg) {
                    this.loading = false
                    this.$message.error(msg)
                    return false
                }

                addRoleInfo(this.roleAdd, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        this.loading = false
                        if(json.code == 200 ) {
                            this.$emit('close-modal')
                            this.$emit('fresh', json.result)
                            this.$notify({
                                title: '提示',
                                message: '添加角色成功',
                                type: 'success'
                            })
                            this.roleAdd = {
                                role_name: '',
                                role_desc: ''
                            }
                        } else {
                            this.$alert(json.message)
                        }
                    })
                    .catch(_ => {
                        this.loading = false
                    })
            },
            cancelHandle() {
                this.$emit('close-modal')
            }
        }
    }
</script>
