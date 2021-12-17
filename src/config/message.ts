/*
 * @Autor        : Pat
 * @Description  : Warning Text
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-11-01 18:56:41
 * @LastEditors  : Pat
 * @LastEditTime : 2021-12-17 10:21:51
 */
import { output } from "@shared/_utlis";
export const message = {
    "user_login_ok": "登录成功。",
    "user_name_enter": "请输入用户名",
    "user_password_enter": "请输入用户密码",
    "password_invalid": "密码错误！",
    "internal_error": "系统内部错误！请联系管理员。",
    "user_name_or_password_incorrect": "用户名或者密码错误",
    "user_name_is_null": "用户名不能为空！",
    "password_is_null": "密码不能为空！",
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