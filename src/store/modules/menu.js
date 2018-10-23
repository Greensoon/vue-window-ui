import APIS from '../../apis'
import { GET_FIRST_LEVEL_MENU } from '../type'

export default {
	state: {
		menus: [],
	},
	actions: {
		getMenus({commit}, data) {
			return APIS.GET.get1LevelMenu(data).
				then(json => {
					commit(GET_FIRST_LEVEL_MENU, json)
					return json
				})
		}
	},
	mutations: {
		[GET_FIRST_LEVEL_MENU](state, json) {
			state.menus = json.result
		}
	}
}