import {
    _get,
    _post,
    _put,
    _delete,
} from '../../apis/apis'
import { GAME_ROOT } from '../../apis/config'

export function list(params = {}, query = {}) {
    return _get( GAME_ROOT + '/service/section_list', params, query)
}

export function add(params = {}, query = {}) {
    return _post( GAME_ROOT + '/service/section_add', params, query)
}

export function update(params = {}, query = {}) {
    return _put( GAME_ROOT + '/service/section_edit', params, query)
}

export function $delete(params = {}, query = {}) {
    return _delete( GAME_ROOT + '/service/section_delete', params, query )
}

export const downzip = GAME_ROOT + '/service/config_pack'

/**
 * 对比
 */
export function compareFn(params = {}, query = {}) {
    return _get( GAME_ROOT + '/service/section_transfer', params, query)
}

/**
 * 分区迁移
 */
export function moveFn(params = {}, query = {}) {
    return _post( GAME_ROOT + '/service/section_transfer', params, query)
}

/**
 * 操作日志
 */
export function logList(params = {}, query = {}) {
    return _get( GAME_ROOT + '/service/section_transfer_manage_log', params, query)
}