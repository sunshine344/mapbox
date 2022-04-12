/*
 * @Autor        : Pat
 * @Description  : Warning Text
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-11-01 18:56:41
 * @LastEditors  : Pat
 * @LastEditTime : 2022-04-12 14:55:54
 */
import { output } from '@shared/_utlis';
export const message = {
	userLoginOk: '登录成功。',
	userNameEnter: '请输入用户名',
	userPasswordenter: '请输入用户密码',
	passwordInvalid: '密码错误！',
	internalError: '系统内部错误！请联系管理员。',
	userNameOrPasswordIncorrect: '用户名或者密码错误',
	userNameIsNull: '用户名不能为空！',
	passwordIsNull: '密码不能为空！',
};
/**
 * @description: output Message
 * @param {string} arg
 * @param {string} arg1
 * @return {*}
 * @Date: 2021-11-02 16:04:14
 * @author: Pat
 */
export const outputMessage = (arg: string, arg1?: string): any => output(arg, arg1, message);
