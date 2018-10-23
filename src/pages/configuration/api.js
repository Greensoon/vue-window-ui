import {
    _get,
    _post,
    _put,
    _delete,
} from '../../apis/apis'
import { GAME_ROOT } from '../../apis/config'

export function unlock(params, query) {
	return _get(GAME_ROOT + '/service/unlock', params, query)
}

export function timingOnline(params, query) {
	return _post(GAME_ROOT + '/service/timing_online', params, query)
}

export function configCompare(params, query) {
	return _get(GAME_ROOT + '/service/config_compare', params, query)
}

export function directOnline(params, query) {
	return _post(GAME_ROOT + '/service/direct_online', params, query)
}

export function serverOnline(params, query) {
	return _post(GAME_ROOT + '/service/online', params, query)
}

export function configTemp(params, query) {
	return _delete(GAME_ROOT + '/service/online_temp', params, query)
}

export function indirectOnline(params, query) {
	return _post(GAME_ROOT + '/service/indirect_online', params, query)
}

export function onlineConfig(params, query) {
	return _get(GAME_ROOT + '/service/online_config', params, query)
}

export function delOnline(params, query) {
	return _delete(GAME_ROOT + '/service/online', params, query)
}

export function timingList(params, query) {
	return _get(GAME_ROOT + '/service/timing_online', params, query)
}

export function onlineList(params, query) {
	return _get(GAME_ROOT + '/service/online', params, query)
}

export function effectives(params, query) {
	return _put(GAME_ROOT + '/service/effective', params, query)
}

export function historyVersion(params, query) {
	return _get(GAME_ROOT + '/service/config_history_version',params,query)
}

export function configDetail(params, query) {
	return _get(GAME_ROOT + '/service/config_detail',params, query)
}

export function configEdit(params, query) {
	return _put(GAME_ROOT + '/service/config_edit', params, query)
}

export function configList(params, query) {
    return _get(GAME_ROOT + '/service/config_list', params, query)
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

export const upload_url = GAME_ROOT + '/service/update'

export function upload(params = {}, query = {}) {
    return _post( upload_url, params, query)
}

export function saveConfig(params = {}, query = {}) {
    return _post( GAME_ROOT + '/service/configuration', params, query)
}

/**
 * 用户行为日志
 */
export function logList(params = {}, query = {}) {
	return _get( GAME_ROOT + '/service/config_manage_log', params, query)
}

/**
 * 一键回滚
 */
export function rollback(params = {}, query = {}) {
	return _post( GAME_ROOT + '/service/one_step', params, query)
}

/**
 * 打全量包
 */
export function pack(params = {}, query = {}) {
	return _post( GAME_ROOT + '/service/compress_all', params, query)
}

/**
 * 上线方案详情
 */
export function onlineInfo(params = {}, query = {}) {
	return _get( GAME_ROOT + '/service/online_info', params, query)
}

/**
 *
 */
export function lastLog (params = {}, query = {}) {
	return _get( GAME_ROOT + '/service/compress_conf_last_message', params, query)
}
