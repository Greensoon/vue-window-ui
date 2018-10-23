import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import login from './modules/login'
import server from './modules/server'
import main from './modules/main'
import qufu from './modules/qufu'
import test from './modules/test'
import menu from './modules/menu'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

var GLOBAL_MUTATIONS = {}
var GLOBAL_ACTIONS = {}
var GLOBAL_STATE = {}

export default new Vuex.Store({
	modules: {
		login,
		server,
		main,
		qufu,
		menu,
		test
	},
	mutations: GLOBAL_MUTATIONS,
	actions: GLOBAL_ACTIONS,
	state: GLOBAL_STATE,
	strict: debug,
  	plugins: debug ? [createLogger()] : []
})