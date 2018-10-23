/* eslint-disable */
import { _get } from './apis'

import {
    USER_ROOT,
    SERVER_ROOT,
    QUFU_ROOT,
    WARN_ROOT,
    INSTALL_ROOT,
    PERM_ROOT
} from './config'

const get = _get

var _p = function (data) {
    return new Promise(resolve => {
        resolve(JSON.parse(data))
    })
}

/**
 * 获取用户列表
 * @param {*} params
 */
export function getUserList() {
    // return get(USER_ROOT + '/service/user_list', params, query)
    return _p('{"code":200,"message":"OK","result":[{"user_id":"2","username":"admin","realname":"admin","salt":"8kRNrOp6uC5VBQ2q","password":"6kNPmfhduMYbBZEcDt2qxBfbLSHBAaiSzZPQ2GYGCAQ=","project_ids":["5","6"],"dept_id":"10","mobile":"13011111111","roles":["1","2","3"],"email":"","login_count":"435","last_login_ip":"36.110.89.59","status":"1","create_time":"1534234504","update_time":"1540263684"},{"user_id":"3","username":"qikeqikeshukeshuke","realname":"\u5c82\u53ef\u5c82\u53ef\u8212\u514b\u8212\u514b","salt":"QyXX6qn0K7z1NLAB","password":"fteZE2txRee4CxF9otIDmHrD\/+h3JY+fzFdta95S220=","project_ids":[],"dept_id":"","mobile":"","roles":[],"email":"","login_count":"53","last_login_ip":"36.110.89.59","status":"1","create_time":"1535012063","update_time":"1536810448"},{"user_id":"4","username":"ceshi","realname":"\u6d4b\u8bd5\u4f7f\u7528","salt":"RcWzk38J19abst3G","password":"wKL1safoDNa9VK2hWd3lrvnY0sY8ADj4QNPbDeO3LUY=","project_ids":[],"dept_id":"","mobile":"13266666666","roles":[],"email":"123@qq.com","login_count":"1","last_login_ip":"36.110.89.59","status":"1","create_time":"1535013735","update_time":"1536136628"},{"user_id":"5","username":"mosisi","realname":"\u83ab\u601d\u601d","salt":"l1Bo92TYfw1p5SOG","password":"k8uuNXjCqfXpd5B3aUashX4elBiY4PtZa1A2TeE+4oo=","project_ids":[],"dept_id":"","mobile":null,"roles":[],"email":null,"login_count":"17","last_login_ip":"36.110.89.59","status":"1","create_time":"1535017204","update_time":"1536138866"},{"user_id":"6","username":"lizhi","realname":"\u674e\u5fd7","salt":"dybizgZtRvvjnxWw","password":"HjbSIvani9DRTDBXH7y5dY+1PtevcrFGMAIDy49rqPo=","project_ids":[],"dept_id":"","mobile":null,"roles":[],"email":null,"login_count":"2","last_login_ip":"36.110.89.59","status":"1","create_time":"1535017204","update_time":"1536053411"},{"user_id":"7","username":"wangzhiyong","realname":"\u738b\u5fd7\u6c38","salt":"PUaLkvodwr962G9X","password":"T0OcsEfoqBcSiNC9hClR8KM0trmlFl5oxufWJ7SE4Hc=","project_ids":["1","5"],"dept_id":"5","mobile":null,"roles":["2"],"email":null,"login_count":"13","last_login_ip":"47.94.13.45","status":"1","create_time":"1535017204","update_time":"1536152453"},{"user_id":"8","username":"jutian","realname":"\u97a0\u5929","salt":"4Biz6OCD48ILZN1A","password":"9z64JBv0EqrwMcGMC61xytJScPRMrP\/rCFfkYRUYsmc=","project_ids":["1","2","3","4","5","6","7"],"dept_id":"2","mobile":null,"roles":[],"email":null,"login_count":"28","last_login_ip":"36.110.89.59","status":"1","create_time":"1535017204","update_time":"1536150227"},{"user_id":"9","username":"lichungeng","realname":"\u674e\u6625\u8015","salt":"E2LNiyTkvbMIsjFS","password":"yyLZiPpzqSaKgk9i+FAq69719tVIn6++pqVOeLFWn3g=","project_ids":["1","2","3","4","5"],"dept_id":"2","mobile":null,"roles":[],"email":null,"login_count":"15","last_login_ip":"47.94.13.45","status":"1","create_time":"1535017204","update_time":"1536152678"},{"user_id":"10","username":"zouxiong","realname":"\u90b9\u96c4","salt":"CRUaVwOKuRD6EN5J","password":"ZFaonT1Dtr\/ihL95Ykk+WFo42ZubFCbvr9UjsZJR5fw=","project_ids":["1"],"dept_id":"2","mobile":null,"roles":[],"email":null,"login_count":"10","last_login_ip":"36.110.89.59","status":"1","create_time":"1535017204","update_time":"1536146522"},{"user_id":"11","username":"xingwei","realname":"\u90a2\u4f1f","salt":"5E3eFomUkSx4hKW6","password":"whB2MzRZSKDPOFfDyvrbTAl\/VenCbylRIKH8N7i9TFY=","project_ids":["1"],"dept_id":"3","mobile":null,"roles":[],"email":null,"login_count":"10","last_login_ip":"36.110.89.59","status":"1","create_time":"1535017204","update_time":"1536067494"}],"result_info":{"page":1,"per_page":10,"total_count":153}}')
}

