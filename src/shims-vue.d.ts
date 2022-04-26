/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 15:08:43
 * @LastEditors  : Pat
 * @LastEditTime : 2022-04-26 13:11:04
 */
declare module '*.vue' {
	import Vue from 'vue';
	export default Vue;
}

declare module '@api/core/use' {
	export const Login: (use: { username: string; password: string }) => Promise<any>;
	const components: any;
	export default components;
}

declare module '@api/config/request' {
	export const requestApi: (callback?: (api: AnyObject) => AnyObject) => void;
	const components: any;
	export default components;
}

declare module '@config/amb' {
	export const api: AnyObject;
	export const config: AnyObject;
	export const ENV: string;
	export default AnyObject;
}

declare module '@components/*' {
	const components: any;
	export default components;
}

declare module '@shared/_utlis' {
	export const output: (str: string, option?: any, key?: any) => any;
	export const isType: (d: any, str: string) => string;
	export const eachModules: (
		arr: AnyObject,
		callback: (key: any, item: AnyObject) => void,
	) => any;
}

// declare module all files type
// Prevent errors during development
declare module '@shared/storage' {
	export const getsub: (name: string) => any;
	export const removeSub: (args: string | string[]) => void;
	export const setup: (name: string, value: any) => void;
	export default Storage;
}

declare module '@shared/rem' {
	const rem: any;
	export default rem;
}

declare module '@router/core/*' {
	const routercore: any;
	export default routercore;
}

declare module '@/init/amb' {
	const amb: any;
	export default amb;
}

declare module '@router' {
	import { Router } from 'vue-router';
	const route: Router;
	export const setRoute: (app: any) => void;
	export default route;
}

declare module '@store' {
	const store: any;
	export const actions: AnyObject;
	export const state: AnyObject;
	export const outputStore: (key: string, key0?: string | string[]) => any;
	export const clearState: (name?: string) => void;
	export default store;
}

declare interface StorageOption {
	value: any;
	expires: number | string;
	startTime: number;
}

declare interface StorageItem {
	key: string;
	value: string;
}

declare interface AnyObject {
	[key: string]: any;
}

interface RequestObject {
	data: AnyObject;
	msg: string;
	code: number;
}

declare module '@config/message' {
	export const outputMessage: (arg: string, arg1?: string) => any;
	export const Message: AnyObject;
}

declare module '@config/type/global' {
	export const StorageOption: StorageOption;
	export const RequestObject: RequestObject;
	export const StorageItem: StorageItem;
	export const AnyObject: AnyObject;
}
