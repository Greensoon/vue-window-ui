<template>
    <div class="">
        <el-form inline :model="searchForm" label-width="80px">
            <el-form-item label="原平台">
                <el-select filterable v-model="searchForm.current_platform" placeholder="请选择平台" @change="changePlatform('current')">
                    <el-option v-for="(item, i) in current_platforms" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="原分区">
                <!-- <el-select filterable v-model="searchForm.current_section" placeholder="请选择分区">
                    <el-option v-for="(item, i) in current_sections" :key="i" :label="item.name" :value="item.id"></el-option>
                </el-select> -->
                <mu-select :options="current_sections" v-model="searchForm.current_section"></mu-select>
            </el-form-item>
        </el-form>
        <el-form inline :model="searchForm" label-width="80px">
            <el-form-item label="目标平台">
                <el-select filterable v-model="searchForm.target_platform" placeholder="请选择平台" @change="changePlatform('target')">
                    <el-option v-for="(item, i) in target_platforms" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="目标分区">
                <!-- <el-select filterable v-model="searchForm.target_section" placeholder="请选择分区">
                    <el-option v-for="(item, i) in target_sections" :key="i" :label="item.name" :value="item.id"></el-option>
                </el-select> -->
                <mu-select :options="target_sections" v-model="searchForm.target_section"></mu-select>
            </el-form-item>
        </el-form>

        <div>
            <el-button type="primary" @click="compareFN(item.element_id)" v-for="(item, i) in elementIds" :key="i" v-if="item.element_code == 134">迁移</el-button>
        </div>

        <el-dialog title="文件列表" :visible.sync="fileVisible" :fullscreen="true" :modal="false">
            <el-table :data="compare_files" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column property="type_name" label="配置类型名称"></el-table-column>
                <el-table-column label="类型" ><template slot-scope="scope"><span :style="{color: scope.row.mark == 'add' ? 'blue' : 'green'}">{{scope.row.mark == 'edit' ? '编辑': '添加'}}</span></template></el-table-column>
            </el-table>

            <div :style="{marginTop: '20px'}"><el-button type="primary" @click="moveAction(item.element_id)"  v-for="(item, i) in elementIds" :key="i" v-if="item.element_code == 134">迁移</el-button><el-button @click="fileVisible = false">取消</el-button></div>
        </el-dialog>

    </div>
</template>

<script>
    import gpMixins from '../game-platform.mixins'
    import { list, compareFn, moveFn } from './api'
    import arrowDown from '../../../assets/img/icon-arrow-down.png'

    export default {
        mixins: [gpMixins],
        props: ['menuId', 'elementIds'],
        data() {
            return {
                searchForm: {
                    current_platform: '',
                    current_section: '',
                    target_platform: '',
                    target_section: ''
                },
                current_platforms: [],
                target_platforms: [],
                current_sections: [],
                target_sections: [],
                arrowDown,

                compare_files: [],
                fileVisible: false,
                columns: [],
                tempEle: -1,
            }
        },
        watch: {
            platforms(val) {
                this.current_platforms = [...val]
                this.target_platforms = [...val]
            },
            fileVisible() {
                this.columns = []
            }
        },
        methods: {
            // changeCurrentSection(val) {
            //     this.searchForm.current_section = val
            // },
            // changeTargetSection(val) {
            //     this.searchForm.target_section = val
            // },
            handleSelectionChange(vals) {
                this.columns = vals.map(e => e.id)
            },
            getList(val, callback) {
                return list({
                    game_id: this.GAME_ID,
                    platform_id: val,
                    all: 'yes'
                }).then(json => {
                    if(json.code == 200) {
                        callback && callback(json.result)
                    }
                })
            },
            changePlatform(type) {
                var $p = type == 'target' ? this.searchForm.target_platform : this.searchForm.current_platform
                if(type == 'target' && this.searchForm.target_section) {
                    this.searchForm.target_section = ''
                }
                if(type == 'current' && this.searchForm.current_section) {
                    this.searchForm.current_section = ''
                }
                this.getList($p, data => {
                    if(type == 'current') {
                        this.current_sections = data
                    } else {
                        this.target_sections = data
                    }
                })
            },
            compareFN(v) {
                var params = Object.assign({game_id: this.GAME_ID}, this.searchForm)
                this.tempEle = v
                compareFn(params, {menu: this.menuId, ele: v})
                    .then(json => {
                        if(json.code == 200) {
                            this.fileVisible = true
                            this.compare_files = Object.values(json.result)
                        }
                    })
            },
            moveAction(id) {
                if(!this.columns.length) {
                    this.$message.error('请选择要迁移的数据')
                    return false
                }

                const params = Object.assign({config_ids: this.columns.join(','), game_id: this.GAME_ID}, this.searchForm)
                moveFn(params, {menu: this.menuId, ele: this.tempEle})
                    .then(json => {
                        if(json.code == 200) {
                            this.$message.success('迁移成功')
                            this.fileVisible = false
                        }
                    })
            }
        }
    }
</script>
