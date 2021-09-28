/*
 * @Autor        : Pat
 * @Description  : Router intercept processing
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-02-30 10:40:45
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-26 14:34:00
 */
import asyncRoutes from "@router/core/asyncRoutes";
import { getsub, setup } from "@shared/storage";
import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import { cloneDeep, AnyObject } from "igu/core/utils";
import { isEqual } from "igu/core/basic";
let currentRouters: any;
let _Str: AnyObject = String.prototype, _Arr: AnyObject = Array.prototype;;
_Str.toSplit = function (str: string) {
    return this.includes(str) && this.split(str);
};
_Arr.firstOf = function () {
    return this.length > 0 && this[0];
};
/**
 * @description: set allow back
 * @param {boolean} allowBack Verify that the browser can fall back
 * @Date: 2021-03-29 11:49:03
 * @author: Pat
 */
const setAllowBack = (allowBack: boolean) => (!allowBack) && (setup("allowBack", false), history.pushState(null, "", location.href));
/**
 * @description: set router
 * @param {AnyObject} param router object
 * @Date: 2021-03-30 11:02:42
 * @author: Pat
 */
export default function ({ beforeEach, addRoute, getRoutes, afterEach, removeRoute }: AnyObject) {
    let home = (asyncRoutes || []).firstOf();
    try { home && addRoute(home) } catch (error) { }
    afterEach(() => { });
    // This's vue router beforeEcah routers
    beforeEach(async (to: RouteLocationNormalized, { path: _fromPath }: RouteLocationNormalized, next: NavigationGuardNext) => {
        const token = getsub("token");
        // let { code } = getUrlQuery(location.href);
        let { path: _toPath, meta: { name: _toMetaTitle, allowBack }, name: _toName, fullPath } = to as AnyObject;
        // Used as a login page, the browser cannot move forward or backward
        // Exist current to router name
        // Document title is current to router name
        document.title = `${_toMetaTitle || _toName}`;
        // Not's allowBack set localStorage item allowBack is allowBack
        // Set current history is current location href
        setAllowBack(allowBack);
        if (!token) {
            if (_toPath != "/login") {
                next("/login");
            } else {
                next();
            }
        } else {
            let [currentFullPath, i, n, currentRoutes]: any[] = [fullPath.toSplit("/"), 1, [], asyncRoutes];
            while (i < currentFullPath.length && currentRoutes && currentRoutes.firstOf()) {
                let iRoute: any = currentRoutes.filter(({ path: iPaths }: AnyObject) => iPaths.includes(currentFullPath[i]));
                let iRouteChildren = iRoute && iRoute.length > 0 && iRoute[0].children;
                let iRouteLenPath = iRouteChildren && iRouteChildren.length > 0 && !iRouteChildren[0].path;
                iRoute && iRoute[0] && (iRoute = iRouteLenPath ? iRoute : iRoute[0]);
                let currentRoute = iRouteLenPath ? cloneDeep(iRoute)[0] : cloneDeep({ ...iRoute, children: [] });
                iRoute && (n.firstOf() ? n.firstOf().children.push(currentRoute) : n.push(currentRoute));
                i == currentFullPath.length && n[0] && (n[0].children = iRoute && iRoute[0] && iRoute[0].children) || [];
                currentRoutes = iRoute.children;
                i++;
            };

            // Vue Router saves information on the history.state. 
            // If you have any code manually calling history.pushState(), 
            // you should likely avoid it or refactor it with a regular router.push() and a history.replaceState()
            // https://next.router.vuejs.org/guide/migration/#removal-of-unnamed-parameters
            getRoutes().forEach(({ path }: AnyObject) => history.replaceState({ ...history.state }, path));
            if (n.firstOf()) {
                let nChild = n.firstOf() && n.firstOf().children && n.firstOf().children.firstOf();
                if (!isEqual(currentRouters, n.firstOf()) && nChild && nChild.name) {
                    addRoute(n.firstOf());
                    currentRouters = cloneDeep(n.firstOf());
                    // This's not exist router
                    // This's router next path default path
                    next(_toPath);
                } else {
                    next()
                }
            } else {
                if (_toPath === "/home") {
                    next()
                } else {
                    next("/home");
                }
            }
        }
    })
}