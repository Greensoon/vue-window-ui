import APIS from '../../apis'
import { GET_MENUS_SUCCESS, GET_GAME_INFO_SUCCESS } from '../type'

export default {
	state: {
		menus: [],
		gameInfo: [],
		platformInfo: []
	},
	actions: {
		getMenus({commit}, data) {
			return APIS.GET.getMenus(data).
				then(json => {
					commit(GET_MENUS_SUCCESS, json)
					return json
				})
		},
		getGameInfo({commit}, data) {
			return APIS.GET.getGameInfo(data)
				.then(json => {
					commit(GET_GAME_INFO_SUCCESS, json)
					return json
				})
		}
	},
	mutations: {
		[GET_MENUS_SUCCESS](state, json) {
			state.menus = json
		},
		[GET_GAME_INFO_SUCCESS](state, json) {
			state.gameInfo = json.result.game
			state.platformInfo = json.result.platform_info
		}
	}
}