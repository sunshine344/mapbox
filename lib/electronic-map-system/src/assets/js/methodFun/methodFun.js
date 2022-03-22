/*
 * @Description: file content
 * @Author: xufeng
 * @Date: 2022-02-19 12:40:33
 * @LastEditTime: 2022-02-21 16:53:25
 * @FilePath: \project\src\assets\js\methodFun\methodFun.js
 */
/**
 * @description: 获取模型高度的坐标
 */
 export function GetCurrentMousePosition(e, t, i) {
    var _this = this;
    var a, n = e.pick(t);
    if (e.pickPositionSupported && Cesium.defined(n) && definedData(n, i)) {
        var a = e.pickPosition(t);
        if (Cesium.defined(a)) {
            var r = Cesium.Cartographic.fromCartesian(a),
                o = r.height;
            if (o >= 0)
                return a;
            if (!Cesium.defined(n.id) && o >= -500)
                return a
        }
    }
    if (e.mode === Cesium.SceneMode.SCENE3D) {
        var s = e.camera.getPickRay(t);
        a = e.globe.pick(s, e)
    }
    else a = e.camera.pickEllipsoid(t, e.globe.ellipsoid);
    return a
}
function definedData(e, t) {
    if (Cesium.defined(e.id)) {
        var i = e.id;
        if (i._noMousePosition)
            return !1;
        if (t && i == t)
            return !1
    }
    if (Cesium.defined(e.primitive)) {
        var a = e.primitive;
        if (a._noMousePosition)
            return !1;
        if (t && a == t)
            return !1
    }
    return !0
}
/**
 * 世界坐标转换为经纬度
 */
export function WorldToLonlat(viewer, cartesian){
    if(!cartesian)return false;
    let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    let lng = Cesium.Math.toDegrees(cartographic.longitude);
    let alt = cartographic.height;
    return {lat:lat,lon:lng,alt:alt};
}
/**
 * 添加广告牌
 */
export function GetBillboard(img,width,height){
    return new Cesium.BillboardGraphics({
        image: img == undefined ? '../../images/map/point.png' : img,
        width: width == undefined ? 35 : width,
        height: height == undefined ? 45 : height,
        clampToGround:true,
       // eyeOffset :new Cesium.Cartesian2(-200, 0),
        pixelOffset: new Cesium.Cartesian2(0, -10),
        //heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
    })
}
/**
 * @description: 飞行定位到一个笛卡尔空间直角坐标点位置
 * @param {viewer} 地图viewer对像
 * @param {Cartesian3} destination 目标点 Cartesian3 ( new Cesium.Cartesian3(x,y,z)来创建 )
 * @param {Number} heading  默认=0.0   偏航角 正北,由正北向东偏向为正
 * @param {*} pitch  =-90     俯仰角 垂直向下， ENU局部坐标系中XY平面的旋转角度，平面下为负，上为正，
 * @param {*} range    =0.0   距目标点距离
 * @param {*} duration =3   持续时间
 * @param {*} callBack =null   回调函数，定位完成后执行
 */

 export function FlyToPoint(viewer, destination, heading = 0.0, pitch = -90, range = 0.0, duration = 3, callBack = null) {
    const boundingSphere = new Cesium.BoundingSphere(destination, 0.0);
    viewer.camera.flyToBoundingSphere(boundingSphere, {
        duration: duration,
        maximumHeight: undefined,
        complete: function () {
            if (callBack) {
                callBack();
            }else{
                console.log('定位失败！');
            }
        },
        cancel: function () {
            console.log('定位取消！');
        },
        offset: {
            heading: Cesium.Math.toRadians(heading),
            pitch: Cesium.Math.toRadians(pitch),
            range: range
        },
    });

}