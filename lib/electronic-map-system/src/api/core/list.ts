/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 14:14:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-02-24 17:45:51
 */
import request, { errorCatch, src } from "../config/request";
// 时态热力图
export interface diagram {
    endTime: string,//结束时间
    startTime: string,//开始时间 
    timeAxis:number,//时间阈值
    values:string
}
/**
 * @description: 时态热力图
 * @param {params} params diagram
 * @return {Promise<AnyObject>}
 */
export const fileDatatemporalHeat= (params: diagram): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.get(`${src.value.BASE_URL}/fileData/temporalHeat`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})
// 查询历史记录的参数
export interface param {
    model_Type: string,
    pageIndex: string,
    pageSize:string
}
// 查询历史数据
export const queryHistory= (params: param): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.get(`${src.value.BASE_URL}/historicalRecord/query`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})
// 保存的参数
export interface saveData {
    analysisId: string,//分析结果
    analysisScope: string,//分析范围
    distance:string,//缓冲距离
    endTime:string,//时间范围 结束时间
    gridSize:number,//网格大小
    id:string,//数据id
    jsonContent:string,//json字符串
    level:string,//分级设色
    modelType:number,//模块类型1、时态热力图2、轨迹碰撞、3、OD分析4、驻点检查5、电子围栏
    spatialThreshold:number,//空间阈值
    startTime:string,//开始的时间
    timeAxis:number,//时间分辨率
    timeThreshold:number,//时间阈值
    userId:string//用户编号
}
// 保存结果
export const saveResult= (params: saveData): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/historicalRecord/insert`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})
// 删除历史记录的参数
export interface deleteId {
    id: string//数据id
}
// 删除历史记录
export const deleteHistory= (params: deleteId): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.get(`${src.value.BASE_URL}/historicalRecord/delete`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})
export interface data {
    
}
// 选择文件查询
export const dataChange= (params: data): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.get(`${src.value.BASE_URL}/fileData/queryFileId`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})

export const searchreverse= (params: AnyObject): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.get(`${src.value.SEARCH_URL}/egis-space/space/search/property`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})
// 电子围栏
export interface eleData {
    analysisScope: string,
    endTime: string,
    fileId:string,
    startTime: string
}
export const getElectric= (params: eleData): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/fileData/electronicFence`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})
// 轨迹碰撞
export interface trackData {
    analysisScope: string,
    endTime: string,
    fileId:string,
    startTime: string,
    dataIds:string,//需要计算的数据ID
    distance:string,//缓冲距离
}
export const getTrack= (params: trackData): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.post(`${src.value.BASE_URL}/fileData/trajectoryCollision`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})
// od分析
export interface analyseData {
    polygonStr: string,//范围数据
    endDate: string,
    fileId:string,
    startDate: string,
    timeThreshold:string,//时间阈值
}
export const getOdAnalyse= (params: trackData): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/Od/odAnalysis`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})
// 驻点检测
export interface stagnationData {
    dataId: string,//用户id
    endDate: string,
    fileId:string,//批次id
    startDate: string,
    polygonStr:string,//空间范围
    scopeThreshold:number,//空间阈值
    timeThreshold:number//时间阈值
}
export const getStagnation= (params: trackData): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/spMonitor/stagnationPointAnalysis`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})
/**
 * @Descripttion: 轨迹碰撞
 * @Author:
 * @Date: 2022-02-23 17:24:17
 * @LastEditors: 
 * @param {*}
 * @return {*}
 */
interface fileDatatrajectoryCollisionData{
    analysisScope:string,
    dataIds:string,
    distance:number,
    endTime:string|number,
    startTime:string|number
}
export const fileDatatrajectoryCollision= (params: fileDatatrajectoryCollisionData): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.formData(`${src.value.BASE_URL}/fileData/trajectoryCollision`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})

// 分析id查询
export const analyseId= (params: data): Promise<AnyObject> => new Promise((resolve, reject) => {
    request.get(`${src.value.BASE_URL}/fileData/queryDataId`, params).then((res: AnyObject) => {
        resolve(res);
    }).catch((error: AnyObject) => {
        reject(error)
        errorCatch(error)
    })
})


