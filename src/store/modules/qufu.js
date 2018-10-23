import { getQfStatusAndGameStatus } from '../../apis/get'
import { QUFU_STATUS_SUCCESS } from '../type'

export default {
	state: {
		qfStatus: []
	},
	actions: {
		getQfStatusAndGameStatus({commit}, data) {
			return getQfStatusAndGameStatus(data).
				then(json => {
					commit(QUFU_STATUS_SUCCESS, json)
					return json
				})
		}
	},
	mutations: {
		[QUFU_STATUS_SUCCESS](state, json) {
			state.qfStatus = json.result
		}
	}
}