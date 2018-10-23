<template>
    <div class="section-add">
        <el-form label-width="80px" :model="addSection">
            <!-- <el-form-item label="游戏">
                <el-select @change="changeGame" disabled v-model="addSection.game_id" width="200">
                    <el-option v-for="(item, i) in games" :key="i" :label="item.cname" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="平台">
                <el-select v-model="addSection.platform_id" disabled width="200">
                    <el-option v-for="(item, i) in platforms" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="分区类型">
                <el-select v-model="addSection.type" width="200">
                    <el-option v-for="(item, i) in types" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="addSection.name" width="200"></el-input>
            </el-form-item>
            <el-form-item label="分区描述">
                <el-input width="200" type="textarea" :rows="2" v-model="addSection.description"></el-input>
            </el-form-item>

            <el-form-item >
                <el-button type="primary" @click="saveSection">确定</el-button>
                <el-button @click="closeModal">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style lang="less">
.section-add {
    .el-input__inner,
    .el-textarea__inner {
        width: 260px;
    }
}
</style>

<script>
    const types = [{
        name: '测试分区',
        value: 0
    }, {
        name: '正式分区',
        value: 1
    }]
    import gpMixins from '../game-platform.mixins'

    import { add } from './api'

    export default {
        mixins: [gpMixins],
        data() {
            return {
                addSection: {
                    name: '',
                    description: '',
                    game_id: this.game,
                    platform_id: this.plaf,
                    type: 0
                },
                types
            }
        },
		props: ['eleId', 'menuId','game','plaf'],
		watch: {
			game: {
				handler(newv) {
					this.addSection.game_id = newv
				},
				deep: true
			},
			plaf: {
				handler(newv) {
					this.addSection.platform_id = newv
				},
				deep: true
			},
		},
        methods: {
            closeModal() {
                this.$emit('close-modal')
            },
            changeGame(v) {
                this.platforms = this.handleData(v, this.games, this.platformData)
                this.addSection.platform_id = this.platforms[0] ? this.platforms[0].value : ''
            },
            saveSection() {
                var msg = []
                if(!this.addSection.name) {
                    msg.push('平台名字不能为空')
                }

                if(this.addSection.type == undefined) {
                    msg.push('类型必须选择')
                }

                if(msg.length) {
                    this.$message.error(msg.shift())
                    return false
                }
                add(this.addSection, {menu: this.menuId, ele: this.eleId})
                    .then(json => {
                        if(json.code == 200) {
                            this.$notify({
                                type: 'success',
                                message: '添加成功'
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