/**
 * 获取用户信息
 * @param {*} params
 */
export function getUserInfo() {
    // if(!query.ele) { query.ele = 10}
    // return get(USER_ROOT + `/service/user/${params.userId}`, query)
    return _p('{"code":200,"message":"OK","result":{"user_id":"2","username":"admin","realname":"admin","salt":"8kRNrOp6uC5VBQ2q","password":"6kNPmfhduMYbBZEcDt2qxBfbLSHBAaiSzZPQ2GYGCAQ=","project_ids":["5","6"],"dept_id":"10","mobile":"13011111111","roles":["1","2","3"],"email":"","login_count":"435","last_login_ip":"36.110.89.59","status":"1","create_time":"1534234504","update_time":"1540263684"}}')
}

/**
 * 获取角色信息
 * @param {*} params
 */
export function getRoles() {
    // return get( USER_ROOT + '/service/role', params, query)
    return _p('{"code":200,"message":"OK","result":[{"role_id":1,"name":"\u6240\u6709\u6743\u9650","desc":"\u5168\u90e8\u6743\u9650"},{"role_id":2,"name":"\u9884\u8b66\u89c4\u5219","desc":"\u9884\u8b66\u89c4\u5219\u6a21\u5757\u89d2\u8272"},{"role_id":3,"name":"31\u53f7\u6d4b\u8bd5","desc":"31\u53f7\u4e0a\u7ebf\u6d4b\u8bd5"},{"role_id":4,"name":"\u6d4b\u8bd5","desc":"\u6d4b\u8bd5\u4f7f\u7528"},{"role_id":5,"name":"test1","desc":"test1"}],"result_info":{"page":1,"per_page":10,"total_count":5}}')
}

/**
 * 获取角色信息
 * @param {*} roleId
 */
export function getRoleInfo() {
    // return get( USER_ROOT + `/service/role/${roleId}`, query)
    return _p('{"code":200,"message":"OK","result":{"role_id":1,"name":"\u6240\u6709\u6743\u9650","desc":"\u5168\u90e8\u6743\u9650","menus_elements":[{"menu_id":"23","element_ids":["10"]},{"menu_id":"25","element_ids":["10"]},{"menu_id":"30","element_ids":["4","10"]},{"menu_id":"31","element_ids":["4","5","12"]},{"menu_id":"32","element_ids":["4","5","10","12"]},{"menu_id":"33","element_ids":["4","5","9","10","12"]},{"menu_id":"34","element_ids":["4","5","10","12","8","31"]},{"menu_id":"44","element_ids":["4","5","7","10","12","32"]},{"menu_id":"45","element_ids":["10"]},{"menu_id":"46","element_ids":["10"]},{"menu_id":"47","element_ids":["4","5","12","27"]},{"menu_id":"48","element_ids":["28","29","30"]},{"menu_id":"49","element_ids":["4","5","12"]},{"menu_id":"74","element_ids":["10"]},{"menu_id":"75","element_ids":["10"]},{"menu_id":"76","element_ids":["4","5","10","12"]},{"menu_id":"77","element_ids":["4","5","10","12"]},{"menu_id":"78","element_ids":["4","5","10","12","46","50"]},{"menu_id":"79","element_ids":["10","4","5","12","33","34","35","36","37","38","39","40","41","42","43","44","45","47","48","49"]},{"menu_id":"80","element_ids":["4","5","10","11","12","27","28","29","30","50"]},{"menu_id":"81","element_ids":["10"]}]}}')
}

/**
 * 获取服务器列表
 * @param {*} params
 */
export function getServers() {
    // return get(SERVER_ROOT + '/service/server_info', params, query)
    return _p('{}')
}

/**
 * 获取菜单信息
 * @param {*} params
 */
export function getMenus(params= {}, query) {
    return get(USER_ROOT + '/service/menu', params, query)
}

/**
 * 获取元素列表
 * @param {*} params
 */
