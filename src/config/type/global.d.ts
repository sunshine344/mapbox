/*
 * @Autor        : Pat
 * @Description  : Global
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-01-27 10:31:23
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-28 14:27:21
 */
export declare interface StorageOption {
    value: any,
    expires: number | string,
    startTime: number
}

export declare interface StorageItem {
    key: string,
    value: string
}

export declare interface AnyObject {
    [key: string]: any;
}


export interface RequestObject {
    data: AnyObject,
    msg: string,
    code: number
}