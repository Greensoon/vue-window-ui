/* eslint-disable */
import { _post } from './apis'

const post = _post
import { USER_ROOT, SERVER_ROOT, WARN_ROOT, QUFU_ROOT, INSTALL_ROOT } from './config'

var _p = function (dataStr) {
    return new Promise(resolve => resolve(JSON.parse(dataStr)))
}
/*
 * 添加用户
 */
export function addUserInfo(data, query) {
    return post(USER_ROOT + '/service/user', data, query)
    // return post('/service/user', data)
}

/*
 * 添加角色
 */
export function addRoleInfo(data, query) {
    return post(USER_ROOT + '/service/role', data, query)
    // return post('/service/user', data)
}

/**
 * 添加服务器
 */
export function addServer(params, query) {
    return post(SERVER_ROOT + '/service/server_info', params, query)
}

/**
 * 登录
 */
export function login(params, query) {
    return _p('{"code":200,"message":"OK","result":{"jwt_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMiIsInVzZXJuYW1lIjoiYWRtaW4iLCJyZWFsbmFtZSI6ImFkbWluIiwiZXhwIjoxNTQwMjg5MTIxLCJpbnRlcnZhbCI6MTgwMH0=.i2eMCE00Dgq7uVU4g6awfG7juXcVqsw62QTteuqcSB0=","pass_edit":false,"dept_edit":false,"menu":[{"menu_id":23,"menu_pid":"0","menu_name":"\u670d\u52a1\u5668\u7ba1\u7406","menu_desc":"\u670d\u52a1\u5668\u7ba1\u7406","menu_icon":"server","menu_component":"server","has_element":"1","element_ids":[{"element_id":10,"element_code":"108"},{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":7,"element_code":"105"},{"element_id":8,"element_code":"106"},{"element_id":9,"element_code":"107"},{"element_id":11,"element_code":"109"},{"element_id":12,"element_code":"100"},{"element_id":27,"element_code":"200"},{"element_id":28,"element_code":"111"},{"element_id":29,"element_code":"121"},{"element_id":30,"element_code":"122"},{"element_id":31,"element_code":"112"},{"element_id":32,"element_code":"113"}],"children":[{"menu_id":44,"menu_pid":"23","menu_name":"\u670d\u52a1\u5668\u5217\u8868","menu_desc":"\u670d\u52a1\u5668\u5217\u8868","menu_icon":"server","menu_component":"server","has_element":"0","element_ids":[{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":7,"element_code":"105"},{"element_id":10,"element_code":"108"},{"element_id":12,"element_code":"100"},{"element_id":32,"element_code":"113"},{"element_id":31,"element_code":"112"},{"element_id":30,"element_code":"122"},{"element_id":29,"element_code":"121"},{"element_id":28,"element_code":"111"},{"element_id":27,"element_code":"200"},{"element_id":11,"element_code":"109"},{"element_id":9,"element_code":"107"},{"element_id":8,"element_code":"106"}]},{"menu_id":47,"menu_pid":"23","menu_name":"\u9884\u8b66\u5217\u8868","menu_desc":"\u9884\u8b66\u5217\u8868","menu_icon":"forewarn","menu_component":"forewarn","has_element":"1","element_ids":[{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":12,"element_code":"100"},{"element_id":27,"element_code":"200"},{"element_id":32,"element_code":"113"},{"element_id":31,"element_code":"112"},{"element_id":30,"element_code":"122"},{"element_id":29,"element_code":"121"},{"element_id":28,"element_code":"111"},{"element_id":11,"element_code":"109"},{"element_id":10,"element_code":"108"},{"element_id":9,"element_code":"107"},{"element_id":8,"element_code":"106"},{"element_id":7,"element_code":"105"}]}]},{"menu_id":25,"menu_pid":"0","menu_name":"\u7528\u6237\u7ba1\u7406","menu_desc":"\u7528\u6237\u7ba1\u7406","menu_icon":"user","menu_component":"user","has_element":"0","element_ids":[{"element_id":10,"element_code":"108"},{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":7,"element_code":"105"},{"element_id":8,"element_code":"106"},{"element_id":9,"element_code":"107"},{"element_id":11,"element_code":"109"},{"element_id":12,"element_code":"100"},{"element_id":27,"element_code":"200"},{"element_id":28,"element_code":"111"},{"element_id":29,"element_code":"121"}],"children":[{"menu_id":33,"menu_pid":"25","menu_name":"\u7528\u6237\u5217\u8868","menu_desc":"\u7528\u6237\u5217\u8868111","menu_icon":"user-manage","menu_component":"user","has_element":"0","element_ids":[{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":9,"element_code":"107"},{"element_id":10,"element_code":"108"},{"element_id":12,"element_code":"100"},{"element_id":29,"element_code":"121"},{"element_id":28,"element_code":"111"},{"element_id":27,"element_code":"200"},{"element_id":11,"element_code":"109"},{"element_id":8,"element_code":"106"},{"element_id":7,"element_code":"105"}]},{"menu_id":34,"menu_pid":"25","menu_name":"\u89d2\u8272\u5217\u8868","menu_desc":"\u89d2\u8272\u5217\u8868","menu_icon":"role-manage","menu_component":"role","has_element":"0","element_ids":[{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":10,"element_code":"108"},{"element_id":12,"element_code":"100"},{"element_id":8,"element_code":"106"},{"element_id":31,"element_code":"112"},{"element_id":7,"element_code":"105"},{"element_id":9,"element_code":"107"},{"element_id":11,"element_code":"109"},{"element_id":27,"element_code":"200"},{"element_id":28,"element_code":"111"},{"element_id":29,"element_code":"121"}]},{"menu_id":74,"menu_pid":"25","menu_name":"\u7528\u6237\u884c\u4e3a\u65e5\u5fd7","menu_desc":"\u7528\u6237\u884c\u4e3a\u65e5\u5fd7","menu_icon":"user-logs","menu_component":"user-logs","has_element":"0","element_ids":[{"element_id":10,"element_code":"108"}]}]},{"menu_id":30,"menu_pid":"0","menu_name":"\u7cfb\u7edf\u8bbe\u7f6e","menu_desc":"\u7cfb\u7edf\u8bbe\u7f6e","menu_icon":"sysSetting","menu_component":"sysSetting","has_element":"0","element_ids":[{"element_id":4,"element_code":"101"},{"element_id":10,"element_code":"108"}],"children":[{"menu_id":31,"menu_pid":"30","menu_name":"\u83dc\u5355\u7ba1\u7406","menu_desc":"\u83dc\u5355\u7ba1\u7406","menu_icon":"menu-manage","menu_component":"menuManage","has_element":"0","element_ids":[{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":12,"element_code":"100"}]},{"menu_id":32,"menu_pid":"30","menu_name":"\u5143\u7d20\u7ba1\u7406","menu_desc":"\u5143\u7d20\u7ba1\u7406","menu_icon":"element","menu_component":"elementManage","has_element":"1","element_ids":[{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":10,"element_code":"108"},{"element_id":12,"element_code":"100"}]},{"menu_id":49,"menu_pid":"30","menu_name":"\u8d44\u6e90\u7ba1\u7406","menu_desc":"\u8d44\u6e90\u7ba1\u7406","menu_icon":"resource","menu_component":"resource","has_element":"1","element_ids":[{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":12,"element_code":"100"}]}]},{"menu_id":45,"menu_pid":"0","menu_name":"\u533a\u670d\u7ba1\u7406","menu_desc":"\u533a\u670d\u7ba1\u7406","menu_icon":"zone","menu_component":"zone","has_element":"1","element_ids":[{"element_id":10,"element_code":"108"}],"children":[{"menu_id":46,"menu_pid":"45","menu_name":"\u533a\u670d\u603b\u89c8","menu_desc":"\u533a\u670d\u603b\u89c8","menu_icon":"dashboard","menu_component":"dashboard","has_element":"0","element_ids":[{"element_id":10,"element_code":"108"}]},{"menu_id":48,"menu_pid":"45","menu_name":"\u533a\u670d\u5217\u8868","menu_desc":"\u533a\u670d\u5217\u8868","menu_icon":"list","menu_component":"list","has_element":"0","element_ids":[{"element_id":28,"element_code":"111"},{"element_id":29,"element_code":"121"},{"element_id":30,"element_code":"122"}]},{"menu_id":81,"menu_pid":"45","menu_name":"\u5728\u7ebf\u4eba\u6570","menu_desc":"\u5728\u7ebf\u4eba\u6570\u8d8b\u52bf\u56fe","menu_icon":"icon-online-total","menu_component":"onlinePlayer","has_element":"0","element_ids":[{"element_id":10,"element_code":"108"}]}]},{"menu_id":75,"menu_pid":"0","menu_name":"\u6e38\u620f\u7ba1\u7406","menu_desc":"\u6e38\u620f\u7ba1\u7406","menu_icon":"game","menu_component":"game","has_element":"0","element_ids":[{"element_id":10,"element_code":"108"}],"children":[{"menu_id":76,"menu_pid":"75","menu_name":"\u5e73\u53f0\u7ba1\u7406","menu_desc":"\u5e73\u53f0\u7ba1\u7406","menu_icon":"icon-platform","menu_component":"platform","has_element":"0","element_ids":[{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":10,"element_code":"108"},{"element_id":12,"element_code":"100"}]},{"menu_id":77,"menu_pid":"75","menu_name":"\u7c7b\u578b\u7ba1\u7406","menu_desc":"\u7c7b\u578b\u7ba1\u7406","menu_icon":"types","menu_component":"types","has_element":"0","element_ids":[{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":10,"element_code":"108"},{"element_id":12,"element_code":"100"}]},{"menu_id":78,"menu_pid":"75","menu_name":"\u5206\u533a\u7ba1\u7406","menu_desc":"\u5206\u533a\u7ba1\u7406","menu_icon":"sections","menu_component":"sections","has_element":"0","element_ids":[{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":10,"element_code":"108"},{"element_id":12,"element_code":"100"},{"element_id":46,"element_code":"130"},{"element_id":50,"element_code":"134"}]},{"menu_id":79,"menu_pid":"75","menu_name":"\u914d\u7f6e\u7ba1\u7406","menu_desc":"\u914d\u7f6e\u7ba1\u7406","menu_icon":"","menu_component":"configuration","has_element":"0","element_ids":[{"element_id":10,"element_code":"108"},{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":12,"element_code":"100"},{"element_id":33,"element_code":"114"},{"element_id":34,"element_code":"115"},{"element_id":35,"element_code":"116"},{"element_id":36,"element_code":"117"},{"element_id":37,"element_code":"118"},{"element_id":38,"element_code":"119"},{"element_id":39,"element_code":"120"},{"element_id":40,"element_code":"123"},{"element_id":41,"element_code":"124"},{"element_id":42,"element_code":"125"},{"element_id":43,"element_code":"126"},{"element_id":44,"element_code":"127"},{"element_id":45,"element_code":"128"},{"element_id":47,"element_code":"131"},{"element_id":48,"element_code":"132"},{"element_id":49,"element_code":"133"}]},{"menu_id":80,"menu_pid":"75","menu_name":"\u81ea\u52a8\u5206\u533a","menu_desc":"\u81ea\u52a8\u5206\u533a","menu_icon":"","menu_component":"partition","has_element":"0","element_ids":[{"element_id":4,"element_code":"101"},{"element_id":5,"element_code":"102"},{"element_id":10,"element_code":"108"},{"element_id":11,"element_code":"109"},{"element_id":12,"element_code":"100"},{"element_id":27,"element_code":"200"},{"element_id":28,"element_code":"111"},{"element_id":29,"element_code":"121"},{"element_id":30,"element_code":"122"},{"element_id":50,"element_code":"134"}]}]}]}}')
}

