import {
    _get,
} from '../../apis/apis'
import { GAME_ROOT } from '../../apis/config'

export function userLog(params, query) {
	return _get(GAME_ROOT + '/service/user_operation_log_list', params, query)
}

export function logUserlist(params, query) {
	return _get(GAME_ROOT + '/service/log_user_list', params, query)
}

export function appList(params, query) {
	return _get(GAME_ROOT + '/service/app_list', params, query)
}
