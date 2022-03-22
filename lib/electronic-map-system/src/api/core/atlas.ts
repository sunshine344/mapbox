import request, { errorCatch, src } from "../config/request";
/**
 * @description: 获取图册信息接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return {Promise<AnyObject>}
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
// 图册信息列表
export interface queryAtlasInfo {
    nowPage:number,
    pageSize:number,
    queryValue:string,
}
 export const GetAtlasInfo = (params: queryAtlasInfo): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/atlas/queryAtlasInfo`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})

/**
 * @description: 新增图册接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return {Promise<AnyObject>}
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
// 图册信息列表
export interface addInfo {
    file:object,
    serviceDictionaryId:null,
    serviceIntroduction:string,
    serviceName:string,
    coordinateDictionaryId:null,
    serviceRul:string
}
 export const addAtlasInfo = (params: addInfo): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/atlas/insertAtlasInfo`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})


/**
 * @description: 下拉接口
 * @param {params} params {USER_LOGIN_NAME USER_PASSWORD}
 * @return {Promise<AnyObject>}
 * @Date: 2020-07-31 14:54:01
 * @author: Pat
 */
// 图册信息列表
export interface queryDictionaryValue {
    dataType:number
}
 export const getQueryDictionaryValue = (params: queryDictionaryValue): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/dictionary/queryDictionaryValue`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})