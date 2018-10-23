<template>
    <div class="platform-add">
        <el-form label-width="80px" :model="addPlatform">
            <el-form-item label="平台名称">
                <el-input v-model="addPlatform.cname"></el-input>
            </el-form-item>
            <el-form-item label="别名">
                <el-input v-model="addPlatform.alias"></el-input>
            </el-form-item>
            <el-form-item label="服务器地址">
                <el-input v-model="addPlatform.extranet_ip"></el-input>
            </el-form-item>
            <el-form-item label="服务器端口号">
                <el-input v-model="addPlatform.port"></el-input>
            </el-form-item>
            <el-form-item label="游戏">
                <el-select v-model="addPlatform.game_id" placeholder="请选择">
                    <el-option v-for="item in games"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item >
                <el-button type="primary" @click="savePlatform">确定</el-button>
                <el-button @click="closeModal">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { add } from './api'
    const games = [{
        name: '作妖计',
        value: 1
    }, {
        name: '热血武道会',
        value: 2
    }]
    export default {
        data() {
            return {
                games,
                addPlatform: {
                    cname: '',
                    game_id: 1,
                    alias: '',
                    extranet_ip: '',
                    port: '',
                }
            }
        },
        props: ['eleId', 'menuId'],
        methods: {
            closeModal() {
                this.$emit('close-modal')
            },
            savePlatform() {
                var msg = []
                if(!this.addPlatform.cname) {
                    msg.push('平台名字不能为空')
                }

                if(!this.addPlatform.alias) {
                    msg.push('别名不能为空')
                }

                if(msg.length) {
                    this.$message.error(msg.shift())
                    return false
                }
                add(this.addPlatform, {menu: this.menuId, ele: this.eleId})
                    .then(json => {
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
