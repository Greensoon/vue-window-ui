<template>
    <div class="">
        <div >
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="游戏">
                    <el-select @change="changeGame" filterable  v-model="formInline.game_id" placeholder="游戏">
                        <el-option v-for="(p, i) in games" :key="i" :label="p.cname" :value="p.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台">
                    <el-select @change="changePlatform" filterable  v-model="formInline.platform_id" placeholder="平台">
                        <el-option v-for="(p, i) in platforms" :key="i" :label="p.name" :value="p.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>

        <el-table :data="tableData"
            border
            stripe
            style="width: 100%">
            <el-table-column prop="name"
                label="分区名称">
            </el-table-column>
            <el-table-column prop="type"
                label="分区类型">
                <template slot-scope="scope">
                    {{scope.row.type == 0 ? '测试分区' : '正式分区'}}
                </template>
            </el-table-column>
            <el-table-column prop="description"
                label="描述">
            </el-table-column>
            <el-table-column 
                label="状态">
                <template slot-scope="scope">
                    {{scope.row.status == '1' ? '有效' : '无效'}}
                </template>
            </el-table-column>
            <el-table-column
                label="操作" >
                <template slot-scope="scope">
                    <el-button type="text" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 102" @click="handleModify(scope.row, ele.element_id)">编辑</el-button>
                    <el-button type="text" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 101" @click="handleDelete(scope.row, ele.element_id)">删除</el-button>
                    <a v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 130" :href="`${downzip}?game_id=${formInline.game_id}&platform=${formInline.platform_id}&section=${scope.row.id}&authorization=${token}`" download :style="{marginLeft: '10px'}" target="_blank">下载zip</a>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex mu-flex">
            <div>
                <el-button @click="addTypes(ele.element_id)"
                    v-for="(ele, i) in elementIds"
                    :key="i"
                    v-if="ele.element_code == 100" >
                    <i class="el-icon-plus"></i>添加
                </el-button>
            </div>
            <el-pagination background
			 	@current-change="handleCurrentChange"
                layout="total, prev, pager, next"
				:current-page="page"
				:page-size="perPage"
                :total="total">
            </el-pagination>
        </div>

        <el-dialog title="修改平台信息"
            :visible.sync="modifyModal"
            width="50%"
            :modal-append-to-body="false" >
            <modify @close-modal="closeModify" :ele-id="eleId" :menu-id="menuId" :modify-data="modifyData" ></modify>
        </el-dialog>

        <el-dialog title="添加分区信息"
            :visible.sync="addModal"
            width="50%"
            :modal-append-to-body="false" >
            <add @close-modal="closeAdd" :ele-id="eleId" :menu-id="menuId" :game="formInline.game_id" :plaf="formInline.platform_id"></add>
        </el-dialog>
    </div>
</template>

<script>
    import Add from './add'
    import Modify from './modify'
    import { list, $delete, downzip } from './api'
    import gpMixins from '../game-platform.mixins'
    import { getToken } from '../../utils/auth'

    export default {
        mixins: [gpMixins],
        props: ['menuId', 'elementIds'],
        components: {
            Add,
            Modify
        },
        data() {
            return {
                modifyModal: false,
                addModal: false,
                modifyData: {},
                total: 100,
                tableData: [],
                eleId: -1,
                formInline: {
                    game_id: -1,
                    platform_id: -1
				},
				page: 1,
                perPage: 15,
                token: encodeURIComponent(getToken()),
                downzip,
            }
        },
        watch: {
            GAME_ID(newv) {
                this.formInline.game_id = newv
            },
            platforms: {
                handler(val) {
                    this.formInline.platform_id = val[0] && val[0].value
                    if(val && val.length) {
						this.page =1
                        this.getList()
                    }
                },
                deep: true
            }
        },
        methods: {
			handleCurrentChange(val) {
				this.page = val
				this.getList()
			},
            changeGame() {
                const _tmp = this.handleData(this.formInline.game_id, this.games, this.platformData)
                if(_tmp.length) {
                    this.platforms = _tmp
                } else {
                    this.platforms = []
                }
                if(this.platforms.length) {
					this.page = 1
                    this.getList()
                }
            },
            changePlatform() {
                this.getList()
            },
            getList() {
                list({
                    game_id: this.formInline.game_id,
					platform_id: this.formInline.platform_id,
					page: this.page,
					per_page: this.perPage
                }, {menu: this.menuId})
                    .then(json => {
                    if(json.code == 200 ) {
						if(json.result.length <= 0 && this.page > 1 ) {
							this.page = this.page-1
							this.getList()
						} else {
							this.tableData = json.result
							this.total = json.result_info.total
							this.perPage = Number(json.result_info.per_page)
						}

                    }
                })
            },
            handleModify(row, eleId) {
                this.modifyModal = true
                this.eleId = eleId
                this.modifyData = row
            },
            handleDelete(row, ele) {
                this.$confirm('确定要删除该平台吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    $delete({
                        id: row.id,
                        platform_id: this.formInline.platform_id,
                        game_id: this.formInline.game_id,
                    }, {
                        menu: this.menuId,
                        ele
                    }).then(json => {
                        if(json.code == 200) {
                            this.$notify({
                                type: 'success',
                                message: '删除成功!'
                            })
                            this.getList()
                        }
                    })

                })
            },
            closeModify() {
                this.modifyModal = false
                this.getList()
            },
            closeAdd() {
                this.addModal = false
                this.getList()
            },
            addTypes(eleId) {
                var $filters = this.elementIds.filter(e => e.element_id == eleId)
                if($filters.length == 0) {
                    this.$message.error('对不起，您无此操作权限')
                    return
                }

                this.eleId = eleId
                this.addModal = true
            }
        }
    }
</script>
