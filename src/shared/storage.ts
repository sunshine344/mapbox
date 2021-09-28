/*
 * @Autor        : Pat
 * @Description  : Storage Config
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-12-15 11:47:20
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-27 16:41:33
 */
import amb from "@/init/amb";
import { isArray, isObject, isString } from "igu/core/basic";
import { objectEach } from "igu/core/utils";
export declare interface StorageOption {
    value: any,
    expires: number | string,
    startTime: number
}
const Storage = window.localStorage || (window.global.localStorage || global.localStorage);
/**
 * @description: Determine whether the data type is the specified type
 * @param {any} obj all data type
 * @param {string} type specified type
 * @return {boolean} Whether the specified type
 * @Date: 2021-01-27 10:20:37
 * @author: Pat
 */
function isType(obj: any, type: string = "object"): boolean {
    return Object.prototype.toString.call(obj) === `[object ${Case(type.toLowerCase())}]`
};
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
function Case(str: string): string {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
};
/**
 * @description: set storage item
 * @param {string} name storage name
 * @param {any} params storage data
 * @param {number} expires storage effective time. Set to 'always' to save.The default is one day. (Milliseconds)
 * @return {any}
 * @Date: 2021-01-27 10:50:34
 * @author: Pat
 */
export function setup(name: any, params: any, expires: string | number = (60 * 1000) * 60 * 24): any {
    if (isArray(name)) {
        name.forEach((item, i) => setup(item, params[i], expires));
        return;
    } else if (isObject(name)) {
        objectEach(name, (i: any, item: string | number) => setup(item, i, expires));
        return;
    } else if (isString(name)) {
        name = `${amb.sysType || ''}${name}`;
        let options: StorageOption = {
            // Storage option params
            value: params,
            // Expiration time, set to always to save
            expires: expires,
            // Record when the value is stored in the cache, milliseconds
            startTime: new Date().getTime()
        }
        if (options.expires === "always") {
            Storage.setItem(name, JSON.stringify(options));
            return;
        }
        if (isType(options.value, "Object")) {
            options.value = JSON.stringify(options.value);
        } else if (isType(options.value, "Array")) {
            options.value = JSON.stringify(options.value);
        }
        Storage.setItem(name, options.value);
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
    name = `${amb.sysType || ''}${name}`;
    let item: string | null | any = Storage.getItem(name);
    if (isJSON(item)) {
        item = JSON.parse(item);
    }
    if (item) {
        // has the value of startTime
        // set expiration time
        if (item.startTime) {
            let date: number = new Date().getTime();
            // invalidate clear cache false
            if (date - item.startTime > item.expires) {
                removeSub(name);
                return false;
            }
            return item.value;
        }
        // No expiration time is set, return directly
        return item;
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
    if (!name) { clear(); return; };
    !Array.isArray(name) && Storage.removeItem(name.includes(`${amb.sysType || ''}`) ? name : `${amb.sysType || ''}${name}`);
    Array.isArray(name) && name.forEach((str: string) => Storage.removeItem(str.includes(`${amb.sysType || ''}`) ? str : `${amb.sysType || ''}${str}`));
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