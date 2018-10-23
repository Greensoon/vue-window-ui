/* eslint-disable */
import { _delete } from './apis'

const deleteAction = _delete
import { USER_ROOT, SERVER_ROOT, WARN_ROOT } from './config'

/**
 * 删除用户
 * @param {*} params
 */
export function deleteUser(params, query) {
    return deleteAction(USER_ROOT + '/service/user', params, query)
}

/**
 * 删除角色
 * @param {*} params
 */
export function deleteRole(params, query) {
    return deleteAction(USER_ROOT + '/service/role', params, query)
}

/**
 * 删除服务器
 */
export function deleteServer(params = {}, query) {
    return deleteAction(SERVER_ROOT + '/service/server_info', params, query)
}

/**
 * 删除菜单
 */
export function deleteMenu(params = {}, query) {
    return deleteAction(USER_ROOT + '/service/menu', params, query)
}

/**
 * 删除元素
 */
export function deleteElement(params = {}, query) {
    return deleteAction(USER_ROOT + '/service/element', params, query)
}

/**
 * 删除服务器标签
 */
export function deleteTag(params = {}, query) {
    return deleteAction(SERVER_ROOT + '/service/server_target', params, query)
}

/**
 * 删除平台信息
 */
export function deletePlatform(params = {}, query) {
    return deleteAction(SERVER_ROOT + '/service/game/platform/info', params, query)
}

/**
 * 删除服务器预警规则
 */
export function delRuleDisbale(params = {}, query) {
    return deleteAction(WARN_ROOT + '/service/rule_del', params, query)
}

/**
 * 删除资源
 */
export function deleteRes(params = {}, query) {
    return deleteAction(USER_ROOT + '/service/resource', params, query)
}