export function getElements(params = {}, query) {
    return get(USER_ROOT + '/service/elements', params, query)
}

/**
 * 搜索服务器
 * @param {*} params
 */
export function searchServers(params = {}, query) {
    return get(SERVER_ROOT + '/service/server/info/search', params, query)
}

/**
 * 查询服务器标签
 */
export function getServerTags(params = {}, query) {
    return get(SERVER_ROOT + '/service/server_target', params, query)
}

/**
 * 查询平台
 */
 export function getPlatform(params = {}, query) {
    return get(SERVER_ROOT + '/service/game/platform/info', params, query)
 }

 /**
  * 获取服务器基本监控信息
  */
export function getBasicMonitor(params = {}, query) {
    return get(SERVER_ROOT + '/service/server_base_monitor_info', params, query)
}

/**
 * 查询服务器应用信息
 */
export function getAppMonitor(params = {}, query) {
    return get(SERVER_ROOT + '/service/server_game_monitor_info', params, query)
}

/**
 * 模糊搜索服务器信息
 */
export function getAutoSearch(params = {}, query) {
	return get(SERVER_ROOT + '/service/server_info_auto_search', params, query)
}

/**
 * 获得分组列表
 */
export function getUserGroup(params = {}, query) {
	return get(WARN_ROOT + '/service/user_group_lst', params, query)
}

/**
 * 区服常量
 */
export function getQufuConst(params = {}, query) {
    return get(QUFU_ROOT + '/service/game/options/constant', params, query)
}

/**
 * 规则详情
 */
export function getRuleDetail(params = {}, query) {
	return get(WARN_ROOT + `/service/rule_detail/${params.id}`, {}, query)
}

/**
 * 所有外网ip
 */
export function getAllExtranet(params = {}, query) {
	return get(SERVER_ROOT + '/service/server_extranet_ip_info', params, query)
}

/**
 * 判断规则名称是否存在
 */
export function ruleNameExists(params = {}, query) {
	return get(WARN_ROOT + `/service/rule_name_exists/${params.name}`, {}, query)
}

/**
 * 启用预警规则
 */
export function getRuleEnable(params = {}, query) {
	return get(WARN_ROOT + `/service/rule_enable/${params.id}`, {}, query)
}

/**
 * 所有规则列表所有规则列表
 */
export function getAllrule(params = {}, query) {
	return get(WARN_ROOT + '/service/rule', params, query)
}


/**
 * 总览数据
 */
export function getDashboardData(params= {}, query) {
    return get(QUFU_ROOT +'/service/game/summary', params, query)
}

/**
 * 游戏信息获取
 */
export function getGameInfo(params= {}, query) {
    return get(INSTALL_ROOT +'/service/gameinfo', params, query)
}

/**
 * 应用类型获取
 */
export function getApptype(params= {}, query) {
    return get(INSTALL_ROOT +'/service/apptype', params, query)
}
/**
 * 后端错误列表
 */
export function getBErrorData(params = {}, query) {
    return get(QUFU_ROOT + '/service/backenderror', params, query)
}

/**
 * 后端错误详情
 */
export function getBErrorDetail(params = {}, query = {}) {
    return get(QUFU_ROOT + `/service/backenderror`, params, query)
}

/**
 * 资源列表
 */
export function getResources(params = {}, query) {
    return get(USER_ROOT + '/service/resources', params, query)
}

/**
 * 查询角色资源
 */
// export function getRoleResource(params = {}, query) {
//     return get(USER_ROOT + `/service/role/${params.role_id}/resource`, params, query)
// }

export function getRoleResource(params = {}, query) {
    var _params = Object.assign({}, params)
    var _role_id = _params.role_id
    var _resource_type = _params.resource_type
    delete params.role_id
    delete params.resource_type
    return get(USER_ROOT + `/service/role/${_role_id}/resource/${_resource_type}`, params, query)
}
   
/**
 * 选择资源类型
 */
export function getResourceType(params = {}, query) {
    return get(USER_ROOT + '/service/resource/types', params, query)
}

/**
 * 资源名字
 */
export function getResourceNames(params = {}, query) {
    return get(USER_ROOT + '/service/resource/options', params, query)
}

/**
 * 区服状态，游戏状态
 */
export function getQfStatusAndGameStatus(params = {}, query) {
    return get(INSTALL_ROOT + '/service/searchoption', params, query)
}

/**
 * 区服分区信息
 */
export function getBlocks(params = {}, query) {
    return get(INSTALL_ROOT + '/service/section', params, query)
}

/**
 * 获取第一级菜单
 */
export function get1LevelMenu(params = {}, query) {
    return get(PERM_ROOT + '/service/menu_one', params, query)
}