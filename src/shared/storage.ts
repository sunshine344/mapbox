/*
 * @Autor        : Pat
 * @Description  : Storage Config
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-12-15 11:47:20
 * @LastEditors  : Pat
 * @LastEditTime : 2022-04-12 15:03:50
 */
import { config } from '@config/amb';
import { isArray, isObject, isString } from 'igu/lib/core/basic';
import { objectEach } from 'igu/lib/core/utils';
const sysType: string = config?.sysType || '';
// 缓存时间 always
const expiresTime = 60 * 1000 * 60 * 12;
export declare interface StorageOption {
	value: any;
	expires: number | string;
	startTime: number | string;
}
const Storage = window.localStorage || globalThis.localStorage;
function isJSON(str: string) {
	if (typeof str == 'string') {
		try {
			JSON.parse(str);
			return true;
		} catch (e) {
			return false;
		}
	}
	return false;
}

/**
 * @description: All English strings are converted to lowercase, the first letter is uppercase
 * @param {string} str
 * @return {string}
 * @Date: 2021-01-27 10:22:59
 * @author: Pat
 */
export function Case(str: string): string {
	return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
}
/**
 * @description: set storage item
 * @param {string} name storage name
 * @param {any} params storage data
 * @param {number} expires storage effective time. Set to 'always' to save.The default is one day. (Milliseconds)
 * @return {any}
 * @Date: 2021-01-27 10:50:34
 * @author: Pat
 */
export function setup(name: any, params: any, expires: string | number = expiresTime): any {
	if (isArray(name)) {
		name.forEach((item: any, i: any) => setup(item, params[i], expires));
		return;
	} else if (isObject(name)) {
		objectEach(name, (i: any, item: string | number) => setup(item, i, expires));
		return;
	} else if (isString(name)) {
		name = `${sysType}${name}`;
		Storage.setItem(
			name,
			JSON.stringify({
				// Storage option params
				value: params,
				// Expiration time, set to always to save
				expires,
				// Record when the value is stored in the cache, milliseconds
				startTime: expires === 'always' ? expires : new Date().getTime(),
			}),
		);
	}
}
/**
 * @description: get storage item
 * @param {string} name storage name
 * @return {any}
 * @Date: 2021-01-27 10:51:50
 * @author: Pat
 */
export function getsub(name: string): any {
	name = `${sysType || ''}${name}`;
	let item: string | null | any = Storage.getItem(name);
	if (isJSON(item)) item = JSON.parse(item);
	if (item) {
		// has the value of startTime
		// set expiration time
		if (item.startTime != 'always') {
			const date: number = new Date().getTime();
			// invalidate clear cache false
			if (isNaN(item.expires) || date - item.startTime > (item?.expires || 0)) {
				removeSub(name);
				return false;
			}
			return item?.value || item;
		}
		// No expiration time is set, return directly
		return item?.value || item;
	}
	return false;
}
/**
 * @description: Remove storage item
 * @param {string} name storage name
 * @return {any}
 * @Date: 2021-01-27 10:56:34
 * @author: Pat
 */
export function removeSub(...name: any): any {
	if (!name) {
		clear();
		return;
	}
	if (Array.isArray(name)) {
		name.forEach((str: string) => Storage.removeItem(str));
	} else {
		name = `${sysType}${name}`;
		Storage.removeItem(name);
	}
}

/**
 * @description: Clear storage item
 * @return {any}
 * @Date: 2021-01-27 10:57:19
 * @author: Pat
 */
export function clearAll(): any {
	Storage.clear();
}

export const clear = clearAll;

export default Storage;
