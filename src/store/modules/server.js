import APIS from '../../apis'
import { getServerErrors } from '../../apis/server'
import { GET_GAME_SUCCESS, GET_SERVER_DASHBOARD_SUCCESS } from '../type'

export default {
	state: {
		games: [],
		dashboard: {}
	},
	actions: {
		getGames({commit}, data) {
			return APIS.getGames(data)
				.then(json => {
					commit(GET_GAME_SUCCESS, json)
					return json
				})
		},
		getServerErrors({commit}, data) {
			return getServerErrors(data)
				.then(json => {
					commit(GET_SERVER_DASHBOARD_SUCCESS, json)
					return json
				})
		}
	},
	mutations: {
		[GET_GAME_SUCCESS](state, json) {
			state.games = json.data
		},
		[GET_SERVER_DASHBOARD_SUCCESS](state, json) {
			state.dashboard = json.result
		}
	}
}