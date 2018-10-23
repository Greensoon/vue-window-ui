import APIS from '../../apis/index'
import { LOGIN_SUCCESS } from '../type'

export default {
	state: {
		loginUser: {}
	},
	actions: {
		goLogin({commit}, data) {
			return APIS.POST.login(data).
				then(json => {
					commit(LOGIN_SUCCESS, json)
					return json
				})
		}
	},
	mutations: {
		[LOGIN_SUCCESS](state, json) {
			state.loginUser = json.data
		}
	}
}
