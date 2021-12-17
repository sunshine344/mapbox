/*
 * @Autor        : Pat
 * @Description  : User Store
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-02-19 16:24:08
 * @LastEditors  : Pat
 * @LastEditTime : 2021-12-17 14:37:17
 */
import { config, api, ENV } from "@config/amb";
import { objectEach } from "igu/lib/core/utils";

export interface ConfigState {
    config: AnyObject,
    api: AnyObject,
    ENV: string
}

export interface SysActions {
    setConfig: Function,
}


const state: ConfigState = {
    config,
    api,
    ENV
}

const actions: SysActions = {
    setConfig: (iState: AnyObject, config: ConfigState) => {
        objectEach(config, (item: AnyObject, key: string) => {
            iState[key] = item;
        });
    },
};

export default {
    namespaced: true,
    state,
    actions
}
