/*
 * @Autor        : Pat
 * @Description  : User Store
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-02-19 16:24:08
 * @LastEditors  : Pat
 * @LastEditTime : 2021-11-19 14:04:44
 */
import { AnyObject } from "igu/lib/core/utils";
import asyncRoutes from '@router/core/asyncRoutes';
import constantRoutes from '@router/core/constantRoutes';
import type { RouteLocationNormalized, RouteRecordRaw } from "vue-router";

export interface RouterState {
    routes: AnyObject[],
    addRoutes: RouteLocationNormalized[] | any
    paths: string[]
}

function hasPermission(permissions: Array<RouteLocationNormalized>, route: RouteLocationNormalized) {
    if (route.name) {
        return permissions.some((permission: RouteLocationNormalized) => route !== permission)
    } else {
        return true
    }
};

function resetRoute(params: any[], url: string = "", arr: string[] = []) {
    let sub: string[] = [];
    return [...params.map(({ redirect, path, children }) => {
        let src = url || "";
        redirect ? (src = redirect) : (src += (/^\/(.*?)$/.test(path)) ? path : path ? `/${path}` : "");
        children && (sub = resetRoute(children, src, arr));
        return src;
    }), ...arr, ...sub];
};

export function filterAsyncRoutes(routes: RouteRecordRaw[], permissions: RouteLocationNormalized[]) {
    const res: Array<RouteLocationNormalized> = [];
    routes.forEach((route: any) => {
        const tmp = { ...route };
        if (tmp.children && tmp.children.length > 0) {
            tmp.children = filterAsyncRoutes(tmp.children, permissions);
            if (tmp.children.length > 0) {
                res.push(tmp);
            };
        } else {
            if (hasPermission(permissions, tmp)) {
                res.push(tmp);
            }
        };
    });
    return res;
};



const state: RouterState = {
    routes: [],
    addRoutes: [],
    paths: []
};

const actions = {
    generateRoutes: (iState: RouterState, routes: RouteLocationNormalized[]) => {
        iState.paths = resetRoute(filterAsyncRoutes(asyncRoutes, routes));
        iState.addRoutes = routes;
        iState.routes = constantRoutes.concat(routes);
    }
};

export default {
    namespaced: true,
    state,
    actions
}
