/* eslint-disable */
import { getLoguserMenus } from '../utils/auth'

export default {
    data() {
        return {
            menuId: 0,
            submenus: [],
            needIds: []
        }
    },
    methods: {
        getSubmenus: function(appName, callback) {
            var _menus = JSON.parse(getLoguserMenus())
            var _filters = _menus.filter(e => e.menu_name == appName)
            var _submenus = _filters.length ? _filters[0].children || [] : []
            callback && callback(_submenus)

            this.submenus = _submenus

            return _submenus
        },
        getElementIds: function(callback) {
            var ret = null
            if(this.submenus && this.submenus.length) {
                var _menu_id = this.submenus[0].menu_id
                this.menuId = _menu_id
                ret = this.submenus[0].element_ids
                ret.forEach(e => {
                    e.menu_id = _menu_id
                })

                callback && callback(_menu_id)
            }
            this.needIds = ret || []
            return ret
        }
    }
}

export function handleMenuData(data) {
    var ret = []
    var fn = function (_d) {
        _d.map(e => {
            var _temp = {
                id: e.menu_id,
                label: e.menu_name,
                data: e
            }
            if(e.children) {
                _temp.children =  e.children.map(el => {
                    var _tmp = {id: el.menu_id, label: el.menu_name, data: el}
                    if(el.children) {
                        _tmp.children = el.children.map(ele => {
                            return {id: el.menu_id, label: el.menu_name, data: ele}
                        })
                    }
                    return _tmp
                })
            }

            ret.push(_temp)
        })
    }
    fn(data)
    return ret
}