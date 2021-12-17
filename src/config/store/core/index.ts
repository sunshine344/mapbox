/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-10-18 10:57:51
 * @LastEditors  : Pat
 * @LastEditTime : 2021-11-08 15:50:46
 */
import { reactive, readonly } from 'vue';
import { createPersistStorage } from "./stamina";

export interface IStore {
    state?: AnyObject;
    actions: AnyObject;
    modules?: AnyObject;
    [key: string]: any;
}
/**
 * @description: Create storage state
 * @param {IStore} State store config optons
 * @return {AnyObject}
 * @Date: 2021-10-16 20:28:03
 * @author: Pat
 */
export function createState(State: IStore): AnyObject {
    return reactive(State);
};

/**
 * @description: update store action
 * @param {AnyObject} state store state object
 * @param {AnyObject} action store action function
 * @return {AnyObject}
 * @Date: 2021-10-16 20:26:38
 * @author: Pat
 */
const updateAction = (state: AnyObject, action: AnyObject): AnyObject => {
    const cuurentActions: AnyObject = {};
    Object.keys(action).forEach((key: string) => {
        const actionValue = action[key];
        if (typeof actionValue === "function") {
            cuurentActions[key] = (value: any) => actionValue(state, value);
        } else {
            cuurentActions[key] = actionValue;
        }
    });
    return cuurentActions;
}
/**
 * @description: Create storage space
 * @param {IStore} optons store config optons object
 * @return {IStore}
 * @Date: 2021-10-16 20:25:33
 * @author: Pat
 */
export function createStore<IState = AnyObject>(optons: IStore): IStore {
    const store: AnyObject = { state: {}, actions: {} };
    let state: AnyObject = {};
    const modules: any = optons?.modules;
    if (modules && typeof modules === "object") {
        Object.keys(modules).forEach((key: string) => {
            const currentStore: IStore = modules[key];
            if (currentStore) {
                store.state[key] = createPersistStorage<IState>(createState(currentStore.state as IStore), key, true);
                // // store.actions.test.updateToken("asdasdasdasd")
                // store.actions[key] = updateAction(store.state[key], currentStore.actions);

                // store.actions.updateToken("asdasdasdasd")
                const currentAction: AnyObject = updateAction(store.state[key], currentStore.actions);
                Object.keys(currentAction).forEach((actionKey: string) => (store.actions[actionKey] = currentAction[actionKey]));
            }
        });
    } else {
        optons && Object.keys(optons).forEach((key: string) => {
            const value: any = optons[key];
            if (key === "state") {
                state = createState(value);
                store[key] = createPersistStorage<IState>(state);
            } else if (key === "actions") {
                store[key] = readonly(updateAction(state, value));
            } else {
                store[key] = readonly(value);
            }
        })
    }
    return store as IStore;
};