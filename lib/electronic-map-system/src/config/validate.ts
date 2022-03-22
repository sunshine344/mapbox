/*
 * @Autor        : Pat
 * @Description  : validate
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-11-02 16:39:35
 * @LastEditors  : Pat
 * @LastEditTime : 2021-12-13 18:14:32
 */
import { AnyObject } from "igu/lib/core/utils";
// 不能输入特殊符号
export const not_edit_special_symbol = [
    {
        validator: async (_rule: AnyObject, value: string) => {
            const txt: AnyObject = /^[\u4e00-\u9fa5a-z0-9_-]+$/gi;
            if (!txt.test(value)) {
                return Promise.reject("不能输入特殊符号，如：！#￥%!");
            } else {
                return Promise.resolve();
            }
        },
        trigger: ['change', 'blur']
    },
]
// 用户名验证
export const userName = [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    ...not_edit_special_symbol
];
// 用户密码验证
export const password = [
    { required: true, message: '请输入密码', trigger: 'blur' }
];