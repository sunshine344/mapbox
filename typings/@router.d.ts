

declare module '@router' {
	import type { App } from 'vue';
	import type { Router } from 'vue-router';
	export const setRoute: (app: App<Element>) => void;
	export default Router;
}

declare module '@router/core/constantRoutes' {
	import type { RouteRecordRaw } from 'vue-router';
	const constantRoutes:RouteRecordRaw[];
	export default constantRoutes;
}

declare module '@router/core/asyncRoutes' {
	import type { RouteRecordRaw } from 'vue-router';
	const asyncRoutes:RouteRecordRaw[];
	export default asyncRoutes;
}