/**
 * 找回密码
 */
export function getbackPwd(params, query) {
    return post(USER_ROOT + '/service/user/password', params, query)
}

/**
 * 添加菜单
 */
 export function addMenu(params, query) {
    return post(USER_ROOT + '/service/menu', params, query)
 }

/**
 * 添加元素
 */
export function addElement(params, query) {
    return post(USER_ROOT + '/service/element', params, query)
}

/**
 * 添加标签
 */
export function addTag(params, query) {
    return post(SERVER_ROOT + '/service/server_target', params, query)
}

/**
 * 添加平台
 */
export function addPlatform(params, query) {
    return post(SERVER_ROOT + '/service/game/platform/info', params, query)
}

/**
 * 增加分组
 */
export function userGroupAdd(params, query) {
    return post(WARN_ROOT + '/service/user_group_add', params, query)
}

/**
 * 增加规则
 */
export function postRuleAdd(params, query) {
    return post(WARN_ROOT + '/service/rule_add', params, query)
}

/**
 * 获得某一服务器下已经应用的规则
 */
export function postServerRule(params, query) {
    return post(WARN_ROOT + '/service/server_warning_rule', params, query)
}

// /**
//  * 添加游戏
//  */
// export function addGame(params) {
//     return post('/')
// }
/**
 * 区服常量
 */

