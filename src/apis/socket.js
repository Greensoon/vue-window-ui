
// import { SOCKET_ROOT } from './config'
var ws = null
var connected = false
import Vue from 'vue'
var url = ''

var open = function(url) {
    try {
        if(!ws) {
            ws = new WebSocket(url)
            ws.onopen = onOpen
            ws.onclose = onClose
            ws.onerror = onError
        }
    } catch (e) {
        console.log(' ==================>>>>> socket something wrong, but it is ok :', e)
    }
    
}

// var close = function() {
//     if (ws) {
//         console.log('CLOSING ...')
//         ws.close()
//     }
//     connected = false
// }

var onOpen = function() {
    connected = true
    console.log('OPENED ....... ')
}

var onClose = function() {
    console.log('CLOSED: ')
    connected = false
    ws = null
}

var onError = function(event) {
    // alert(event.data)
    console.log(' something wrong occurs ', event)
}
export default {
    init(socket_root) {
        // close()
        url = socket_root
        open(socket_root)
    },
    send(params, message, error) {
        var _this = this
        var _count = 0
        var fn = function() {
            if(!connected || !ws) {
                setTimeout(function() {
                    console.log('tring to connect ws ... ')
                    if(_count <= 10) {
                        _this.init(url)
                        _count += 1
                        fn()
                    } else {
                        Vue.prototype.$message.error('socket 连接超时')
                        error && error()
                    }
                }, 2000)
            }

            if(connected && ws) {
                ws.send(params)
                ws.onmessage = function(data) {
                    message && message(data)
                }
            }
        }
        //先连接
        fn()
    },
    close() {
        if(ws) {
            ws.close()
            ws = null
        }
        connected = false
    }
}
