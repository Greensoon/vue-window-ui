<template>
    <div class="section-modify">
        <el-form label-width="80px" :model="modifySection">
            <el-form-item label="游戏">
                <el-select @change="changeGame" v-model="modifySection.game_id" width="200">
                    <el-option v-for="(item, i) in games" :key="i" :label="item.cname" :value="String(item.id)"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="平台">
                <el-select v-model="modifySection.platform_id" width="200">
                    <el-option v-for="(item, i) in platforms" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分区类型">
                <el-select v-model="modifySection.type" width="200">
                    <el-option v-for="(item, i) in types" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="modifySection.name" class="wid-200"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="modifySection.status" width="200">
                    <el-option v-for="(item, i) in statuses" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分区描述">
                <el-input width="200" type="textarea" :rows="2" v-model="modifySection.description"></el-input>
            </el-form-item>

            <el-form-item >
                <el-button type="primary" @click="updateSection">确定</el-button>
                <el-button @click="closeModal">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style lang="less">
.wid-200 {
    input {
        width: 190px;
    }
}
</style>

<script>
    import { update } from './api'
    import gpMixins from '../game-platform.mixins'
    const types = [{
        name: '测试分区',
        value: 0
    }, {
        name: '正式分区',
        value: 1
    }]

    const statuses = [{
        name: '有效',
        value: '1',
    }, {
        name: '无效',
        value: '2'
    }]
    export default {
        mixins: [gpMixins],
        props: ['modifyData', 'eleId', 'menuId'],
        data() {
            return {
                modifySection: {
                    name: this.modifyData.name,
                    description: this.modifyData.description,
                    game_id: this.modifyData.game_id,
                    platform_id: this.modifyData.platform_id,
                    type: Number(this.modifyData.type),
                    id: this.modifyData.id,
                    status: this.modifyData.status,
                },
                types,
                statuses,
            }
        },
        watch: {
            modifyData: {
                handler(val) {
                    this.modifySection = {
                        name: val.name,
                        description: val.description,
                        game_id: val.game_id,
                        platform_id: val.platform_id,
                        type: Number(val.type),
                        status: String(val.status),
                        id: val.id
                    }
                },
                deep: true
            }
        },
        methods: {
            changeGame(v) {
                this.platforms = this.handleData(v, this.games, this.platformData)
                this.modifySection.platform_id = this.platforms[0] ? this.platforms[0].value : ''
            },
            closeModal() {
                this.$emit('close-modal')
            },
            updateSection() {
                var msg = []
                if(!this.modifySection.name) {
                    msg.push('平台名字不能为空')
                }

                if(this.modifySection.type == undefined) {
                    msg.push('类型必须选择')
                }

                if(msg.length) {
                    this.$message.error(msg.shift())
                    return false
                }

                update(this.modifySection, {
                    menu: this.menuId,
                    ele: this.eleId
                }).then(json => {
                    if(json.code == 200) {
                        this.$notify.success({
                            message: '修改成功'
                        })
                        this.$emit('close-modal')
                    }
                })
            }
        }
    }
</script>