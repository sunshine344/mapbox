/*
 * @Autor        : Pat
 * @Description  : User Store
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-02-19 16:24:08
 * @LastEditors  : Pat
 * @LastEditTime : 2021-12-17 10:44:17
 */
import { config, api } from "@config/amb";
import { objectEach } from "igu/lib/core/utils";

export interface ConfigState {
    base: AnyObject,
    api: AnyObject,
}

export interface SysActions {
    setBase: Function,
    setApi: Function,
    setConfig: Function,
}


const state: ConfigState = {
    base: config,
    api
}

const actions: SysActions = {
    setBase: (iState: ConfigState, config: AnyObject) => {
        iState.base = config;
    },
    setApi: (iState: ConfigState, api: AnyObject) => {
        iState.api = api;
    },
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
