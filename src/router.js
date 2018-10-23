import App from './App'
import {
    login,
    notfound,
    layout,
    getbackPwd

} from './getComponent'

import { redirectToHome, redirectToLogin } from './utils/auth'

var router = [{
    path: '',
    redirect: '/layout'
}, {
    path: '/',
    component: App,
    redirect: '/layout',
    children: [{
        path: '/login',
        component: login,
        beforeEnter: redirectToHome
    },
    {
        path: '/layout',
        component: layout
    },
    {
        path: '/getbackPwd',
        component: getbackPwd
    },
    {
        path: '/*',
        component: notfound
    }]
}]

import ngp from 'nprogress'

function dgFn(arr) {
    arr.forEach(function(e) {
        if(e.children && e.children.length > 0) {
            dgFn(e.children)
        } else {
            if(e.beforeEnter) {
                var _bfe = e.beforeEnter
                e.beforeEnter = function(to, from, next) {
                    ngp.start()
                    ngp.done()
                    _bfe(to, from, next)
                }

            } else {
                e.beforeEnter = function(to, from, next) {
                    ngp.start()
                    ngp.done()
    
                    redirectToLogin(to, from, next)
                }
            }
        }
    })
}

dgFn(router)

export default router
