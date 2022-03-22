/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 14:14:55
 * @LastEditors  : Pat
 * @LastEditTime : 2021-12-17 14:19:27
 */
import request, { errorCatch, src } from "../config/request";
/**
 * @description: 用户登录接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return {Promise<AnyObject>}
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
export interface userState {
    account: string,
    passWord: string
}
export const Login = (params: userState): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/user/login`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})


/**
 * @description: 获取用户信息接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return {Promise<AnyObject>}
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
// 用户信息列表
export interface userInfo {
    nowPage:number,
    pageSize:number,
    queryValue:string,
}
 export const GetAllUser = (params: userInfo): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/user/getAllUser`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})


/**
 * @description: 新增用户接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return {Promise<AnyObject>}
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
// 用户信息列表
export interface addUser {
    name:string,
    password:string,
    account:string,
    mobile:string,
    roleId:null,
    departmentName:string
}
 export const AddUser = (params: addUser): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/user/insertUser`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})

/**
 * @description: 编辑用户信息接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return {Promise<AnyObject>}
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
// 用户信息列表
export interface updatUser {
    name:string,
    password:string,
    account:string,
    mobile:string,
    roleId:null,
    departmentName:string,
    userId:null
}
 export const updateUser = (params: updatUser): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/user/updateUser`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})

/**
 * @description: 角色选择接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return {Promise<AnyObject>}
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
 export const getRole = (): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.get(`${src.value.BASE_URL}/role/getAllRole`).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})

/**
 * @description: 删除用户接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return {Promise<AnyObject>}
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
export interface delUser {
    userId:string,
}
 export const DeleteUser = (params: delUser): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/user/deleteUser`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})