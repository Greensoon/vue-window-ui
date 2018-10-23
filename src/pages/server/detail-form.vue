<template>
    <div class="detail-form">
        <el-form label-width="60px" inline :model="detailForm">
            <el-form-item label="机器名">
                <el-input v-model.trim="detailForm.machine_name" clearable placeholder="请输入机器名"></el-input>
            </el-form-item>
            <el-form-item label="域名">
                <el-input v-model.trim="detailForm.domain_name" clearable placeholder="请输入域名"></el-input>
            </el-form-item>
            <el-form-item label="外网ip">
                <el-input v-model.trim="detailForm.extranet_ip" clearable placeholder="请输入外网ip"></el-input>
            </el-form-item>
            <el-form-item label="内网ip">
                <el-input v-model.trim="detailForm.intranet_ip" clearable placeholder="请输入内网ip"></el-input>
            </el-form-item>
            <el-form-item label="cpu信息">
                <el-input v-model.trim="detailForm.cpu" clearable placeholder="请输入cpu信息"></el-input>
            </el-form-item>
            <el-form-item label="实例名称">
                <el-input v-model.trim="detailForm.instance_name" clearable placeholder="请输入实例名称"></el-input>
            </el-form-item>
			<el-form-item label="内存">
				<el-select v-model="detailForm.memory" clearable placeholder="请选择内存">
					<el-option
						v-for="item in memoryList"
						:key="item"
						:label="`${item}GB`"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
            <el-form-item label="游戏">
                <el-select v-model="detailForm.game" @change="chooseGame" placeholder="请选择游戏">
					<el-option
						v-for="(item, i) in games"
						:key="i"
						:label="item.cname"
						:value="item.id"
                    >
					</el-option>
				</el-select>
            </el-form-item>
            <el-form-item label="平台">
                <el-select v-model="detailForm.platform" :disabled="platforms.length == 0" placeholder="请选择平台">
					<el-option
						v-for="(item, i) in platforms"
						:key="i"
						:label="item.name"
						:value="item.value"
                    >
					</el-option>
				</el-select>
            </el-form-item>

            <div class="detail-form-bottom">
                <el-button type="primary" @click="search" class="detail-form-btn">搜索</el-button>
                <el-button @click="clear" class="detail-form-cancel">清除</el-button>
            </div>
        </el-form>
    </div>
</template>
<style lang="less">
.detail-form {
    padding-top: 20px;
    margin-bottom: 20px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;

    .el-input__inner {
        height: 30px!important;
        line-height: 30px;
        border-radius: 0;
        font-size: 12px;
		padding-right:15px !important;

    }

    .el-form-item__label {
        font-size: 12px ;
        white-space: nowrap;
    }

    .el-form-item {
        margin-bottom: 10px;
    }

    .detail-form-btn,
    .detail-form-cancel {
        border-radius: 0;
        padding: 8px 15px;
        font-size: 12px;
    }

    .detail-form-bottom {
        margin: 0 0 20px;
    }
}
</style>

<script>
    import { getGameInfo } from '../../apis/get'
    import gpMixins from '../game-platform.mixins'

    export default {
        props:['menuid'],
        mixins: [gpMixins],
        data() {
            return {
                detailForm: {
					machine_name: '',
					domain_name: '',
					extranet_ip: '',
					intranet_ip: '',
					cpu: '',
					instance_name: '',
					memory: '',
					game: '',
                    platform: '',

				},
                memoryList:[4, 8, 16],
                platformFlag: true,
            }
        },
        watch: {
            GAME_ID(val) {
                this.detailForm.game = val
            }
        },
        methods: {
            search() {
				this.$emit('search-action', this.detailForm)
            },
            clear() {
                this.detailForm = {
					machine_name: '',
					domain_name: '',
					extranet_ip: '',
					intranet_ip: '',
					cpu: '',
					instance_name: '',
					memory: '',
					game: '',
					platform: ''
                }
                this.platformList = []
				this.$emit('search-action', this.detailForm)
            },
            chooseGame(v) {
                this.detailForm.game = v
                this.platforms = this.handleData(v, this.games, this.platformData)
            }
        }
    }
</script>
