import { _patch } from './apis'

const patch = _patch

import { USER_ROOT } from './config'

export function saveRoles(data, query) {
    return patch(USER_ROOT + '/service/role/user', data, query)
}

export function addElementsToMenu(data = {}, query) {
    return patch(USER_ROOT + '/service/menu/elements', data, query)
}

export function savePermission(data= {}, query) {
    return patch(USER_ROOT + '/service/role/menuselements', data, query)
}

export function saveRoleRes(data = {}, query) {
    return patch(USER_ROOT + '/service/role/resource', data, query)
}