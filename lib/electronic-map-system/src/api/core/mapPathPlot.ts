/*
 * @Description: file content
 * @Author: xufeng
 * @Date: 2022-02-16 11:43:19
 * @LastEditTime: 2022-02-25 10:28:50
 * @FilePath: \project\src\api\core\mapPathPlot.ts
 */
import request, { errorCatch, src } from "../config/request";

/*************************************************es 接口查询 **************************************************************/

// 属性查询接口参数声明
export interface PropertyQuery {
    keyword: string,  
    pageIndex: number,
    pageSize: number,
    releaseId: string,
}
/**
 * @description: 属性查询接口
 * @param {propertyQuery} params 参数
 * @return {*}
 */
export const SearchProperty = (params: PropertyQuery): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.get(`${src.value.SEARCH_URL}/egis-space/space/search/property`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})


// 地址正向匹配参数
export interface MapLocation {
    location: string,  // 经纬度 "120,30"
    releaseId?: string, // 图层名称
}
/**
 * @description: 地址正向匹配
 * @param {MapLocation} params { location: 经纬度 }
 * @return {Promise<AnyObject>}
 */
export const SearchForward = (params: MapLocation): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.get(`${src.value.SEARCH_URL}/egis-space/space/search/forward`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})

// 地址逆向匹配参数
interface mapAddress {
    address: string,  // 地址关键词
    releaseId?: string,  // 图层名称
}
/**
 * @description: 地址逆向匹配
 * @param {mapLocation} params { address: 地址关键词 }
 * @return {Promise<AnyObject>}
 */
export const searchReverse = (params: mapAddress): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.get(`${src.value.SEARCH_URL}/egis-space/space/search/reverse`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})


// 路径检索-车参数
export interface RoutePlan {
    avoidDistance?:number,    // 避让距离    
    avoidPoints?: string,     // 避让数组
    speedKMH?: string,        //自定义速度
    releaseId?: string,      // 图层ID
    waypoints:string,        // 路径地位 WKT ('起点;途径点;...终点') 
    avoidPolygons?:string,   // 避让点 WKT ('避让点,避让点,避让点')
}

/**
 * @description: 地址逆向匹配
 * @param {mapLocation} params { avoidPolygons: 避让区域, speedKMH: 自定义速度}
 * @return {Promise<AnyObject>}
 */
export const routeDriving = (params: RoutePlan): Promise<AnyObject> => new Promise((resolve, reject) => {
    debugger
    request.get(`${src.value.SEARCH_URL}/egis-space/space/route/driving`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})

/********************************************* 基本接口查询 ****************************************************/
// 数据保存
export interface FromData {
    layerName: string,   // 数据名称
    layerType: string,   // 数据类型
    describe: string,    // 数据描述
    geom: string,        // 数据体
}

/**
 * @description: 数据保存
 * @param {mapLocation} params { layerName,layerType,describe,geom }
 * @return {Promise<AnyObject>}
 */
export const DataSave = (params: FromData): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/threeDimensional/save`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})

// 数据删除
export interface SetId {
    layerId: string,   // 数据名称
}
/**
 * @description: 数据删除
 * @param {mapLocation} params { layerId }
 * @return {Promise<AnyObject>}
 */
export const DelLayerData = (params: SetId): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.get(`${src.value.BASE_URL}/threeDimensional/delLayerData`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})
// 数据查询

export interface SetData {
    layerName: string,   // 数据名称
    pageIndex: number,   // 当前页
    pageSize: number,    // 分页条数
    userId? :string      // 用户ID
}
/**
 * @description: 数据查询
 * @param {mapLocation} params { layerId }
 * @return {Promise<AnyObject>}
 */
 export const GetLayerData = (params: SetData): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/threeDimensional/getData`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})

// 文件上传
export interface fileData {
    file:any
}
/**
 * @description: 文件上传
 * @param {mapLocation} params { file }
 * @return {Promise<AnyObject>}
 */
 export const UpsaveLayerData = (params: fileData): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.post(`${src.value.BASE_URL}/threeDimensional/saveLayerData`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})


// 文件上传模块
/**
 * @description: 文件上传
 * @param {mapLocation} params { file }
 * @return {Promise<AnyObject>}
 */
 export const FileDataUpload = (params: fileData): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.post(`${src.value.BASE_URL}/fileData/upload`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})

