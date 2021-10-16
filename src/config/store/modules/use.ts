/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-10-15 15:35:30
 * @LastEditors  : Pat
 * @LastEditTime : 2021-10-16 19:18:28
 */
// import { createStore, IStore } from "../core";

export interface IState {
    code: string
    token: string
    user: AnyObject
}

const state: IState = {
    code: '',
    token: '',
    user: {}
}


const updateToken = (iState: IState, token: string) => {
    iState.token = token;
};

const updateUser = (iState: IState, user: AnyObject) => {
    iState.user = user
};

export default {
    state,
    actions: { updateToken, updateUser },
    test: '123123123'
};