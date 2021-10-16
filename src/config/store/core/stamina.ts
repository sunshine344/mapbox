/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-10-15 15:06:27
 * @LastEditors  : Pat
 * @LastEditTime : 2021-10-16 20:13:16
 */
import { watch, toRaw, readonly, reactive } from 'vue';
const STORAGE_KEY = '--APP-STORAGE--'
function setItem(key: string, state: any) {
    const stateRow = getItem()
    stateRow[key] = state
    const stateStr = JSON.stringify(stateRow)
    localStorage.setItem(STORAGE_KEY, stateStr)
};
function getItem(key?: string) {
    const stateStr = localStorage.getItem(STORAGE_KEY) || '{}'
    const stateRow = JSON.parse(stateStr) || {}
    return key ? stateRow[key] || {} : stateRow
};
export function createPersistStorage<T>(state: any, key = 'default', isModel: boolean = false): T {
    Object.entries(getItem(key)).forEach(([key, value]) => (state[key] = value));
    watch(state, () => setItem(key, toRaw(state)));
    return isModel ? reactive(state) : readonly(state)
}