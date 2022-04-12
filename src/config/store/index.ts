/*
 * @Autor        : Pat
 * @Description  : Vuex config
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-02-19 16:24:08
 * @LastEditors  : Pat
 * @LastEditTime : 2022-04-12 14:50:22
 */
import type { App } from 'vue';
import { createStore } from './core';
import { AnyObject } from 'igu/lib/core/utils';
import { eachModules, output } from '@shared/_utlis';
import { removeSub } from '@shared/storage';
import { APP_CONFIG_STORE_NAME } from '../enum';
// Set global vuex getters
const modules: AnyObject = {},
	iActions: AnyObject = {};
// The import.meta object exposes context-specific metadata to a JavaScript module.
// It contains information about the module, like the module 's URL.
// https://developer.mozilla.org/zh-cn/docs/web/javascript/reference/statements/import.meta
// Get all the folders under the modules folder,
// traverse the file object to set Vuex modules and getters
eachModules(
	import.meta.globEager('./**/*.ts'),
	(key: string, { default: itemCentent }: AnyObject) => {
		if (key.indexOf('modules') >= 0) {
			const modulesName = key.split('/')[key.split('/').length - 1].replace(/\.ts|.js/, '');
			modules[modulesName] = itemCentent;
			// Object.keys(itemCentent.state).map(stateName => {
			//     iActions[stateName] = (state: any) => {
			//         state[modulesName][stateName]
			//     }
			// })
		}
	},
);
// Create vuex store
// set modules getters and strict
// https://next.vuex.vuejs.org/
const store = createStore({ modules, actions: iActions, strict: false });
export const actions: AnyObject = store.actions || {};
export const state: AnyObject = store.state || {};

export const clearState = (name?: string) => {
	if (!name) {
		removeSub(APP_CONFIG_STORE_NAME);
		return;
	}
	state[name] = null;
};
/**
 * @description: setup use store
 * @param {App<Element>} app
 * @Date: 2021-01-28 15:28:43
 * @author: Pat
 */
export const setupStore = (app: App<Element>): any => app.use(store as any);
/**
 * @description: output store
 * @param {string} key
 * @param {string} key0
 * @return {*}
 * @Date: 2021-11-02 15:59:14
 * @author: Pat
 */
export const outputStore: (key: string, key0?: string | string[]) => any = (
	key: string,
	key0?: string | string[],
): any => output(key, key0, store.state as []);
// Throw current store
export default store;
