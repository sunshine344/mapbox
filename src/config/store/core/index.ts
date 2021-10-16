/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-10-15 15:18:27
 * @LastEditors  : Pat
 * @LastEditTime : 2021-10-16 20:16:36
 */
import { reactive, readonly } from 'vue';
import { createPersistStorage } from "./stamina";

export interface IStore {
    state?: AnyObject;
    actions: AnyObject;
    modules?: AnyObject;
    [key: string]: any;
}

export function createState(State: IStore) {
    return reactive(State);
};

const updateAction = (state: AnyObject, action: AnyObject) => {
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

export function createStore<IState = AnyObject>(optons: IStore): IStore {
    const store: AnyObject = { state: {}, actions: {} };
    let state: AnyObject = {};
    const modules: any = optons?.modules;
    if (modules && typeof modules === "object") {
        Object.keys(modules).forEach((key: string) => {
            const currentStore: IStore = modules[key];
            if (currentStore) {
                store.state[key] = createPersistStorage<IState>(createState(currentStore.state as IStore), "default", true);//createPersistStorage<IState>();
                // // store.actions.test.updateToken("asdasdasdasd")
                // store.actions[key] = updateAction(store.state[key], currentStore.actions);

                // store.actions.updateToken("asdasdasdasd")
                const currentAction: AnyObject = updateAction(store.state[key], currentStore.actions);
                Object.keys(currentAction).forEach((actionKey: string) => (store.actions[actionKey] = currentAction[actionKey]));
            }
        });
    } else {
        // console.log(optons);
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