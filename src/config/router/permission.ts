/*
 * @Autor        : Pat
 * @Description  : Router intercept processing
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-02-30 10:40:45
 * @LastEditors  : Pat
 * @LastEditTime : 2022-04-12 15:10:34
 */
import { setup } from '@shared/storage';
import { isEqual } from 'igu/lib/core/basic';
import { outputStore, actions } from '@store';
import asyncRoutes from '@router/core/asyncRoutes';
import { cloneDeep, AnyObject } from 'igu/lib/core/utils';
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { ref, Ref } from 'vue';
let currentRouters: any;
const _Str: AnyObject = String.prototype,
	_Arr: AnyObject = Array.prototype;
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
const setAllowBack = (allowBack: boolean) =>
	!allowBack && (setup('allowBack', false), history.pushState(null, '', location.href));

const setAsyncRoute = (fullPath: any) => {
	const [currentFullPath, n]: any[] = [fullPath.toSplit('/'), []];
	let currentRoutes = asyncRoutes,
		i = 1;
	while (i < currentFullPath.length && currentRoutes && currentRoutes.firstOf()) {
		let iRoute: any = currentRoutes.filter(({ path: iPaths }: AnyObject) =>
			iPaths.includes(currentFullPath[i]),
		);
		const iRouteChildren = iRoute && iRoute.length > 0 && iRoute[0].children;
		const iRouteLenPath =
			iRouteChildren && iRouteChildren.length > 0 && !iRouteChildren[0].path;
		iRoute && iRoute[0] && (iRoute = iRouteLenPath ? iRoute : iRoute[0]);
		const currentRoute = iRouteLenPath
			? cloneDeep(iRoute)[0]
			: cloneDeep({ ...iRoute, children: [] });
		iRoute && (n.firstOf() ? n.firstOf().children.push(currentRoute) : n.push(currentRoute));
		(i == currentFullPath.length &&
			n[0] &&
			(n[0].children = iRoute && iRoute[0] && iRoute[0].children)) ||
			[];
		currentRoutes = iRoute.children;
		i++;
	}
	return n;
};
const nextRef: Ref<(path?: string) => void> = ref((path?: string) => path);
/**
 * @description: To home
 * @param {string} path
 * @Date: 2021-12-17 11:34:37
 * @author: Pat
 */
const toHome: (path: string) => void = (path: string) => {
	if (path !== '/home' && path == '/') {
		nextRef.value('/home');
	} else {
		nextRef.value();
	}
};
/**
 * @description: To login
 * @param {string} path
 * @param {boolean} isAuth
 * @Date: 2021-12-17 11:34:37
 * @author: Pat
 */
const toLogin: (path: string) => void = (path: string) => {
	const user = outputStore('use.user.id');
	if (!user || path !== '/login') {
		nextRef.value('/login');
	} else {
		nextRef.value();
	}
};
/**
 * @description: set router
 * @param {AnyObject} param router object
 * @Date: 2021-03-30 11:02:42
 * @author: Pat
 */
export default function ({ beforeEach, addRoute, removeRoute }: AnyObject) {
	const home = (asyncRoutes || []).firstOf();

	home && addRoute(home);
	// This's vue router beforeEcah routers
	beforeEach(
		async (
			to: AnyObject,
			{ path: _fromPath }: RouteLocationNormalized,
			next: NavigationGuardNext,
		) => {
			const user = outputStore('use.user.id');
			const pageName = outputStore('config.config.systemName');
			const { paths } = outputStore('route');
			// let { code } = getUrlQuery(location.href);
			to.fromPath = _fromPath;
			const {
				path: _toPath,
				meta: { name: _toMetaTitle, allowBack, isAuth },
				name: _toName,
				fullPath,
			} = to as AnyObject;
			// Used as a login page, the browser cannot move forward or backward
			// Exist current to router name
			// Document title is current to router name
			document.title = `${pageName ? `${pageName} - ` : ''}${_toMetaTitle || _toName}`;
			// Not's allowBack set localStorage item allowBack is allowBack
			// Set current history is current location href
			setAllowBack(allowBack);
			nextRef.value = next;
			if (isAuth) {
				next();
			} else if (!user) {
				toLogin(_toPath);
			} else {
				const n = setAsyncRoute(_toPath);
				// Vue Router saves information on the history.state.
				// If you have any code manually calling history.pushState(),
				// you should likely avoid it or refactor it with a regular router.push() and a history.replaceState()
				// https://next.router.vuejs.org/guide/migration/#removal-of-unnamed-parameters
				// routes.forEach(({ path }: AnyObject) => history.replaceState({ ...history.state }, path));
				history.replaceState({ ...history.state }, _toPath);
				if (n.firstOf()) {
					actions.generateRoutes(n);
					if (!isEqual(currentRouters, n.firstOf())) {
						currentRouters = cloneDeep(n.firstOf());
						removeRoute(paths[0]);
						addRoute(currentRouters);
						// This's not exist router
						// This's router next path default path
						next(fullPath);
					} else {
						toHome(_toPath);
					}
				} else {
					toHome(_toPath);
				}
			}
		},
	);

	// onError(() => {});
}
