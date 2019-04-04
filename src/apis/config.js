//端口
const PORTS = {
    USER_ROOT: 0, //用户相关
    PERM_ROOT: 1, //权限相关
    SERVER_ROOT: 2, //服务器相关
    QUFU_SOCKET_ROOT: 3, //区服socket
    QUFU_ROOT: 4, //区服
    WARN_ROOT: 5, //预警
    INSTALL_ROOT: 6, //应用部署
    INSTALL_SOCKET_ROOT: 7, //应用部署socket,
    GAME_ROOT: 8, //游戏相关接口
}

//测试地址
const TEST_HOST = ''
//正式地址
const PROD_HOST = ''

//测试socket地址
const TEST_SOCKET_HOST = ''
//正式socket地址
const PROD_SOCKET_HOST = ''

const VERSION = 'v1'

//用户相关
export const USER_ROOT = process.env.NODE_ENV !== 'production' ? `${TEST_HOST}:${PORTS.USER_ROOT}/${VERSION}` : `${PROD_HOST}:${PORTS.USER_ROOT}/${VERSION}`
//权限
export const PERM_ROOT = process.env.NODE_ENV !== 'production' ? `${TEST_HOST}:${PORTS.PERM_ROOT}/${VERSION}` : `${PROD_HOST}:${PORTS.PERM_ROOT}/${VERSION}`
//服务器
export const SERVER_ROOT = process.env.NODE_ENV !== 'production' ? `${TEST_HOST}:${PORTS.SERVER_ROOT}/${VERSION}` : `${PROD_HOST}:${PORTS.SERVER_ROOT}/${VERSION}`
//区服socket
export const QUFU_SOCKET_ROOT = process.env.NODE_ENV !== 'production' ? `${TEST_SOCKET_HOST}:${PORTS.QUFU_SOCKET_ROOT}` : `${PROD_SOCKET_HOST}:${PORTS.QUFU_SOCKET_ROOT}`
//区服
export const QUFU_ROOT = process.env.NODE_ENV !== 'production' ? `${TEST_HOST}:${PORTS.QUFU_ROOT}/${VERSION}` : `${PROD_HOST}:${PORTS.QUFU_ROOT}/${VERSION}`
//预警
export const WARN_ROOT = process.env.NODE_ENV !== 'production' ? `${TEST_HOST}:${PORTS.WARN_ROOT}/${VERSION}` : `${PROD_HOST}:${PORTS.WARN_ROOT}/${VERSION}`
//应用部署
export const INSTALL_ROOT = process.env.NODE_ENV !== 'production' ? `${TEST_HOST}:${PORTS.INSTALL_ROOT}/${VERSION}` : `${PROD_HOST}:${PORTS.INSTALL_ROOT}/${VERSION}`
//应用部署socket
export const INSTALL_WS_ROOT = process.env.NODE_ENV !== 'production' ? `${TEST_SOCKET_HOST}:${PORTS.INSTALL_SOCKET_ROOT}` : `${PROD_SOCKET_HOST}:${PORTS.INSTALL_SOCKET_ROOT}`
//**订餐
export const DC_ROOT = process.env.NODE_ENV !== 'production' ? `${TEST_HOST}:19999/${VERSION}` : `${PROD_HOST}:10010/${VERSION}`
//平台管理
export const GAME_ROOT = process.env.NODE_ENV !== 'production' ? `${TEST_HOST}:${PORTS.GAME_ROOT}/${VERSION}` : `${PROD_HOST}:${PORTS.GAME_ROOT}/${VERSION}`
