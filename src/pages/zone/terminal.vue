<template>
    <div class="zone-terminal">
        <ul class="zone-exec-list">
            <li v-for="(obj, i) in servers" :key="i">
                <span>{{obj.game_name}}</span>
                <span v-if="obj.status < 1">待执行</span>
                <span v-if="obj.status == 1 "><i class="el-icon-loading"></i>执行中</span>
                <span class="success" v-if="obj.status == 2">执行成功</span>
                <span class="danger" v-if="obj.status == 3">执行失败</span>
            </li>
            <div class="code-result shell" v-html="code" id="code"></div>
        </ul>
        <div class="zone-bottom-btns">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="exec" :loading="loading">{{reExecFlag ? '重新执行' : '执行'}}</el-button>
        </div>
    </div>
</template>
<style lang="less">
.zone-exec-list {
    li {
        display: flex;
        justify-content: space-between;
    }

    padding-bottom: 20px;
}

.zone-bottom-btns {
    text-align: right;
}

.zone-terminal {
    .success {
        color: #67c23a;
    }

    .danger {
        color: #f56c6c;
    }
}

.code-result {
    color: #fff;
    padding: 20px;
    margin-top: 20px;
    height: 200px;
    overflow: auto;
}

</style>

<script>
    import { qfOperation } from '../../apis/post'
    import socket from '../../apis/socket'
    import { QUFU_SOCKET_ROOT } from '../../apis/config'

    export default {
        props: ['data', 'type', 'method', 'elementId', 'menuId'],
        data() {
            var _servers = this.data.servers.map(e => {
                e.status = -1
                return e
            })
            return {
                loading: false,
                servers: _servers,
                isStopSc: false,
                reExecFlag: false,
                code: '',
                typeVal: this.type == 'close' ? 2 : this.type == 'open' ? 1 : 3
            }
        },
        watch: {
            data: {
                handler(newv) {
                    this.loading = false
                    this.servers = newv.servers.map(e => {
                        if(e.status == undefined) {
                            e.status = -1
                        }
                        return e
                    })
                },
                deep: true
            }
        },
        methods: {
            close() {
                this.isStopSc = true
                this.loading = false
                this.reExecFlag = false
                this.$emit('close')
            },
            exec() {
                this.loading = true

                this.servers.forEach(e => {
                    e.status = 1
                })
                
                var params = this.data.servers.map(e => {
                    return e.id
                })

                qfOperation({method: this.method, operation: this.typeVal, id: params}, {menu: this.menuId, ele: this.elementId})
                    .then(json => {
                        if(json.code == 200) {
                            this.code = '<p>执行马上开始</p>'
                            this.socketConnect()
                        }
                    })
            },
            divScroll() {
                var div = document.querySelector('#code')
                div.scrollTop = div.scrollHeight
            },
            socketConnect() {
                var _this = this
                socket.init(QUFU_SOCKET_ROOT)
                socket.send(null, (e) => {
                    console.log(' socket is connecting .... ')
                    if(e.data) {
                        var _text = JSON.parse(e.data)
                        if(_text) {
                            this.code += `<p>${_text.result.info}</p>`
                            if(_text.code == 200) {
                                this.handleData(_text.result)
                            }
                            this.handleResult()
                            this.divScroll()
                        } else {
                            this.loading = false
                            socket.close()
                        }
                    }
                }, function() {
                    _this.code += '<p>socket连接失败</p>'
                })
            },
            handleData(data) {
                this.servers.forEach(e => {
                    if(e.id == data.id) {
                        e.status = data.status == 1 ? 2 : 3
                    }
                })
            },
            handleResult() {
                var _filters = this.servers.filter(e => e.status > 1)
                if(_filters.length == this.servers.length) {
                    this.loading = false
                }
            },
        }
    }
</script>
