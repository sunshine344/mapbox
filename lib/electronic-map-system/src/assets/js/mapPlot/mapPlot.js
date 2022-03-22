/*
 * @Description: file content
 * @Author: xufeng
 * @Date: 2022-02-19 13:01:35
 * @LastEditTime: 2022-02-23 20:27:27
 * @FilePath: \project\src\assets\js\mapPlot\mapPlot.js
 */
import { GetCurrentMousePosition, WorldToLonlat, GetBillboard } from '../methodFun/methodFun.js'
import Entitys from './entitys.js';
export default class MapPlot{
    constructor(viewer){
        this.viewer = viewer;  // 地图对象
        this.visibilityArr = null; // 可视域对象
        this.removeObj = [];
        this.dataPositions = [];
        this.geometryArr = [];
        this.handleArr = [];
        this.entitys = new Entitys(viewer);
        this._resultTip = this.entitys.createMsgTip();
    }
    /**
     * @description: 初始化方法
     */    
    init(){
    }
    /**
     * @description: 添加数据
     * @param {*}
     * @return {*}
     */    
    addKMLDItem(item){
        // 移除
        if(item.type == "point"){
            this.drawPoint();
        }else if(item.type == "linestring"){
            this.drawLineString()
        }else if(item.type == "polygon"){
            this.drawPolygon()
        }
    }
    /**
     * 清除事件
     */
     removeHandle(){
        if(this.handleArr.length > 0){
            for(let i in this.handleArr)this.handleArr[i].destroy();
            this.entitys.remove(this._resultTip);
            this._resultTip = null;
            this.handleArr = [];
        }
    }
    /**
     * @description: 绘制点
     * @param {*} callback
     * @return {*}
     */    
    drawPoint(callback){
        try {
            var _this = this;
            //坐标存储
            var positions = [];
            var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
            if(!this._resultTip)this._resultTip = this.entitys.createMsgTip();
            this.handleArr.push(handler);
            //单击鼠标左键画点
            handler.setInputAction(function (movement) {
                var cartesian = GetCurrentMousePosition(_this.viewer.scene,movement.position);
                positions.push(cartesian);
                let entity = _this.viewer.entities.add({
                    position: cartesian
                });
                
                
                //entity.label = _this.entitys.getLabel('经度:' + position.lon.toFixed(6) + '°\n  纬度' + position.lat.toFixed(6) + '°\n 高度:' + position.alt.toFixed(2) + ' m',new Cesium.Cartesian2(0, -35));
                let cloudsBoxUrl = '/src/assets/images/map/point.png';
                entity.billboard = _this.entitys.getBillboard(cloudsBoxUrl);
                entity.pointDraw = true;
                _this.removeObj.push(entity);
                // 转换为坐标
                let positionLonLat = WorldToLonlat(_this.viewer, cartesian);
                debugger
                let arr = [positionLonLat.lon, positionLonLat.lat];
                _this.geometryArr.push(arr);
                // _this.removeHandle();
                //callback(positions,position);
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * @description: 绘制线
     * @param {*} callback
     * @return {*}
     */ 
    drawLineString(callback){
        var _this = this;
        var PolyLinePrimitive = (function () {
            function _(positions) {
                this.options = {
                    polyline: {
                        show: true,
                        positions: [],
                        material: Cesium.Color.CHARTREUSE,
                        width: 5,
                        clampToGround: true
                    }
                };
                this.positions = positions;
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    return _self.positions;
                };
                //实时更新polyline.positions
                this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
                _this.removeObj.push(_this.viewer.entities.add(this.options));
            };
            return _;
        })();

        var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
        if(!this._resultTip)this._resultTip = this.entitys.createMsgTip();
        this.handleArr.push(handler);
        var positions = [];
        var dataArr = [];
        var poly = undefined;
        //鼠标左键单击画点
        handler.setInputAction(function (movement) {
            // var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.position, _this.viewer.scene.globe.ellipsoid);
            var cartesian = GetCurrentMousePosition(_this.viewer.scene,movement.position)
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //鼠标移动
        handler.setInputAction(function (movement) {
            // var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.endPosition, _this.viewer.scene.globe.ellipsoid);
            // var cartesian = _this.getPointFromWindowPoint(movement.endPosition);
            var cartesian =  GetCurrentMousePosition(_this.viewer.scene,movement.endPosition)
            let positionLonLat = WorldToLonlat(_this.viewer, cartesian);
            let arr = [positionLonLat.lon, positionLonLat.lat];
            dataArr.push(arr);
            if (positions.length >= 2) {
                if (!Cesium.defined(poly)) {
                    poly = new PolyLinePrimitive(positions);
                } else {
                    if(cartesian != undefined){
                            positions.pop();
                            cartesian.y += (1 + Math.random());
                            positions.push(cartesian);
                    }
                    _this.entitys.showTip(_this._resultTip,true,cartesian,'鼠标右键结束,平板长按结束');
                }
            }else{
                _this.entitys.showTip(_this._resultTip,true,cartesian,'点击绘制');
            }
         
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //单击鼠标右键结束画线
        handler.setInputAction(function (movement) {
            if(dataArr.length){
                let mapArr = [];
                mapArr.push(dataArr);
                _this.geometryArr.push(mapArr);
            }
            _this.removeHandle();
            // callback(positions);
            debugger
            _this.drawLineString()
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
     /**
     * 提示框
     * @param {*} bShow 
     * @param {*} position 
     * @param {*} message 
     */
    showTip(label,bShow,position,message,effectOptions){
        label.show = bShow;
        if(bShow){
            if(position)
                label.position = position;
            if(message)
                label.label.text =message;
            if(effectOptions){
                for(let key  in effectOptions){
                    if(label.key){
                        label.key=effectOptions[key];
                    }
                }
            }
        }    
    }
    /**
     * @description: 绘制面
     * @param {*} callback
     * @return {*}
     */ 
    drawPolygon(callback){
        var _this = this;
        var PolygonPrimitive = (function () {
            function _(positions) {
                this.options = {
                    name: '多边形',
                    polygon: {
                        hierarchy: [],
                        //perPositionHeight: true,
                        //fill:false,
                        outline : false,
                        outlineWidth: 10.0,
                        material : Cesium.Color.fromCssColorString('#FBCF0F').withAlpha(0.5),
                        outlineColor : Cesium.Color.CHARTREUSE,
                        clampToGround: true
                    }
                };
                this.hierarchy = positions;
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    return new Cesium.PolygonHierarchy(_self.hierarchy);
                };
                //实时更新polygon.hierarchy
                this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                _this.removeObj.push(_this.viewer.entities.add(this.options));
            };
            return _;
        })();

        var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
         if(!this._resultTip)this._resultTip = this.entitys.createMsgTip();
        this.handleArr.push(handler);
        let dataArr = [];
        var positions = [];
        var poly = undefined;

        //鼠标单击画点
        handler.setInputAction(function (movement) {
            // var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.position, _this.viewer.scene.globe.ellipsoid);
            // var cartesian = _this.getPointFromWindowPoint(movement.position);
            var cartesian = GetCurrentMousePosition(_this.viewer.scene,movement.position)
            let positionLonLat = WorldToLonlat(_this.viewer, cartesian);
            let arr = [positionLonLat.lon,positionLonLat.lat];
            dataArr.push(arr);
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //鼠标移动
        handler.setInputAction(function (movement) {
            // var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.endPosition, _this.viewer.scene.globe.ellipsoid);
            //var cartesian = _this.getPointFromWindowPoint(movement.endPosition);
            var cartesian = GetCurrentMousePosition(_this.viewer.scene,movement.endPosition)
            if (positions.length >= 2) {
                if (!Cesium.defined(poly)) {
                    poly = new PolygonPrimitive(positions);
                } else {
                    if(cartesian != undefined){
                            positions.pop();
                            cartesian.y += (1 + Math.random());
                            positions.push(cartesian);
                    }
                    _this.entitys.showTip(_this._resultTip,true,cartesian,'鼠标右键结束,平板长按结束');
                }
            }else{
                _this.entitys.showTip(_this._resultTip,true,cartesian,'点击绘制');
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //鼠标右键单击结束绘制
        handler.setInputAction(function (movement) {
            // 面集合
            debugger
            if(dataArr.length){
                let s = []; 
                dataArr.push(dataArr[0])
                s.push(dataArr)
                _this.geometryArr.push(s);
            }
            _this.removeHandle();
            _this.drawPolygon();
            // callback(positions);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    /**
     * @description: 获取数据
     */    
    getGeometryData(){
        return this.geometryArr;
    }
    /**
     * @description: 地图列表移除
     */
    removeKMLDItem(){

    }
    /**
     * @description: 可视域移除  
     */
    removeVisibility(){
       
    }
    /**
     * @description: 地图列表移除
     */
    /**
     * 删除
     */
    removeAll(){
        if(this.handleArr.length > 0){
            for(let i in this.handleArr)this.handleArr[i].destroy();
            this.entitys.remove(this._resultTip);
            this._resultTip = null;
            this.handleArr = [];
        }
        if(this.removeObj.length != 0){
            for(let i in this.removeObj){
                this.viewer.entities.remove(this.removeObj[i]);
            }
            this.removeObj = [];
        }
    }

        
    



}