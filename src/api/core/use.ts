/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 14:14:55
 * @LastEditors  : Pat
 * @LastEditTime : 2021-12-17 14:19:27
 */
import request, { errorCatch, src } from "../config/request";
// 用户登陆信息类型
export interface userState {
    userName: string,
    password: string
}
/**
 * @description: 用户登录接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return {Promise<AnyObject>}
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
export const Login = (params: userState): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.json(`${src.value.BASE_URL}/user/login`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})