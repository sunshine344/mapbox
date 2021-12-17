/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-01-14 16:08:20
 * @LastEditors  : Pat
 * @LastEditTime : 2021-12-17 15:06:48
 */

import type { RouteRecordRaw } from 'vue-router';
export default [
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        meta: {
            name: "404页面丢失！"
        },
        component: () => import("@view/Error/index.ts"),
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            isAuth: true,
            name: "用户登录"
        },
        component: () => import("@view/Login/index.vue"),
    }
] as RouteRecordRaw[];