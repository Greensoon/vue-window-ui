import { close } from './utils/loading'

import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import VCharts from 'v-charts'

import routes from './router'
import store from './store'

// import promise from 'es6-promise'
// promise.polyfill()
require('es6-promise/auto')

import './style/index.less'

import 'echarts/lib/component/toolbox'
import './components/index'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VCharts)

Vue.prototype.GLOBAL = {
	VERSION: '1.0.1',
	ONLINE_TIME: '2018-08-08 12:00:00'
}

const router = new VueRouter({
	mode: 'history',
	routes
})

new Vue({
	router,
	store
}).$mount('#app')

setTimeout(function() {
	close()
})

import $ from 'jquery'
import { getLastActiveTime, getToken, setToken, setLastActiveTime } from './utils/auth'
import { freshToken } from './apis/put'

/*
 * 检查权限
 */
if(getToken()) {
	freshToken({jwt_token: getToken()})
		.then(json => {
			if(json.code == 200) {
				setToken(json.result.jwt_token)
			}
		})
}
