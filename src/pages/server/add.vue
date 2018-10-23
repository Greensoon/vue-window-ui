<template>
    <div class="mu-server-add mu-server-modify">
        <el-form label-width="100px" :model="serverAdd" >
            <el-form-item label="服务器用户名:">
                <el-input v-model="serverAdd.user_name" palceholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="服务器密码:">
                <el-input type="password" placeholder="密码" v-model="serverAdd.password"></el-input>
            </el-form-item>
            <el-form-item label="服务器端口:">
                <el-input v-model="serverAdd.port" aria-placeholder="服务器端口"></el-input>
            </el-form-item>
            <el-form-item label="外网ip:">
                <el-input v-model="serverAdd.extranet_ip" aria-placeholder="外网ip"></el-input>
            </el-form-item>

            <el-form-item label="游戏:">
                <el-select v-model="serverAdd.game" @change="chooseGame" placeholder="请选择游戏">
					<el-option v-for="(item, i) in games"
						:key="i"
						:label="item.cname"
						:value="item.id" >
					</el-option>
				</el-select>
            </el-form-item>

            <el-form-item label="平台:">
                <el-select v-model="serverAdd.platform" :disabled="platforms.length == 0" placeholder="请选择平台">
					<el-option
						v-for="(item, i) in platforms"
						:key="i"
						:label="item.name"
						:value="item.value"
                    >
					</el-option>
				</el-select>
            </el-form-item>

            <el-form-item label="机器名:">
                <el-input v-model="serverAdd.machine_name"></el-input>
            </el-form-item>

            <el-form-item label="域名:">
                <el-input v-model="serverAdd.domain_name"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="saveHandle" type="primary" :loading="loading">保存</el-button>
                <el-button @click="cancelHandle">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style lang="less">
.mu-server-add {
    .el-form-item {
        margin-bottom: 10px;
    }

    .el-input__inner {
        height: 30px!important;
        line-height: 30px;
    }

    .el-select {
        width: 100%;
        height: 30px!important;
    }
}
</style>

<script>
    import { addServer } from '../../apis/post'
    import gpMixins from '../game-platform.mixins'

    export default {
        props:['eleData'],
        mixins: [gpMixins],
        data() {
            return {
                loading: false,
                serverAdd: {
                    user_name: '',
                    password: '',
                    port: 22,
                    extranet_ip: '',
                    game: '',
                    platform: '',
                    machine_name: '',
                    domain_name: '',
                },
                eleDatas: this.eleData || {},
                gameList: []
            }
        },
        methods: {
            saveHandle() {
                var msg = []
                if(!this.serverAdd.user_name) {
                    msg.push('用户名不能为空')
                }
                if(!this.serverAdd.password) {
                    msg.push('密码不能为空')
                }
                if(!this.serverAdd.port) {
                    msg.push('端口不能为空')
                }
                if(!this.serverAdd.extranet_ip) {
                    msg.push('外网ip不能为空')
                }
                if(!this.serverAdd.machine_name) {
                    msg.push('机器名不能为空')
                }
                if(msg.length) {
                    this.$message.error(msg.shift())
                    return false
                }
                addServer(this.serverAdd, { menu: this.eleDatas.menu_id, ele: this.eleDatas.element_id})
                    .then(json => {
                        this.loading = false
                        if(json.code == 200 ) {
                            this.$message.success('添加成功')
                            this.$emit('fresh')
                            this.$emit('close-modal')
                            this.serverAdd = {
                                user_name: '',
                                password: '',
                                port: 22,
                                extranet_ip: '',
                                game: '',
                                platform: '',
                                machine_name: '',
                                domain_name: ''
                            }
                        } else {
                            this.$message.error(json.message)
                        }
                    })
            },
            cancelHandle() {
                this.$emit('close-modal')
            },
            chooseGame(val) {
                this.platforms = this.handleData(val, this.games, this.platformData)
                if(!this.platforms.length) {
                    this.serverAdd.platform = ''
                }
            }
        }
    }
</script>
