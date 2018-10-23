/* eslint-disable */
import cookie from 'js-cookie'
// import Vue from 'vue'

export function push(path) {
	location.href = path
}

export const setToken= function(token, expires = 1) {
	cookie.set('vm2_token', token, {expires})
}

export const getToken = function() {
	return cookie.get('vm2_token')
}

export const removeToken = function() {
	cookie.remove('vm2_token')
}

export const setGame = function(game) {
	cookie.set('vm2_game', game)
}

export const getGame = function() {
	return cookie.get('vm2_game')
}

export const removeGame = function() {
	cookie.remove('vm2_game')
}

import { escapeMenus, myMenu } from './menu.config'

export const redirectToHome = function(to, from, next) {
	if(escapeMenus.indexOf(to.path) > -1 ) {
		next()
	} else {
		if(getToken()) {
			push('/')
		} else {
			next()
		}
	}

}

export const redirectToLogin = function(to, from, next) {

	if(escapeMenus.indexOf(to.path) <0 ) {
		if(!getToken()) {
			push('/login')
		} else {
			next()
		}
	} else {
		next()
	}

	return false
}


export const setLoginUser = function(login) {
	login = typeof login !== 'string' ? JSON.stringify(login) : login
	cookie.set('vm2_loginUser', login)
}

export const getLoginUser = function() {
	return JSON.parse(cookie.get('vm2_loginUser') || '{}')
}

export const removeUser = function() {
	cookie.remove('vm2_loginUser')
}

export const logout = function() {
	removeToken()
	removeUser()
	removeLoguserMenus()
	push('/login')
}

export function setActivePanel(value) {
	localStorage.setItem('VM2_CURRENT_PANEL', value)
}

export function getActivePanel() {
	return localStorage.getItem('VM2_CURRENT_PANEL')
}

export function removeActivePanel() {
	return localStorage.removeItem('VM2_CURRENT_PANEL')
}

export function setLoguserMenus(value) {
	localStorage.setItem('VM2_USER_MENUS', value)
}

export function getLoguserMenus() {
	return localStorage.getItem('VM2_USER_MENUS')
}

export function removeLoguserMenus() {
	localStorage.removeItem('VM2_USER_MENUS')
}

export function setLastActiveTime(val) {
	cookie.set('vm2_active_time', val)
}

export function getLastActiveTime() {
	return cookie.get('vm2_active_time') || new Date().getTime()
}

export function removeLastActiveTime() {
	cookie.remove('vm2_active_time')
}

export function setMenuId(menuid) {
	localStorage.setItem('VM2_MENU_ID', menuid)
}
export function getMenuId() {
	return localStorage.getItem('VM2_MENU_ID')
}