/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 16:13:06
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-18 15:30:34
 */
import type { RouteRecordRaw } from 'vue-router';
export default [
    {
        path: '/home',
        name: '首页',
        component: () => import("@view/Home.vue"),
    }
] as RouteRecordRaw[];