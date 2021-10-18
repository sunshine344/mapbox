/*
 * @Autor        : Pat
 * @Description  : User Store
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-02-19 16:24:08
 * @LastEditors  : Pat
 * @LastEditTime : 2021-10-18 10:22:07
 */
export interface UserState {
    user: AnyObject,
    collapseState: boolean,
    [key: string]: any
}

export interface UserActions {
    setUser: Function,
    setCollapse: Function
}


const state: UserState = {
    user: {},
    collapseState: false
}

const actions: UserActions = {
    setUser: (iState: UserState, user: AnyObject) => {
        iState.user = user;
    },
    setCollapse: (iState: UserState, collapseState: boolean) => {
        iState.collapseState = collapseState;
    }
};

export default {
    namespaced: true,
    state,
    actions
}
