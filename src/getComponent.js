/* eslint-disable */

export const login = function(r) { require.ensure([], function() { return r(require('pages/login'))}, 'login')}

export const getbackPwd = function(r) { require.ensure([], function() { return r(require('pages/getbackPwd'))}, 'getbackPwd')}

export const layout = function(r) { require.ensure([], function() { return r(require('./layout'))}, 'layout')}

export const setting = function(r) { require.ensure([], function() { return r(require('pages/modify-mobile'))}, 'setting')}

export const user = function(r) { require.ensure([], function() { return r(require('pages/user'))}, 'user')}

export const server = function(r) { require.ensure([], function() { return r(require('pages/server'))}, 'server')}

export const sysSetting = function(r) {require.ensure([], function() { return r(require('pages/sys-setting'))}, 'sysSetting')}

export const menuManage = function(r) { require.ensure([], function() { return r(require('pages/menu-manage'))}, 'menuManage')}

export const elementManage = function(r) { require.ensure([], function() { return r(require('pages/element'))}, 'elementManage')}

export const platform = function(r) { require.ensure([], function() { return r(require('pages/platform'))}, 'platform')}

export const forewarn = function(r) { require.ensure([], function() { return r(require('pages/forewarn'))}, 'forewarn')}

export const zone = function(r) { require.ensure([], function() { return r(require('pages/zone'))}, 'zone')}

export const resource = function(r) { require.ensure([], function() { return r(require('pages/resource'))}, 'resource')}

export const game = function(r) { require.ensure([], function() { return r(require('pages/game'))}, 'game')}

export const dc_user = function(r) { require.ensure([], function() { return r(require('pages/dc'))}, 'dc')}

export const notfound = function(r) { require.ensure([], function() { return r(require('pages/notfound'))}, 'notfound')}

export const configuration = function(r) { require.ensure([], function() { return r(require('pages/configuration'))}, 'configuration')}

export const partition = function(r) { require.ensure([], function() { return r(require('pages/partition'))}, 'partition')}
