<template>
    <div class="mu-types">
		<div class="selecteList">
			<label>类型名称：</label>
			<el-select v-model="keyName" clearable filterable @change="searchName" @visible-change='lists' placeholder="请选择">
				<el-option
				v-for="item in selectList"
				:key="item.id"
				:label="item.name + ' ' +item.cname"
				:value="item.id">
				</el-option>
			</el-select>
		</div>
		<el-table v-if="this.keyName" :data="searchData"
            border
            stripe
            style="width: 100%">
            <el-table-column prop="name"
                label="类型名称">
            </el-table-column>
            <el-table-column prop="cname"
                label="中文名称">
            </el-table-column>
            <el-table-column prop="type_key"
                label="主键">
            </el-table-column>
            <el-table-column
                label="操作" >
                <template slot-scope="scope">
                    <el-button type="text" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 102" @click="handleModify(scope.row, ele.element_id)">编辑</el-button>
                    <el-button type="text" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 101" @click="handleDelete(scope.row, ele.element_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-table v-else :data="tableData"
            border
            stripe
            style="width: 100%">
            <el-table-column prop="name"
                label="类型名称">
            </el-table-column>
            <el-table-column prop="cname"
                label="中文名称">
            </el-table-column>
            <el-table-column prop="type_key"
                label="主键">
            </el-table-column>
            <el-table-column
                label="操作" >
                <template slot-scope="scope">
                    <el-button type="text" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 102" @click="handleModify(scope.row, ele.element_id)">编辑</el-button>
                    <el-button type="text" v-for="(ele, i) in elementIds" :key="i" v-if="ele.element_code == 101" @click="handleDelete(scope.row, ele.element_id)">删除</el-button>
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
            <el-pagination v-if="!this.keyName" background
				@current-change="choosePage"
				:current-page="page"
				:page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>

        <el-dialog title="修改类型"
            :visible.sync="modifyModal"
            width="50%"
            :modal-append-to-body="false" >
            <modify @close-modal="closeModify" :ele-id="eleId" :menu-id="menuId" :modify-data="modifyData"></modify>
        </el-dialog>

        <el-dialog title="添加类型"
            :visible.sync="addModal"
            width="50%"
            :modal-append-to-body="false" >
            <add @close-modal="closeAdd" :ele-id="eleId" :menu-id="menuId"></add>
        </el-dialog>
    </div>
</template>
<style lang="less">
.mu-types {
    .types-bottom {
        margin-top: 20px;
    }
    .types-bottom .el-button {
        padding: 5px 10px;
        border-radius: 0;
    }
    .el-input__icon {
        line-height: 1;
	}
	.selecteList {
		margin-bottom: 20px;
	}
}
</style>

<script>
    import Add from './add'
    import Modify from './modify'
    import { list, $delete, typeSearch } from './api'

    export default {
        components: {
            Add,
            Modify
        },
        props: ['elementIds', 'menuId'],
        data() {
            return {
                modifyModal: false,
                addModal: false,
                section: 0,
                sections: [],
                tableData: [],
                total: 100,
                eleId: -1,
				modifyData: {},
				page: 1,
				pageSize: 15,
				keyName: '',
				selectList: [],
				searchData: []
            }
        },
        created() {
			this.getList()
			this.alllist()
        },
        methods: {
			choosePage(current) {
				this.getList(current)
			},
            handleModify(row, eleId) {
                this.modifyModal = true
                this.eleId = eleId
                this.modifyData = row
            },
            handleDelete(row, ele) {
                this.$confirm('确定要删除该类型吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    $delete({
                        ids: String(row.id)
                    }, {
                        menu: this.menuId,
                        ele
                    }).then(json => {
                        if(json.code == 200) {
                            this.$notify({
                                type: 'success',
                                message: '删除成功!'
							})
							if(this.keyName) {
								let lits = this.searchData.filter(e=> e.id != row.id)
								this.searchData = lits
							}

							this.getList()
                        }
                    })

                })
            },
            closeModify() {
                this.modifyModal = false
				this.getList()
				if(this.keyName) {
					this.alllist(1)

				}
            },
            closeAdd() {
                this.addModal = false
                this.getList()
            },
            addTypes(val) {
                this.addModal = true
                this.eleId = val
            },
            getList(current) {
				if(current) {
					this.page = current
				}
                list({
					page: this.page
				}, {
                    menu: this.menuId
                }).then(json => {
                    if(json.code == 200) {
						if(json.result.length <= 0 && this.page >1) {
							this.page=this.page-1
							this.getList()
						} else {
							this.tableData = json.result
							if(json.result_info) {
								this.pageSize = json.result_info.per_page
								this.total = json.result_info.total
							}
						}
                    }
                })
			},
			alllist(val) {
				list({all:'yes'},{menu:this.menuId}).then(body=> {
					if(body.code == 200) {
						this.selectList = body.result
						if(val) {
							this.searchName()
						}
					}
				})
			},
			searchName() {
				let name = this.selectList.filter(e=> e.id == this.keyName)
				this.searchData = name
			},
			lists(val) {
				if(val) {
					this.alllist()
				}
			}
        }
    }
</script>
