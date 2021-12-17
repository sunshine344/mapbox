/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-01-14 16:08:20
 * @LastEditors  : Pat
 * @LastEditTime : 2021-12-17 10:53:46
 */

import type { RouteRecordRaw } from 'vue-router';
export default [
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import("@view/Error/index.ts"),
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            isAuth: true
        },
        component: () => import("@view/Login/index.vue"),
    }
] as RouteRecordRaw[];