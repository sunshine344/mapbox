/*
 * @Autor        : Pat
 * @Description  : User Store
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-02-19 16:24:08
 * @LastEditors  : Pat
 * @LastEditTime : 2021-10-18 18:33:46
 */
import { config, api } from "@config/amb";

export interface SysState {
    base: AnyObject,
    api: AnyObject,
}

export interface SysActions {
    setBase: Function,
    setApi: Function,
    setSysConfig: Function,
}


const state: SysState = {
    base: config,
    api
}

const actions: SysActions = {
    setBase: (iState: SysState, config: AnyObject) => {
        iState.base = config;
    },
    setApi: (iState: SysState, api: AnyObject) => {
        iState.api = api;
    },
    setSysConfig: (iState: SysState, { base, api }: SysState) => {
        iState.base = base;
        iState.api = api;
    },
};

export default {
    namespaced: true,
    state,
    actions
}
