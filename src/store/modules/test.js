import APIS from '../../apis'
import { TEST } from '../type'

export default {
	state: {
		data: []
	},
	actions: {
		testAction({commit}, data) {
			console.log(' -------------- ', data)
			return APIS.getTestData(data).
				then(json => {
					commit(TEST, json)
					return json
				})
		}
	},
	mutations: {
		[TEST](state, json) {
			if(state.data.length) {
				state.data.concat(json)
			} else {
				state.data = json
			}
		}
	}
}