/*
 * @Autor        : Pat
 * @Description  : Config utlis
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-01-29 12:39:06
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-24 16:19:32
 */
import { AnyObject } from "igu/core/utils";
/**
 * @description: Output object parameters based on array conditions
 * @param {AnyObject} object Object to be processed
 * @param {Array} option Parameters to be output
 * @return {string}
 * @Date: 2021-01-29 14:01:05
 * @author: Pat
 */
function emit(object: AnyObject, option: Array<string> | string | any = null): string {
    if (isType(option, "array")) {
        let current: any = option[0];
        if (option.length === 1) {
            return current;
        }
        return emit(object[current], rmArr(option, current));
    };
    if (!option) {
        return ""
    };
    return object[option];
};
/**
 * @description: Output object zhiding parameters according to array conditions
 * @param {string} configKey Object specified parameters
 * @param {Array} option Array condition
 * @param {AnyObject} defaultObject Output object raw data
 * @return {string | AnyObject | Array<any> | number}
 * @Date: 2021-01-29 14:05:54
 * @author: Pat
 */
export function output(configKey: string | null, option: Array<string> | string = "", defaultObject: AnyObject = {}): any {
    let value, current = defaultObject;
    // Not current object specified parameters
    // Return current output object raw data
    if (!configKey) {
        return current;
    }
    // As array condition to array or string
    // Output object parameters based on array conditions
    if (option) {
        return emit(current[configKey], option);
    }
    const array = configKey.split('.');
    // Object specified parameters contain '.'
    // Then split '.'
    // converted to an array
    // output the corresponding object parameters
    for (let i = 0, j = array.length; i < j; i++) {
        const property = array[i];
        value = current[property];
        if (!value) {
            return '';
        }
        if (i === j - 1) {
            return value;
        }
        current = value;
    }
    return '';
};
/**
 * @description: Delete the specified parameter in the array
 * @param {Array} array Array to be processed
 * @param {any} key Parameters to be deleted
 * @return {Array<any>}
 * @Date: 2021-01-29 13:56:46
 * @author: Pat
 */
export function rmArr(array: Array<any>, key: any): Array<any> {
    let index = array.indexOf(key);
    if (index > -1) {
        array.splice(index, 1);
    };
    return array
};
/**
 * @description: Convert English strings to uppercase letters
 * @param {string} str English strings
 * @return {string}
 * @Date: 2021-01-29 14:08:30
 * @author: Pat
 */
export const stringCase = (str: string): string => str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
/**
 * @description: Determine whether the data type is not specified
 * @param {any} obj Metadata
 * @param {string} type Specify data type
 * @return {boolean}
 * @Date: 2021-01-29 14:08:30
 * @author: Pat
 */
export const isType = (obj: any, type: string): boolean => Object.prototype.toString.call(obj) === `[object ${stringCase(type.toLowerCase())}]`;
/**
 * @description: Output the specified file in the specified folder
 * @param {AnyObject} folderObject folder content object
 * @param {Function} callback
 * @return {any}
 * @Date: 2021-01-29 14:12:08
 * @author: Pat
 */
export function eachModules(folderObject: AnyObject | any, callback: Function): any {
    Object.keys(folderObject).forEach((key: string) => {
        callback(key, folderObject[key]);
    });
};