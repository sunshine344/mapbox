import request, { errorCatch, src } from "../config/request";
/**
 * @description: 获取日志信息接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return {Promise<AnyObject>}
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
// 用户信息列表
export interface getLogInfo {
    nowPage:number,
    pageSize:number,
    queryValue:string,
}
 export const Getjournal = (params: getLogInfo): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/log/getLogInfo`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})