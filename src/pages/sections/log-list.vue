<template>
    <div class="">
        <el-table :data="tableData"
            stripe
			border
            style="width: 100%">
            <el-table-column
                prop="user_name"
                label="用户名" >
            </el-table-column>
            <el-table-column
                prop="current"
                label="当前平台分区" >
            </el-table-column>
            <el-table-column
                prop="target"
                label="目标平台分区">
            </el-table-column>
            <el-table-column label="操作时间">
                <template slot-scope="scope">{{handleDate(scope.row.time * 1000)}}</template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope"><el-button type="text" @click="checkData(scope.row)">查看</el-button></template>
            </el-table-column>
        </el-table>

        <el-pagination @current-change="handleCurrentChange"
            :current-page.sync="current"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total">
        </el-pagination>

        <el-dialog title="信息详情" stripe :visible.sync="dialogVisible" append-to-body>
            <el-table :data="gridData" border stripe>
                <el-table-column prop="type_name" label="类型名称" ></el-table-column>
                <el-table-column prop="mark" label="状态" ><template slot-scope="scope">{{scope.row.mark == 'add' ? '添加' : '编辑'}}</template></el-table-column>
            </el-table>
            <div :style="{marginTop: '20px'}">
                <el-button @click="dialogVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { logList } from './api'
    import dateMixins from '../date.mixins'
    export default {
		mixins: [dateMixins],
		props:['active'],
        data() {
            return {
                tableData: [],
                current: 1,
                pageSize: 10,
                total: 0,
                dialogVisible: false,
                gridData: [],
            }
		},
		watch:{
			active: {
				handler(newv) {
					if(newv == 'three') {
						this.getList()
					}
				},
				deep: true
			},
		},
        created() {
            this.getList()
        },
        methods: {
            handleCurrentChange(val) {
                this.current = val
                this.getList()
            },
            getList() {
                return logList({
                    page: this.current,
                    per_page: this.pageSize
                }).then(json => {
                    if(json.code == 200) {
                        this.tableData = json.result
                        this.total = json.result_info.total
                    }
                })
            },
            checkData(row) {
                this.dialogVisible = true
                this.gridData = row.data
            }
        }
    }
</script>
