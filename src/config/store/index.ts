/*
 * @Autor        : Pat
 * @Description  : Vuex config
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-02-19 16:24:08
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-18 16:26:26
 */
import type { App } from 'vue';
import { createStore } from 'vuex';
import { AnyObject } from "igu/core/utils";
import { eachModules } from "@shared/_utlis";
// Set global vuex getters
let modules: AnyObject = {}, getter: AnyObject = {};
// The import.meta object exposes context-specific metadata to a JavaScript module. 
// It contains information about the module, like the module 's URL.
// https://developer.mozilla.org/zh-cn/docs/web/javascript/reference/statements/import.meta
// Get all the folders under the modules folder, 
// traverse the file object to set Vuex modules and getters
eachModules(import.meta.globEager('./**/*.ts'), (key: string, { default: itemCentent }: AnyObject) => {
    if (key.indexOf("modules") >= 0) {
        let modulesName = key.split("/")[key.split("/").length - 1].replace(/\.ts|.js/, "");
        modules[modulesName] = itemCentent;
        Object.keys(itemCentent.state).map(stateName => getter[stateName] = (state: any) => state[modulesName][stateName])
    }
});
// Create vuex store
// set modules getters and strict
// https://next.vuex.vuejs.org/
const store = createStore({ modules, getters: getter, strict: false });
export const commit = store.commit;
export const dispatch = store.dispatch;
export const getters = store.getters;
export const state = store.state;
/**
 * @description: setup use store
 * @param {App<Element>} app 
 * @Date: 2021-01-28 15:28:43
 * @author: Pat
 */
export const setupStore = (app: App<Element>): any => app.use(store);
// Throw current store
export default store;