export function getQufuConst(params, query) {
    return post(QUFU_ROOT + '/service/game/options/constant', params, query)
}

/**
 * 获取Ips
 */
export function getIps(params, query) {
    return post(QUFU_ROOT + '/service/game/options/ip', params, query)
}

/**
 * 区服搜索分区选项
 */
export function getQfBlock(params, query) {
    return post(QUFU_ROOT + '/service/game/options/block', params, query)
}

/**
 * 区块查询
 */
export function qfSearch(params, query) {
    return post(QUFU_ROOT + '/service/game', params, query)
}

/**
 * 区服关闭
 */
export function qfClose(params, query) {
    return post(QUFU_ROOT + '/service/game/stop', params, query)
}

/**
 * 区服开启
 */
export function qfOpen(params, query) {
    return post(QUFU_ROOT + '/service/game/start', params, query)
}

/**
 * 区服重启
 */
export function qfReopen(params, query) {
    return post(QUFU_ROOT + '/service/game/restart', params, query)
}

/**
 * 添加资源
 */
// {
//     "resource_type": "", #资源类型 user server game role warning_rule
//     "resources": [{"action":[1,2,3]}, {"action": [4,5,6]}], #资源
// }
export function addResource(params, query) {
    return post(USER_ROOT + '/service/resource', params, query)
}

/**
 * 探针部署
 */
export function serverMonitor(params, query) {
    return post(SERVER_ROOT + '/service/install_server_monitor', params, query)
}

/**
 * 平台选项
 */
export function getResPlatform(params = {}, query) {
    return post(QUFU_ROOT + '/service/game/options/platform', params, query)
}

export function deploy(params = {}, query) {
    return post(INSTALL_ROOT + '/service/deploy', params, query)
}

/**
 * 总览
 * @param {*} params 
 * @param {*} query 
 */
export function getOverview(params = {}, query) {
    return post(INSTALL_ROOT + '/service/overview', params, query)
}

/**
 * 区服列表
 */
export function getQufuList(params = {}, query) {
    return post(INSTALL_ROOT + '/service/gamepartition', params, query)
}

/**
 * 区服操作
 */
export function qfOperation(params = {}, query) {
    return post(QUFU_ROOT + '/service/partitionoperation', params, query)
}

/**
 * 在线人数
 */
export function onlineCount(params = {}, query) {
    return post(QUFU_ROOT + '/service/onlinegamer/count', params, query)
}