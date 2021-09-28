/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 14:14:55
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-26 16:43:46
 */
import request, { src } from "../config/request";
/**
 * @description: 用户登录接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return: USER_INFO
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
export const Login = async (params: any) => await request('post', `${src.BASE_URL}/login/submit`, params);