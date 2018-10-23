<template>
    <div class="mu-server-modify">
        <el-form label-width="110px" :model="modalData" >
            <el-form-item label="服务器用户名 :">
                <el-input v-model="modalData.user_name"></el-input>
            </el-form-item>
            <el-form-item label="服务器密码 :">
                <el-input type="password" v-model="modalData.password"></el-input>
            </el-form-item>
            <el-form-item label="服务器端口 :">
                <el-input v-model="modalData.port"></el-input>
            </el-form-item>
            <el-form-item label="外网ip :">
                <el-input v-model="modalData.extranet_ip"></el-input>
            </el-form-item>

            <el-form-item label="游戏:">
                <el-select v-model="modalData.game" @change="chooseGame" placeholder="请选择游戏">
					<el-option v-for="(item, i) in games"
						:key="i"
						:label="item.cname"
						:value="item.id" >
					</el-option>
				</el-select>
            </el-form-item>

            <el-form-item label="平台:">
                <el-select v-model="modalData.platform" :disabled="platforms.length == 0" placeholder="请选择平台">
					<el-option
						v-for="(item, i) in platforms"
						:key="i"
						:label="item.name"
						:value="item.value" >
					</el-option>
				</el-select>
            </el-form-item>

            <el-form-item label="机器名 :">
                <el-input v-model="modalData.machine_name"></el-input>
            </el-form-item>

            <el-form-item label="域名 :">
                <el-input v-model="modalData.domain_name"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="modifyServer" type="primary" :loading="loading">修改</el-button>
                <el-button @click="closeModal">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { modifyServer } from '../../apis/put'
    import { getServers} from '../../apis/get'
    import gpMixins from '../game-platform.mixins'

    export default {
        props: ['checkId', 'eleData'],
        mixins: [gpMixins],
        data() {
            return {
                keys: [],
                modalData: {
                    user_name: '',
                    password: '',
                    port: '',
                    intranet_ip: '',
                    extranet_ip: '',
                    game: '',
                    platform: '',
                    acc: ''
                },
                serverId: this.checkId,
                loading: false,
                gameList: [],
				eledatas: this.eleData||{}
            }
        },
        watch: {
            checkId(newv) {
                this.serverId = newv
                this.getServer()
            }
        },
        created() {
            this.getServer()
        },
        methods: {
            getServer() {
                this.loading = true
                return getServers({
                        all_info: 'no',
                        server_id: this.serverId
                    }, {menu: this.eledatas.menu_id}
                )
                .then(json => {
                    this.loading = false
                    if(json.code == 200) {
                        var d = json.result[0]
                        this.modalData = {
                            user_name: d.user_name,
                            password: d.password,
                            port: d.port,
                            extranet_ip: d.extranet_ip,
                            game: Number(d.game),
                            platform: d.platform,
                            machine_name: d.machine_name,
                            domain_name: d.domain_name
                        }
                    }
                })
            },
            modifyServer() {
                this.modalData.server_id = this.serverId
                 for(var i in this.modalData) {
                    if(!this.modalData[i] && i != 'domain_name' && i != 'game' && i != 'platform' && i != 'password') {
                        this.$message.error('资料不能为空')
                        return false
                    }
				}
                modifyServer(this.modalData, {menu: this.eledatas.menu_id, ele: this.eledatas.element_id })
                    .then(json => {
                        if(json.code == 200) {
                            this.closeModal()
                            this.$notify({
                                message: '修改成功',
                                type: 'success'
                            })
                            this.$emit('fresh')
                        } else {
                            this.$message.error(json.message)
                        }
                    })
            },
            closeModal() {
                this.$emit('close-modal')
            },
            chooseGame(val) {
                this.platforms = this.handleData(val, this.games, this.platformData)
                if(!this.platforms.length) {
                    this.modalData.platform = ''
                }
            }
        }
    }
</script>
<style lang="less">
.mu-server-modify {
    .mu-monitor-panel__title {
        height: 45px;
    }

    li {
        padding: 5px 10px;
        border-bottom: 1px solid #ccc;

        &:last-child {
            border-bottom: 0;
        }

        > span {
            &:first-child {
                width: 120px;
                display: inline-block;
                text-align: right;
                padding-right: 10px;
            }

            input {
                width: 300px;
            }
        }
    }

    .mu-server-modify-btns {
        margin-top: 10px;
    }

    .el-input__inner {
        height: 30px!important;
        line-height: 30px;
        border-radius: 0;
    }
    .el-select {
        width: 100%;
        height: 30px!important;
    }
    .el-form-item__content {
        margin-left: 125px!important;
    }
    .el-form {
        width: 80%;
        margin: auto;
    }
}
</style>
