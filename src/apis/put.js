/* eslint-disable */
import { _put } from './apis'

const put = _put
import { USER_ROOT, SERVER_ROOT,WARN_ROOT } from './config'

/**
 * 修改用户
 * @param {*} params
 */
export function modifyUser(params, query) {
    return put(USER_ROOT + '/service/user', params, query)
}

/**
 * 修改角色
 * @param {*} params
 */
export function modifyRole(params, query) {
    return put(USER_ROOT + '/service/role', params, query)
}

/**
 * 修改服务器
 */
export function modifyServer(params, query) {
    return put(SERVER_ROOT + '/service/server_info', params, query)
}

/**
 * 修改菜单
 */
export function modifyMenu(params = {}, query) {
    return put(USER_ROOT + '/service/menu', params, query)
}

/**
 * 修改元素
 */
export function modifyElement(params = {}, query) {
    return put(USER_ROOT + '/service/element', params, query)
}

/**
 * 修改平台信息
 */
export function modifyPlatform(params = {}, query) {
    return put(SERVER_ROOT + '/service/game/platform/info', params, query)
}

/**
 * 修改标签信息
 */
export function modifyServerTag(params = {}, query) {
    return put(SERVER_ROOT + '/service/server_target', params, query)
}

/**
 * 禁用服务器预警规则
 */
export function putRuleDisbale(params = {}, query) {
    return put(WARN_ROOT + '/service/rule_disable', params, query)
}

/**
 * 修改服务器预警规则
 */
export function putRuleEdit(params = {}, query) {
    return put(WARN_ROOT + '/service/rule_edit', params, query)
}

/**
 * 修改密码
 */
export function putPassword(params = {}, query) {
    return put(USER_ROOT + '/service/user/password', params, query)
}

/**
 * 刷新token
 */
export function freshToken(params, query) {
    return put(USER_ROOT + '/service/auth/token', params, query)
}

/**
 * 修改资源
 */
export function modifyRes(params, query) {
    return put(USER_ROOT + `/service/resource`, params, query)
}