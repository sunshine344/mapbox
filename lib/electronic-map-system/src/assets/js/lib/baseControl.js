/*
 * @Author: your name
 * @Date: 2021-09-22 09:41:52
 * @LastEditTime: 2021-12-06 11:41:16
 * @LastEditors: Please set LastEditors
 * @Description: 基础控件方法，包含： 
 *              1、初始飞入 
 *              2、切换模式（二三位切换）
 *              3、地图放大控件
 *              4、地图缩小控件
 *              5、指北针
 * @FilePath: \cd交通\src\components\map3d\lib\js\baseControl.js
 */

/**
 * @description:飞入视角 （可作为地图的初始定位视角及倾斜度）
 * @param {viewer} 地图viewer对像
 * @param {Cartesian3} destination 目标点 Cartesian3 ( new Cesium.Cartesian3(x,y,z)来创建 )
 * @param {Number} heading  默认=0.0   偏航角 正北,由正北向东偏向为正
 * @param {*} pitch  =-90     俯仰角 垂直向下， ENU局部坐标系中XY平面的旋转角度，平面下为负，上为正，
 * @param {*} range    =0.0   距目标点距离
 * @param {*} duration =3   持续时间
 * @param {*} callBack =null   回调函数，定位完成后执行
 */

export function initFlyToCamera(viewer,destination, heading = 0.0, pitch = -90, range = 0.0, duration = 3, callBack = null) {
    viewer.scene.camera.flyTo({
        destination:new Cesium.Cartesian3(destination.x,destination.y,destination.z),
        orientation: {
            heading: heading,
            pitch: pitch,
            roll: range,
        },
        duration: duration,
        complete: function () {
            if (callBack) {
                callBack();
            }else{
                console.log('定位失败！');
            }
        },
    });
}


/**
 * @description:切换模式
 * @param {viewer} 地图viewer对像
 * @param {modeClass} modeClass 状态参数 （'mode3': 三维, 'mode2': 二维）
 */

export function switchMode(viewer,modeClass) {
    if (modeClass === "mode3") {
        //切换为2d
        viewer.scene.mode = Cesium.SceneMode.SCENE2D;
    } else if (modeClass === "mode2") {
        viewer.scene.mode = Cesium.SceneMode.SCENE3D;
    }
}
/**
 * @description:地图点击缩小
 * @param {viewer} 地图viewer对像
 */

export function toSmall(viewer) {
    let position = viewer.camera.position;
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let cartographic = ellipsoid.cartesianToCartographic(position);
    let lng = Cesium.Math.toDegrees(cartographic.longitude);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    let alt = cartographic.height;
    locationByLonLat(viewer, lng, lat, alt * 1.2, 1, false);
}


/**
 * @description:地图点击放大
 * @param {viewer} 地图viewer对像
 */

export function toBig(viewer) {
    let position = viewer.camera.position;
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let cartographic = ellipsoid.cartesianToCartographic(position);
    let lng = Cesium.Math.toDegrees(cartographic.longitude);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    let alt = cartographic.height;
   
    locationByLonLat(viewer, lng, lat, alt * 0.7, 1, false);
}


/**
 * @description:地图缩小放大调用，控制视野位置
 * @param {viewer} 地图viewer对像
 * @param {modeClass} modeClass 状态参数 （'mode3': 三维, 'mode2': 二维）
 */

function locationByLonLat(viewer, lon, lat, height = 1000, time = 3, isAddEn = true) {
    let { heading, pitch, roll } = viewer.scene.camera;
    viewer.scene.camera.flyTo({
        duration: time,
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
        orientation: {
            heading,
            pitch,
            roll,
        },
    });
}


/**
 * @description:指北针
 * @param {viewer} 地图viewer对像
 * @param {function} callback 回调函数，时刻返回旋转角度 
 */
export function compass(viewer,callback) {
    viewer.scene.postRender.addEventListener(function () {
      let heading = viewer.scene.camera.heading;
      let x = -Cesium.Math.toDegrees(heading);
      let degrees = "rotate(" + x + "deg)";
      callback(degrees);
    });
}
