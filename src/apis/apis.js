/* eslint-disable */
import axios from 'axios'
// import { API_ROOT } from './config'
import { getToken, removeToken, removeUser, getMenuId } from '../utils/auth'
import nprogress from 'nprogress'

import Vue from 'vue'

// axios.defaults.timeout = 10000
// axios.defaults.baseURL = API_ROOT
axios.defaults.withCredentials = true
axios.defaults.dataType = 'json'
axios.defaults.headers['cache-control'] = 'no-cache'
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
// axios.defaults.headers['Access-Control-Allow-Headers'] = 'authorization,content-type,x-requested-with,Accept,Authorization,Origin,Referer,X-Csrf-Token,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type'
axios.defaults.transformRequest = [function (data) {
	nprogress.start()
  	return JSON.stringify(data)
}]

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  	config.headers = config.headers || {}
  	config.headers['Content-Type'] = 'application/json'

	if(config.url.indexOf('login') < 0) {
		config.headers.Authorization = getToken()
	}

	return config
}, function (error) {
	nprogress.done()
  	return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
	nprogress.done()

	if(response.data && response.data.code == 200) {
		return Promise.resolve(response.data)
	} else {
		Vue.prototype.$message.error(response.data.message)
		if(response.data.code == 401) {
			removeToken()
			removeUser()
			location.href= '/login'
		} else {
			return Promise.reject(response.data)
		}
	}

}, function (error) {
	nprogress.done()
	if(/401/.test(JSON.stringify(error)) && !/<html>/.test(JSON.stringify(error))) {
		removeToken()
		removeUser()
		location.href= '/login'
	} else if(/405/.test(JSON.stringify(error))) {
		// Vue.prototype.$message.error('对不起，您无此权限')
		// return Promise.reject({code: 403, msg: '权限不足'})
	} else if(/40\d/.test(JSON.stringify(error))) {
		// Vue.prototype.$message.error('请求有误')
		// return Promise.reject({code: 400, msg: 'request error'})
	} else if(JSON.stringify(error).indexOf(500)) {
		// Vue.prototype.$message.error('服务器内部错误')
	} else if(JSON.stringify(error).indexOf('timeout') > -1) {
		// Vue.prototype.$message.error('连接超时')
		// return Promise.reject({code: 504, msg: '连接超时'})
	}
  	return Promise.reject({code: 500, msg: 'server error'})
})

const seriliaze = function(query = {}) {
	var _query = []
	for(var i in query) {
		_query.push(`${i}=${query[i]}`)
	}
	_query.push(`appid=${getMenuId()}`)
	return _query.join('&')
}
import $ from 'jquery'

const trimParams = function(obj) {
	for(var i in obj) {
		if(typeof obj[i] == 'string') {
			obj[i] = $.trim(obj[i])
		}
	}
	return obj
}
export function _get(url, data = {}, query = {}) {
	query.appid = getMenuId()
	data = Object.assign(data, query)
	data = trimParams(data)
	return axios.get(url, {params: data})
}

export function _post(url, data= {}, query = {}) {
	if(query) {
		url += '?' + seriliaze(query)
	}
	data = trimParams(data)
	return axios.post(url, data)
}

export function _put(url, data, query = {}) {
	if(query) {
		url += '?' + seriliaze(query)
	}
	data = trimParams(data)
	return axios.put(url, data)
}

export function _delete(url, data, query = {}) {
	if(query) {
		url += '?' + seriliaze(query)
	}
	data = trimParams(data)
	return axios.delete(url, {data})
}

export function _patch(url, data, query = {}) {
	if(query) {
		url += '?' + seriliaze(query)
	}
	data = trimParams(data)
	return axios.patch(url, data)
}

