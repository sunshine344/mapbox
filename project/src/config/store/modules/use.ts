/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-10-15 15:35:30
 * @LastEditors  : Pat
 * @LastEditTime : 2022-04-12 14:30:15
 */
// import { createStore, IStore } from "../core";

interface AnyObject {
	[key: string]: any;
}
export interface IState {
	code: string;
	token: string;
	user: AnyObject;
}

const state: IState = {
	code: '',
	token: '',
	user: {},
};

const updateToken = (iState: IState, token: string) => {
	iState.token = token;
};

const updateUser = (iState: IState, user: AnyObject) => {
	iState.user = user;
};

export default {
	state,
	actions: { updateToken, updateUser },
};
