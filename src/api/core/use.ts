/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 14:14:55
 * @LastEditors  : Pat
 * @LastEditTime : 2022-04-15 17:56:21
 */
import { errorCatch, src } from '../config/request';
import { json } from '@elgis/request';
interface AnyObject {
	[key: string]: any;
}
// 用户登陆信息类型
export interface userState {
	userName: string;
	password: string;
}
/**
 * @description: 用户登录接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return {Promise<AnyObject>}
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
export const Login = (params: userState): Promise<AnyObject> =>
	new Promise((resolve, reject) => {
		json<userState, AnyObject>(`${src.value.BASE_URL}/user/login`, params)
			.then((res: AnyObject) => {
				resolve(res);
			})
			.catch((error: AnyObject) => {
				reject(error);
				errorCatch(error);
			});
	});
