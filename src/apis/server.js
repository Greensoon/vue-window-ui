import { _get } from './apis'
import { SERVER_ROOT } from './config'

export function getServerErrors(params, query) {
    return _get( SERVER_ROOT + '/service/server_error_info', params, query)
}