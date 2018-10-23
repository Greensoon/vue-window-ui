import {
    _get,
    _post,
    _put,
    _delete,
} from '../../apis/apis'

import { GAME_ROOT } from '../../apis/config'

/**
 * 查询分区列表
 */
export function search(params = {}, query = {}) {
    return _get( GAME_ROOT + '/service/game_list', params, query)
}

/**
 * 启动
 */
export function start(params = {}, query = {}) {
    return _post( GAME_ROOT + '/service/game_change', params, query)
}

/**
 * 数据
 */
export function $list(params = {}, query = {}) {
    return _get( GAME_ROOT + '/service/game_change', params, query)
}

/**
 * 数据删除
 */
export function $delete(params = {}, query = {}) {
    return _delete( GAME_ROOT + '/service/game_change', params, query)
}

/**
 * 修改
 */
export function $modify(params = {}, query = {}) {
    return _put( GAME_ROOT + '/service/game_change', params, query)
}