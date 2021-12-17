/*
 * @Autor        : Pat
 * @Description  : stamina store
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-10-15 15:06:27
 * @LastEditors  : Pat
 * @LastEditTime : 2021-11-19 14:27:35
 */
import { setup, getsub } from '@shared/storage';
import { watch, toRaw, readonly, reactive } from 'vue';
import { APP_CONFIG_STORE_NAME } from "../../enum";

const setItem = (key: string, state: any) => {
    const stateRow = getsub(APP_CONFIG_STORE_NAME) || {};
    stateRow[key] = state;
    setup(APP_CONFIG_STORE_NAME, stateRow);
};
const getItem = (key?: string) => {
    const stateRow = getsub(APP_CONFIG_STORE_NAME);
    return (key ? stateRow[key] : stateRow) || {};
};
/**
 * @description: Create long storage space
 * @param {any} state  store state object
 * @param {string|undefined} key storage space name ,default 'default'
 * @param {boolean} isModel Whether it is a template group, if it is reactive, otherwise it will return readonly as a single unit
 * @return {AnyObject}
 * @Date: 2021-10-16 20:29:11
 * @author: Pat
 */
export function createPersistStorage<T>(state: any, key: string | undefined = 'default', isModel: boolean = false): T {
    Object.entries(getItem(key)).forEach(([key, value]) => (state[key] = value));
    watch(state, () => setItem(key, toRaw(state) || state));
    return isModel ? reactive(state) : readonly(state)
};