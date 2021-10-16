/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 15:08:43
 * @LastEditors  : Pat
 * @LastEditTime : 2021-10-16 19:09:10
 */
declare module "*.vue" {
	import Vue from "vue";
	export default Vue;
}

declare module "@/amb" {
	export const api: AnyObject;
	export const config: AnyObject;
	export const ENV: string;
	export default AnyObject;
}

declare module "@components/*" {
	const components: any;
	export default components;
}


// declare module "*" {
// 	const file: any;
// 	export default file;
// }

// declare module all files type
// Prevent errors during development
declare module "@shared/storage" {
	export const getsub: Function;
	export const setup: Function;
	export const removeSub: Function;
	export const clearAll: Function;
	export const clear: Function;
	export default Storage;
}

declare module "@shared/rem" {
	const rem: any;
	export default rem;
}

declare module "@shared/_utlis" {
	export const output: Function;
	export const rmArr: Function;
	export const stringCase: Function;
	export const isType: Function;
	export const eachModules: Function;
}

declare module "@api/core/use" {
	export const Login: Function;
}

declare module "@router/core/*" {
	const routercore: any;
	export default routercore;
}

declare module "@/init/amb" {
	const amb: any;
	export default amb;
}

declare module "@router" {
	import { Router } from 'vue-router';
	const route: Router;
	export const setRoute: Function;
	export default route;
}
declare module "@store" {
	const store: any;
	export const actions: AnyObject;
	export const state: AnyObject;
	export default store;
}


declare interface StorageOption {
	value: any,
	expires: number | string,
	startTime: number
}

declare interface StorageItem {
	key: string,
	value: string
}

declare interface AnyObject {
	[key: string]: any;
}


interface RequestObject {
	data: AnyObject,
	msg: string,
	code: number
}

declare module "@config/type/global" {
	export const StorageOption: StorageOption;
	export const RequestObject: RequestObject;
	export const StorageItem: StorageItem;
	export const AnyObject: AnyObject;
}