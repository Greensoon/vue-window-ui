<template>
    <div :class="`mu-user-${modalType}`">
        <div :class="`mu-user-${modalType}-wrap`">
            <monitor-panel title="角色信息">
                <ul class="">
                    <li >
                        <span>角色名称:</span>
                        <span>
                            <input v-if="modalType == 'modify'" v-model="modalData.name" >
                            <span v-else>{{modalData.name}}</span>
                        </span>
                    </li>
                    <li >
                        <span>角色描述:</span>
                        <span>
                            <input v-if="modalType == 'modify'" v-model="modalData.desc" >
                            <span v-else>{{modalData.desc}}</span>
                        </span>
                    </li>
                </ul>
            </monitor-panel>

            <div class="mu-user-modify-btns" v-if="modalType == 'modify'">
                <el-button type="primary" @click="modifyRole">确认</el-button>
                <el-button @click="closeModal">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import { modifyRole } from '../../apis/put'

    export default {
        props: ['modalType', 'checkId', 'modalData', 'menuId', 'elementId'],
        data() {
            return {
                keys: [],
                modifyKeys: ['role_id', 'name', 'desc']
            }
        },
        watch: {
            modalType() {
                this.dataHandle()
            }
        },
        created() {
            this.dataHandle()
        },
        methods: {
            dataHandle() {
                if(this.modalType == 'modify') {
                    delete this.modalData.update_time
                    delete this.modalData.create_time
                    delete this.modalData.status
                }
                this.keys = Object.keys(this.modalData)
            },
            getKeys(key) {
                var keys = {
                    name: '角色名字',
                    desc: '角色描述',
                    status: '状态',
                    create_time: '创建时间',
                    update_time: '更新时间'
                }
                return keys[key]
            },
            modifyRole() {
                for(var i in this.modalData) {
                    if(this.modifyKeys.indexOf(i) < 0) {
                        delete this.modalData[i]
                    }
                }

                modifyRole(
                    {
                        role_id: this.modalData.role_id,
                        role_name: this.modalData.name,
                        role_desc: this.modalData.desc
                    }, {
                        menu: this.menuId,
                        ele: this.elementId
                    })
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
            }
        }
    }
</script>
<style lang="less">
.mu-user-check,
.mu-user-modify {
    .mu-monitor-panel__title {
        height: 45px;
    }

    li {
        padding: 5px 10px;
        border-bottom: 1px solid #ccc;

        &:last-child {
            border-bottom: 0;
        }

        >span {
            &:first-child {
                width: 100px;
                display: inline-block;
            }

            input {
                width: 300px;
            }
        }
    }

    .mu-user-modify-btns {
        margin-top: 10px;
    }
}
</style>
