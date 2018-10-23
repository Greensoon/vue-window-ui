import { _get } from './apis'
import { DC_ROOT } from './config'

/**
 * 获取启用菜品
 * @param {
 *  shop_id: 1
 * } params 
 */
export function getOpenCaipin(params = {}) {
    return _get(DC_ROOT + '/v1/service/menu_enable_list', params)
}