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
        path:'/',
        redirect:'/login'
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            isAuth: true,
            name: "用户登录"
        },
        component: () => import("@view/Login/index.vue"),
    },
    {
        path: '/home',
        name: 'Home',
        meta: {
            isAuth: true,
            name: "首页"
        },
        component: () => import("@view/Home.vue"),
        redirect:'/home/list',
        children:[
            // list
            {
                path: 'list',
                name: 'List',
                meta: {
                    isAuth: true,
                    name: "数据操作"
                },
                component: () => import("@view/list/list.vue"),
            },
            {
                path: 'UserManagement',
                name: 'UserManagement',
                meta: {
                    isAuth: true,
                    name: "用户管理"
                },
                component: () => import("@view/UserManagement/UserManagement.vue"),
            },{
                path: 'AtlasManagement',
                name: 'AtlasManagement',
                meta: {
                    isAuth: true,
                    name: "图册管理"
                },
                component: () => import("@view/AtlasManagement/AtlasManagement.vue"),
            },
            {
                path: 'Resource',
                name: 'Resource',
                meta: {
                    isAuth: true,
                    name: "资源中心"
                },
                component: () => import("@view/Resource/Resource.vue"),
            },
            {
                path: 'LogManagement',
                name: 'LogManagement',
                meta: {
                    isAuth: true,
                    name: "日志管理"
                },
                component: () => import("@view/LogManagement/LogManagement.vue"),
            }
        ]
    },
   
    // {
    //     path: '/login',
    //     name: 'Login',
    //     meta: {
    //         isAuth: true,
    //         name: "用户登录"
    //     },
    //     component: () => import("@view/Login/index.vue"),
    // }
] as RouteRecordRaw[];