<template>
    <div class="platform-modify">
        <el-form label-width="80px" :model="platformModify">
            <el-form-item label="平台名称">
                <el-input v-model="platformModify.cname"></el-input>
            </el-form-item>
            <el-form-item label="别名">
                <el-input v-model="platformModify.alias"></el-input>
            </el-form-item>
            <el-form-item label="服务器地址">
                <el-input v-model="platformModify.extranet_ip"></el-input>
            </el-form-item>
            <el-form-item label="服务器端口号">
                <el-input v-model="platformModify.port"></el-input>
            </el-form-item>
            <el-form-item label="游戏">
                <el-select v-model="platformModify.game_id" placeholder="请选择">
                    <el-option v-for="item in games"
                        :key="item.value"
                        :label="item.name"
                        :value="String(item.value)">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item >
                <el-button type="primary" @click="update">确定</el-button>
                <el-button @click="closeModal">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    const games = [{
        name: '作妖计',
        value: 1
    }, {
        name: '热血武道会',
        value: 2
    }];
    import { update } from './api'
    export default {
        props: ['data', 'eleId', 'menuId'],
        data() {
            return {
                games,
                platformModify: {
                    game_id: this.data.game_id,
                    cname: this.data.cname,
                    alias: this.data.alias,
                    id: this.data.id
                }
            }
        },
        watch: {
            data: {
                handler(val) {
                    this.platformModify= {
                        game_id: val.game_id,
                        cname: val.cname,
                        alias: val.alias,
                        id: val.id
                    }
                },
                deep: true
            }
        },
        methods: {
            update() {
                var msg = []
                if(!this.platformModify.cname) {
                    msg.push('平台名字不能为空')
                }

                if(!this.platformModify.alias) {
                    msg.push('别名不能为空')
                }

                if(msg.length) {
                    this.$message.error(msg.shift())
                    return false
                }
                update(this.platformModify, {menu: this.menuId, ele: this.eleId})
                    .then(json => {
                        if(json.code == 200) {
                            this.$emit('close-modal')
                        }
                    })
            },
            closeModal() {
                this.$emit('close-modal')
            }
        }
    }
</script>