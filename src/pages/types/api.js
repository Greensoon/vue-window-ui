import {
    _get,
    _post,
    _put,
    _delete,
} from '../../apis/apis'
import { GAME_ROOT } from '../../apis/config'

export function typeSearch(params = {}, query = {}) {
	return _get(GAME_ROOT + '/service/type_search', params, query)
}

export function list(params = {}, query = {}) {
	return _get(GAME_ROOT + '/service/type_list', params, query)
}

export function add(params = {}, query = {}) {
    return _post( GAME_ROOT + '/service/type_add', params, query)
}

export function update(params = {}, query = {}) {
    return _put( GAME_ROOT + '/service/type_edit', params, query)
}

export function $delete(params = {}, query = {}) {
    return _delete( GAME_ROOT + '/service/type_delete', params, query )
}
