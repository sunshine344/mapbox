/*
 * @Descripttion: 量测封装类
 *  面积量测
 *  距离量测
 *  三角量测
 * @version: 1.0
 * @Author: xufeng
 * @Date: 2021-12-24 15:08:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-02-22 16:07:09
 */ 
import Handler from './js/handler.js';
import mouseManager from './js/mouseManager.js';
import Entitys from './js/entitys.js';
import entityFactory from './js/entityFactory.js';
import CVTools from './js/cvTool.js';
import { generateUUID } from './js/mapTool.js'
import SplitView from "./js/splitView"
export default class Measure{

    constructor(viewer){
        /**
         * viewer
        */
        this.viewer = viewer;
        /**
         * 实体
         */
        this.entitys = new Entitys(viewer);
        /**
         * 测量状态,用于两侧点击或外部判断
         */
        this.measureType = false;
        /**
         * mouseManager
         * 坐标转换
         */
        this.mouseManager = new mouseManager(viewer);
        /**
         * 辅助工具
         */
        this.Tools = new CVTools();
         /**
         * 距离测量
         */
        this.lineSpace = [];
        
         /**
         * 面积测量
         */
        this.areaSpace = [];
        
        /**
         * 三角测量
         */
        this.triangleSpace = []
        // 矩形拉框
        this.handleArr=[];
        this.removeObj=[];//矩形拉框移除对象
        this.duibiObj=null;//卷帘方法
    }
    /*************************************** 距离测量方法 ******************************************/
    /**
     * 空间两点距离计算函数
     */
    getSpaceDistance(positions){ 
        let distance = 0;
        for (let i = 0; i < positions.length - 1; i++) {
            let point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            let point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
            /**根据经纬度计算出距离**/
            let geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            let s = geodesic.surfaceDistance;
            //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
            //返回两点之间的距离
            s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
            distance = distance + s;
        }
        return distance.toFixed(2);
    }

    /*************************************** 面积测量方法 ******************************************/
    /**
     * 计算面积
     * @param {*} points 
     */
     getArea(points,areaItem){
        var res = 0;
        //拆分三角曲面
        for (var i = 0; i < points.length - 2; i++) {
            var j = (i + 1) % points.length;
            var k = (i + 2) % points.length;
            var totalAngle = this.Angle(points[i], points[j], points[k]);
            var dis_temp1 = this.distance(areaItem.positions[i], areaItem.positions[j]);
            var dis_temp2 = this.distance(areaItem.positions[j], areaItem.positions[k]);
            res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle)) ;
            console.log(res);
        }
        return (res/1000000.0).toFixed(4);
    }
    /**
     * 计算角度
     * @param {*} p1 
     * @param {*} p2 
     * @param {*} p3 
     */
    Angle(p1, p2, p3){
        var bearing21 = this.Bearing(p2, p1);
        var bearing23 = this.Bearing(p2, p3);
        var angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }
    /**
     * 计算方向
     * @param {*} from 
     * @param {*} to 
     */
    Bearing(from, to){
        var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad)
        var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度
        var lat1 = from.lat * radiansPerDegree;
        var lon1 = from.lon * radiansPerDegree;
        var lat2 = to.lat * radiansPerDegree;
        var lon2 = to.lon * radiansPerDegree;
        var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRadian;//角度
        return angle;
    }
    distance(point1,point2){
        var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
        var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        return s;
    }

    /*************************************** 三角测量方法 ******************************************/

    getHeight(positions){
        let cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
        let cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
        let height_temp = cartographic1.height - cartographic.height;
        return height_temp.toFixed(2);
    }
    point_conf(positions){
        let cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
        let cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
        let point_temp = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), cartographic1.height);
        return point_temp;
    }
    getDistance(positions){
        if(positions[1] == undefined){
            return false;
        }
        let point1cartographic = Cesium.Cartographic.fromCartesian(positions[1]);
        let point2cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
        /**根据经纬度计算出距离**/
        let geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        let s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        return s; 
    }
    createPoint(cartesian,itemTriangle){
        let entity = this.entitys.createEntity();
        entity.position = cartesian;
        entity.point = this.entitys.getPoint();
        itemTriangle.entity.push(this.entitys.add(entity)); //创建点
    }
    createLine(itemTriangle){
        itemTriangle.lineObj[0] = new entityFactory({type:"triangleMeasure",data:{name:'直线',positions:itemTriangle.position1,label:{fn:this.getDistance,scaler:1000,unit:'公里',offset:new Cesium.Cartesian2(-20, 50)}}});
        itemTriangle.lineObj[1] = new entityFactory({type:"triangleMeasure",data:{name:'高度',positions:itemTriangle.position2,label:{fn:this.getHeight,scaler:1,unit:'米',offset:new Cesium.Cartesian2(20, -20)}}});
        itemTriangle.lineObj[2] = new entityFactory({type:"triangleMeasure",data:{name:'水平线',positions:itemTriangle.position3,label:{fn:this.getDistance,scaler:1000,unit:'公里',offset:new Cesium.Cartesian2(20, -50)}}}); 
        itemTriangle.entity.push(this.entitys.add(itemTriangle.lineObj[0])); //创建线
        itemTriangle.entity.push(this.entitys.add(itemTriangle.lineObj[1])); //创建线
        itemTriangle.entity.push(this.entitys.add(itemTriangle.lineObj[2])); //创建线
    }


    /**
     * 删除测量
     */
    remove(){
        if(this.measureType){
            alert('请完成本次地图测量后在进行删除!')
            return false
        }
        // if(this.handlerAction)this.handlerAction.handler.destroy();
        if(this._resultTip)this.entitys.remove(this._resultTip);
        
        // 移除面积测量
        if(this.areaSpace){
            for (let index = this.areaSpace.length-1; index >= 0 ; index--) {
                if(this.areaSpace[index].entity.length > 0){
                    for(let i in this.areaSpace[index].entity){
                        this.entitys.remove(this.areaSpace[index].entity[i]);
                    }
                    // 移除当前数据
                    this.areaSpace.splice(index,1)         
                }
            }
        }
        // 移除三角测量
        if(this.triangleSpace){
            for (let index = this.triangleSpace.length-1; index >= 0 ; index--) {
                if(this.triangleSpace[index].entity.length > 0){
                    for(let i in this.triangleSpace[index].entity){
                        this.entitys.remove(this.triangleSpace[index].entity[i]);
                    }
                    // 移除当前数据
                    this.triangleSpace.splice(index,1)         
                }
            }
        }
        // 移除距离测量
        if(this.lineSpace){
            for (let index = this.lineSpace.length-1; index >= 0 ; index--) {
                if(this.lineSpace[index].entity.length > 0){
                    for(let i in this.lineSpace[index].entity){
                        this.entitys.remove(this.lineSpace[index].entity[i]);
                    }
                    // 移除当前数据
                    this.lineSpace.splice(index,1)         
                }
            }
        }
        // 移除矩形框
        if(this.removeObj.length != 0){
            for (let i = 0; i < this.removeObj.length; i++) {
                this.viewer.entities.remove(this.removeObj[i]);
            }
            this.removeObj = [];
        }
        this.removeSplitView() ;//
        // if(this.areaSpace.entity.length > 0){
        //     for(let i in this.areaSpace.entity)
        //         this.entitys.remove(this.areaSpace.entity[i]);
        // }
        // if(this.triangleSpace.entity.length > 0){
        //     for(let i in this.triangleSpace.entity)
        //         this.entitys.remove(this.triangleSpace.entity[i]);
        // }
        // if(this.lineSpace.entity.length > 0){
        //     for(let i in this.lineSpace.entity)
        //         this.entitys.remove(this.lineSpace.entity[i]);
        // }
    }
    /*
    * 测面积方法
    */ 
    drawArea(){
          /**
         * 点击
         */
        try {
            let _self = this;
            // 测量状态
            if(_self.measureType){
                return false;
            }
            // 创建测量对象
            let areaItem = {
                distance : 0,
                polyObj : null,
                tempPoints:[],
                positions : [],
                entity : [],
            };
            areaItem.id = generateUUID();
            _self.measureType = true;
            _self.viewer.scene.screenSpaceCameraController.enableRotate = false;//锁定相机
            _self._resultTip = _self.entitys.createMsgTip();
            this.handlerAction = new Handler(_self.viewer);  //handler实体对象
            _self.handlerAction.Action(function(e){ //第一次点击
                if(_self.Tools.nullBool(e.position)){
                    return false;
                }
                let cartesian = _self.mouseManager.screenToWorld(e.position);
                if(areaItem.positions == 0){
                    areaItem.positions.push(cartesian.clone())
                }
                areaItem.positions.push(cartesian); //模拟
    
                let cartographic = Cesium.Cartographic.fromCartesian(areaItem.positions[areaItem.positions.length - 1]);
                areaItem.tempPoints.push({ lon: Cesium.Math.toDegrees(cartographic.longitude), lat:  Cesium.Math.toDegrees(cartographic.latitude) ,hei:cartographic.height});
                /**
                 * 创建实体
                 */
                let entity = _self.entitys.createEntity();
                entity.position = cartesian;
                entity.point = _self.entitys.getPoint();
                areaItem.entity.push(_self.entitys.add(entity)); //创建点
            },_self.handlerAction.LEFT_CLICK);
            /**
             * 移动
             */
            _self.handlerAction.Action(function(e){
                if(_self.Tools.nullBool(e.endPosition)){
                     return false;
                }
                let cartesian = _self.mouseManager.screenToWorld(e.endPosition);
                if(!cartesian){
                    return false;
                }
                if(areaItem.positions.length >= 2){
                    if (!Cesium.defined(areaItem.polyObj)) {
                        areaItem.polyObj = new entityFactory({type:"createPolygon",data:{positions:areaItem.positions,material:Cesium.Color.CHARTREUSE.withAlpha(0.3)}});
                        areaItem.entity.push(_self.entitys.add(areaItem.polyObj)); //创建线
                    }else{
                        areaItem.positions.pop();
                        areaItem.positions.push(cartesian.clone());
                    }
                    _self.entitys.showTip(_self._resultTip,true,cartesian,'鼠标右键结束');
                }else{
                    _self.entitys.showTip(_self._resultTip,true,cartesian,'点击地图');
                }
            },_self.handlerAction.MOUSE_MOVE);
            /**
             * 右键取消
             */
            this.handlerAction.Action(function(e){
                if(_self.Tools.nullBool(e.position)){
                    return false;
                }
                _self.handlerAction.destroy(); //关闭事件句柄
                areaItem.positions.pop(); //最后一个点无效
                var textArea = _self.getArea(areaItem.tempPoints,areaItem) + "平方公里";
                let entity = _self.entitys.createEntity();
                //var polyPositions = areaItem.polyObj.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
                var polyCenter = Cesium.BoundingSphere.fromPoints(areaItem.positions).center;
                polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
                entity.position = polyCenter;
                entity.name = '多边形面积';
                entity.label = _self.entitys.getLabel(textArea);
                areaItem.entity.push(_self.entitys.add(entity));
                _self.areaSpace.push(areaItem);
                _self.viewer.scene.screenSpaceCameraController.enableRotate = true;//解锁相机
                _self.entitys.remove(_self._resultTip);
                _self.measureType = false;  // 测量状态关闭
            },_self.handlerAction.RIGHT_CLICK);
        } catch (error) {
            console.log(error);
        }
    }
    // 绘制多边形
    drawRectangle(calback,option={fillColor:'rgba(54,89,75,0.6)',lineColor:'#95AF6E'}){
        if(this.areaSpace){ //若有面先移除面
            for (let index = this.areaSpace.length-1; index >= 0 ; index--) {
                if(this.areaSpace[index].entity.length > 0){
                    for(let i in this.areaSpace[index].entity){
                        this.entitys.remove(this.areaSpace[index].entity[i]);
                    }
                    // 移除当前数据
                    this.areaSpace.splice(index,1)         
                }
            }
        }
        /**
       * 点击
       */
      try {
          let _self = this;
          // 测量状态
          if(_self.measureType){
              return false;
          }
          // 创建测量对象
          let areaItem = {
              distance : 0,
              polyObj : null,
              tempPoints:[],
              positions : [],
              entity : [],
          };
          areaItem.id = generateUUID();
          _self.measureType = true;
          _self.viewer.scene.screenSpaceCameraController.enableRotate = false;//锁定相机
          _self._resultTip = _self.entitys.createMsgTip();
          this.handlerAction = new Handler(_self.viewer);  //handler实体对象
          _self.handlerAction.Action(function(e){ //第一次点击
              if(_self.Tools.nullBool(e.position)){
                  return false;
              }
              let cartesian = _self.mouseManager.screenToWorld(e.position);
              if(areaItem.positions == 0){
                  areaItem.positions.push(cartesian.clone())
              }
              areaItem.positions.push(cartesian); //模拟
  
              let cartographic = Cesium.Cartographic.fromCartesian(areaItem.positions[areaItem.positions.length - 1]);
              areaItem.tempPoints.push({ lon: Cesium.Math.toDegrees(cartographic.longitude), lat:  Cesium.Math.toDegrees(cartographic.latitude) ,hei:cartographic.height});
              /**
               * 创建实体
               */
              let entity = _self.entitys.createEntity();
              entity.position = cartesian;
              entity.point = _self.entitys.getPoint();
              areaItem.entity.push(_self.entitys.add(entity)); //创建点
          },_self.handlerAction.LEFT_CLICK);
          /**
           * 移动
           */
          _self.handlerAction.Action(function(e){
              if(_self.Tools.nullBool(e.endPosition)){
                   return false;
              }
              let cartesian = _self.mouseManager.screenToWorld(e.endPosition);
              if(!cartesian){
                  return false;
              }
              if(areaItem.positions.length >= 2){
                  if (!Cesium.defined(areaItem.polyObj)) {
                    areaItem.polyObj = new entityFactory({type:"createPolygon",data:{positions:areaItem.positions,material:Cesium.Color.fromCssColorString(option.fillColor?option.fillColor:Cesium.Color.CHARTREUSE.withAlpha(0.3))}});
                    areaItem.lineObj = new entityFactory({type:"createLine",data:{positions:areaItem.positions,material:Cesium.Color.fromCssColorString(option.lineColor?option.lineColor:Cesium.Color.CHARTREUSE.withAlpha(0.3)),width:2}});
                    areaItem.entity.push(_self.entitys.add(areaItem.lineObj)); //创建线
                      areaItem.entity.push(_self.entitys.add(areaItem.polyObj)); //创建线
                  }else{
                      areaItem.positions.pop();
                      areaItem.positions.push(cartesian.clone());
                  }
                  _self.entitys.showTip(_self._resultTip,true,cartesian,'鼠标右键结束');
              }else{
                  _self.entitys.showTip(_self._resultTip,true,cartesian,'点击地图');
              }
          },_self.handlerAction.MOUSE_MOVE);
          /**
           * 右键取消
           */
          this.handlerAction.Action(function(e){
              if(_self.Tools.nullBool(e.position)){
                  return false;
              }
              _self.handlerAction.destroy(); //关闭事件句柄
              areaItem.positions.pop(); //最后一个点无效
              var textArea = _self.getArea(areaItem.tempPoints,areaItem) + "平方公里";
              let entity = _self.entitys.createEntity();
              //var polyPositions = areaItem.polyObj.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
            //   var polyCenter = Cesium.BoundingSphere.fromPoints(areaItem.positions).center;
            //   polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
            //   entity.position = polyCenter;
            //   entity.name = '多边形面积';
            //   entity.label = _self.entitys.getLabel(textArea);
            //   areaItem.entity.push(_self.entitys.add(entity));


              _self.areaSpace.push(areaItem);
              _self.viewer.scene.screenSpaceCameraController.enableRotate = true;//解锁相机
              _self.entitys.remove(_self._resultTip);
              _self.measureType = false;  // 测量状态关闭


              areaItem.entity.forEach(item=>{
                _self.entitys.remove(item)
            })
            areaItem.positions.push(areaItem.positions[0])
            // areaItem.lineObj = new entityFactory({type:"createLine",data:{positions:areaItem.positions,material:Cesium.Color.fromCssColorString(option.lineColor?option.lineColor:Cesium.Color.CHARTREUSE.withAlpha(0.3)),width:2}});
            areaItem.lineObj = new entityFactory({type:"createLine",data:{positions:areaItem.positions,material:Cesium.Color.fromCssColorString(option.lineColor?option.lineColor:Cesium.Color.CHARTREUSE.withAlpha(0.3)),width:2}});
            areaItem.entity.push(_self.entitys.add(areaItem.lineObj))
            areaItem.polyObj = new entityFactory({type:"createPolygon",data:{positions:areaItem.positions,material:Cesium.Color.fromCssColorString(option.fillColor?option.fillColor:Cesium.Color.CHARTREUSE.withAlpha(0.3))}});
            areaItem.entity.push(_self.entitys.add(areaItem.polyObj)); //创建线
            let arrys=[];
                if(areaItem.positions instanceof Array){
                    for (const key of areaItem.positions) {
                        arrys.push(_self.mouseManager.worldToLonlat(key))
                      
                        
                    }

                }
               
            let geojson={type:'Polygon',properties:{}, coordinates:[arrys] }
            calback?calback(geojson,arrys):null;

          },_self.handlerAction.RIGHT_CLICK);
      } catch (error) {
          console.log(error);
      }
  }
    /**
     * @Descripttion:绘制多边形返回json
     * @Author: 陈杰
     * @Date: 2022-02-16 16:07:28
     * @LastEditors: 
     * @param {*}
     * @return {*}
     */    
    drawpolygon(calback,option={fillColor:'rgba(54,89,75,0.6)',lineColor:'#95AF6E'}){
        if(this.areaSpace){ //若有面先移除面
            for (let index = this.areaSpace.length-1; index >= 0 ; index--) {
                if(this.areaSpace[index].entity.length > 0){
                    for(let i in this.areaSpace[index].entity){
                        this.entitys.remove(this.areaSpace[index].entity[i]);
                    }
                    // 移除当前数据
                    this.areaSpace.splice(index,1)         
                }
            }
        }
          /**
         * 点击
         */
        try {
            let _self = this;
            // 测量状态
            if(_self.measureType){
                return false;
            }
            // 创建测量对象
            let areaItem = {
                distance : 0,
                polyObj : null,
                tempPoints:[],
                positions : [],
                entity : [],
            };
            areaItem.id = generateUUID();
            _self.measureType = true;
            _self.viewer.scene.screenSpaceCameraController.enableRotate = false;//锁定相机
            _self._resultTip = _self.entitys.createMsgTip();
            this.handlerAction = new Handler(_self.viewer);  //handler实体对象
            _self.handlerAction.Action(function(e){ //第一次点击
                if(_self.Tools.nullBool(e.position)){
                    return false;
                }
                let cartesian = _self.mouseManager.screenToWorld(e.position);
                if(areaItem.positions.length == 0){
                    areaItem.positions.push(cartesian.clone())
                    areaItem.positions.push(cartesian); //模拟
        
                    // let cartographic = Cesium.Cartographic.fromCartesian(areaItem.positions[areaItem.positions.length - 1]);
                    // areaItem.tempPoints.push({ lon: Cesium.Math.toDegrees(cartographic.longitude), lat:Cesium.Math.toDegrees(cartographic.latitude) ,hei:cartographic.height});
                    /**
                     * 创建实体
                     */
                    let entity = _self.entitys.createEntity();
                    entity.position = cartesian;
                    entity.point = _self.entitys.getPoint();
                    areaItem.entity.push(_self.entitys.add(entity)); //创建点
                }
            },_self.handlerAction.LEFT_CLICK);
            /**
             * 移动
             */
            _self.handlerAction.Action(function(e){
                if(_self.Tools.nullBool(e.endPosition)){
                     return false;
                }
                let cartesian = _self.mouseManager.screenToWorld(e.endPosition);
                if(!cartesian){
                    return false;
                }
                if(areaItem.positions.length >= 2){
                    if (!Cesium.defined(areaItem.polyObj)) {
                        areaItem.polyObj = new entityFactory({type:"createPolygon",data:{positions:areaItem.positions,material:Cesium.Color.fromCssColorString(option.fillColor?option.fillColor:Cesium.Color.CHARTREUSE.withAlpha(0.3))}});
                        areaItem.lineObj = new entityFactory({type:"createLine",data:{positions:areaItem.positions,material:Cesium.Color.fromCssColorString(option.lineColor?option.lineColor:Cesium.Color.CHARTREUSE.withAlpha(0.3)),width:2}});
                        areaItem.entity.push(_self.entitys.add(areaItem.lineObj)); //创建线
                        areaItem.entity.push(_self.entitys.add(areaItem.polyObj)); //创建线
                    }else{
                        // areaItem.positions.pop(); //去掉则是多边形
                        areaItem.positions.push(cartesian.clone());
                    }
                    _self.entitys.showTip(_self._resultTip,true,cartesian,'鼠标右键结束');
                }else{
                    _self.entitys.showTip(_self._resultTip,true,cartesian,'点击地图');
                }
            },_self.handlerAction.MOUSE_MOVE);
            /**
             * 右键取消
             */
            this.handlerAction.Action(function(e){
                if(_self.Tools.nullBool(e.position)){
                    return false;
                }
                _self.handlerAction.destroy(); //关闭事件句柄
                areaItem.positions.pop(); //最后一个点无效
                   
                // var textArea = _self.getArea(areaItem.tempPoints,areaItem) + "平方公里";
                // let entity = _self.entitys.createEntity();
                //var polyPositions = areaItem.polyObj.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
                // var polyCenter = Cesium.BoundingSphere.fromPoints(areaItem.positions).center;
                // polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
                // entity.position = polyCenter;
                // entity.name = '多边形面积';
                // entity.label = _self.entitys.getLabel(textArea);
                // areaItem.entity.push(_self.entitys.add(entity));
                _self.areaSpace.push(areaItem); //不可删除
                _self.viewer.scene.screenSpaceCameraController.enableRotate = true;//解锁相机
                _self.entitys.remove(_self._resultTip);
                areaItem.entity.forEach(item=>{
                    _self.entitys.remove(item)
                })
                areaItem.positions.push(areaItem.positions[0])
                // areaItem.lineObj = new entityFactory({type:"createLine",data:{positions:areaItem.positions,material:Cesium.Color.fromCssColorString(option.lineColor?option.lineColor:Cesium.Color.CHARTREUSE.withAlpha(0.3)),width:2}});
                areaItem.lineObj = new entityFactory({type:"createLine",data:{positions:areaItem.positions,material:Cesium.Color.fromCssColorString(option.lineColor?option.lineColor:Cesium.Color.CHARTREUSE.withAlpha(0.3)),width:2}});
                areaItem.entity.push(_self.entitys.add(areaItem.lineObj))
                areaItem.polyObj = new entityFactory({type:"createPolygon",data:{positions:areaItem.positions,material:Cesium.Color.fromCssColorString(option.fillColor?option.fillColor:Cesium.Color.CHARTREUSE.withAlpha(0.3))}});
                areaItem.entity.push(_self.entitys.add(areaItem.polyObj)); //创建线

                    

                
                _self.measureType = false;  // 测量状态关闭
                let arrys=[];
                if(areaItem.positions instanceof Array){
                    for (const key of areaItem.positions) {
                        arrys.push(_self.mouseManager.worldToLonlat(key))
                    }

                }
                arrys.shift();
                let geojson={type:'Polygon',properties:{}, coordinates:[arrys] }
                calback?calback(geojson,arrys):null
            },_self.handlerAction.RIGHT_CLICK);
        } catch (error) {
            console.log(error);
        }
        
    }
    //画矩形
    drawRect(callback,option={fillColor:'rgba(54,89,75,0.8)',lineColor:'#95AF6E'}){
         // 移除矩形框
         if(this.removeObj.length != 0){
            for (let i = 0; i < this.removeObj.length; i++) {
                this.viewer.entities.remove(this.removeObj[i]);
                
            }
            
            this.removeObj = [];
        }

        let _self = this;
        let pointsArr = [];
        _self.shape= {
            points:[],
            rect:null,
            lineObj:{},
            entity:null
        };
           
        var tempPosition;
        var handle = new Cesium.ScreenSpaceEventHandler(_self.viewer.scene.canvas);
        if(!this._resultTip)if(!this._resultTip)this._resultTip = this.entitys.createMsgTip();
        this.handleArr.push(handle);
        //鼠标左键单击画点
        handle.setInputAction(function(click){
            tempPosition = _self.mouseManager.getCurrentMousePosition(_self.viewer.scene,click.position);
            //选择的点在球面上
            if(tempPosition){
                if(_self.shape.points.length==0) {
                    pointsArr.push(tempPosition);
                    let cartesian = _self.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition);
                    _self.shape.points.push(cartesian);
                    _self.shape.rect=Cesium.Rectangle.fromCartographicArray(_self.shape.points);
                   
                    _self.shape.rect.east+=0.000001;
                    _self.shape.rect.north+=0.000001;
                    _self.shape.entity= _self.viewer.entities.add({
                        rectangle : {
                            coordinates :_self.shape.rect,
                            //fill:false,
                            outline:true,
                            outlineColor : Cesium.Color.fromCssColorString(option?option.lineColor:'#95AF6E'),
                            outlineWidth:10,
                            material : Cesium.Color.fromCssColorString(option?option.fillColor:'rgba(54,89,75,0.6)'),
                            height:10
                            
                        }
                    });
                    _self.bufferEntity = _self.shape.entity;
                    _self.removeObj.push(_self.shape.entity );
                }
                else{
                    let arrays=[];
                    let n=0;
                     _self.removeHandle();
                    if(callback){

                            Object.keys(_self.shape.rect).forEach((key,i)=>{
                                if(i<4){
                                    arrays.push(_self.mouseManager.radianToLat(_self.shape.rect[key]))
                                }
                            })
                            let geojson={type:'Polygon',properties:{}, coordinates:[[[arrays[0],arrays[3]],[arrays[2],arrays[3]],[arrays[2],arrays[1]],[arrays[0],arrays[1]],[arrays[0],arrays[3]],[arrays[0],arrays[3]]]] };
                            callback(geojson)
                    }
                    // callback? callback(geojson):null;
                }
            }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
        
        //鼠标移动
        handle.setInputAction(function(movement){
            if(!movement.endPosition)return false;
            let moveEndPosition =  _self.mouseManager.getCurrentMousePosition(_self.viewer.scene,movement.endPosition);
            if(_self.shape.points.length==0){
                _self.entitys.showTip(_self._resultTip,true,moveEndPosition,'点击绘制');
                return;
            }
            //选择的点在球面上
            if(moveEndPosition){
                pointsArr[1] = moveEndPosition;
                let cartesian = _self.viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition);
                _self.shape.points[1]=cartesian;
                _self.shape.rect= Cesium.Rectangle.fromCartographicArray(_self.shape.points);
                if(_self.shape.rect.west==_self.shape.rect.east)
                    _self.shape.rect.east+=0.000001;
                if(_self.shape.rect.south==_self.shape.rect.north)
                    _self.shape.rect.north+=0.000001;
                _self.shape.entity.rectangle.coordinates = _self.shape.rect;
                
                // _self.shape.entity.polyline={
                //     positions: _self.shape.entity.rectangle.coordinates._value,
                //     width:2,
                //     material: Cesium.Color.YELLOW
                // }
                // _self.shape.lineObj = new entityFactory({type:"createLine",data:{positions:_self.shape.points,material:Cesium.Color.fromCssColorString(option.lineColor?option.lineColor:Cesium.Color.CHARTREUSE.withAlpha(0.3)),width:2}});
                // _self.removeObj.push(_self.entitys.add(_self.shape.lineObj)); //创建线
                _self.entitys.showTip(_self._resultTip,true,moveEndPosition,'再次点击结束');
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
    removeRect(){
        if(this.removeObj.length != 0){
            for (let i = 0; i < this.removeObj.length; i++) {
                this.viewer.entities.remove(this.removeObj[i]);
                
            }
            
            this.removeObj = [];
        }
    }
    removeHandle(){
        if(this.handleArr.length > 0){
            for(let i in this.handleArr)this.handleArr[i].destroy();
            this.entitys.remove(this._resultTip);
            this._resultTip = null;
            this.handleArr = [];
        }
    }
     /*
    * 测三角方法
    */ 
    drawTriangle(){
         /**
         * 点击
         */
        let _self = this;
        // 测量状态
        if(_self.measureType){
            return false;
        }
        let itemTriangle = {
            distance : 0,
            lineObj : [],
            entity :  [],
            position1 : [],
            position2 : [],
            position3 : [],
        };
        _self.measureType = true;
        _self.viewer.scene.screenSpaceCameraController.enableRotate = false;//锁定相机
        this.handlerAction = new Handler(_self.viewer);  //handler实体对象
        _self._resultTip = _self.entitys.createMsgTip();
        _self.handlerAction.Action(function(e){ //第一次点击
            if(!e.position){
                return false;
            }
            if(itemTriangle.position1.length == 0){ //开始
                let cartesian = _self.mouseManager.piTerrainToModule(e.position);  //判断拾取的坐标 地形 or 模型
                if(!cartesian)return false;
                itemTriangle.position1.push(cartesian.clone());
                itemTriangle.position1.push(cartesian.clone());
                itemTriangle.position2.push( itemTriangle.position1[0].clone());
                itemTriangle.position2.push( itemTriangle.position1[0].clone());
                //创建点
                _self.createPoint(cartesian, itemTriangle);
                _self.handlerAction.COUNTER = itemTriangle.position1.length;
            }else{ //第二次点击取消
                _self.handlerAction.destroy(); //关闭事件句柄 
                _self.entitys.remove(_self._resultTip);
                _self.viewer.scene.screenSpaceCameraController.enableRotate = true;//解锁相机
                let cartesian = _self.mouseManager.piTerrainToModule(e.position);  //判断拾取的坐标 地形 or 模型
                if(!cartesian){
                    _self.triangleSpace.push(itemTriangle);
                    _self.measureType = false;
                    return false;
                }else{
                    //创建点
                    //_self.triangleSpace.createPoint(cartesian,_self);
                    itemTriangle.position1.pop();
                    itemTriangle.position1.push(cartesian.clone());
                    let tempPoints = _self.point_conf(itemTriangle.position1);
                    //line 2 直刷新第二个点
                    itemTriangle.position2.pop();  
                    itemTriangle.position2.push(tempPoints.clone());
                    //line 3 一直刷新
                    itemTriangle.position3.pop();
                    itemTriangle.position3.pop();    
                    itemTriangle.position3.push(tempPoints.clone());
                    itemTriangle.position3.push(itemTriangle.position1[1].clone());
                    _self.triangleSpace.push(itemTriangle);
                    _self.measureType = false;
                }  
            }
        },_self.handlerAction.LEFT_CLICK);
        /**
         * 移动
         */
        _self.handlerAction.Actions(function(e){
            let cartesian = _self.mouseManager.piTerrainToModule(e.endPosition); 
            _self.entitys.showTip(_self._resultTip,true,cartesian,'点击地图');},function(e){ //两个
            if(e.endPosition == undefined){
                return false;
            }
            try {
                let cartesian = _self.mouseManager.piTerrainToModule(e.endPosition);  //判断拾取的坐标 地形 or 模型
                if(!cartesian)return false;
                if (!Cesium.defined(itemTriangle.lineObj[0])) {//画
                    _self.createLine(itemTriangle);
                } else {
                    itemTriangle.position1.pop();
                    itemTriangle.position1.push(cartesian.clone());
                    
                    let tempPoints = _self.point_conf(itemTriangle.position1);
                    //line 1
                    itemTriangle.position2.pop();  
                    itemTriangle.position2.push(tempPoints.clone());
                    //line 2
                    itemTriangle.position3.pop(); 
                    itemTriangle.position3.pop();    
                    itemTriangle.position3.push(tempPoints.clone());
                    itemTriangle.position3.push(itemTriangle.position1[1].clone());  
                }
                _self.entitys.showTip(_self._resultTip,true,cartesian,'再次点击结束');
                
            } catch (error) {
                console.log(error);
            }
            
        },_self.handlerAction.MOUSE_MOVE,_self.handlerAction.COUNTER);
        /**
         * 右击结束
         */
       /* this.handlerAction.Action(function(e){
            if(!e.position){
                return false;
            }
            _self.handlerAction.destroy(); //关闭事件句柄 
            let cartesian = _self.mouseManager.piTerrainToModule(e.position);  //判断拾取的坐标 地形 or 模型
            if(!cartesian)return false;
            //创建点
            //_self.triangleSpace.createPoint(cartesian,_self);
            _self.triangleSpace.position1.pop();
            _self.triangleSpace.position1.push(cartesian.clone());
            let tempPoints = _self.triangleSpace.point_conf(_self.triangleSpace.position1);
            //line 2 直刷新第二个点
            _self.triangleSpace.position2.pop();  
            _self.triangleSpace.position2.push(tempPoints.clone());
            //line 3 一直刷新
            _self.triangleSpace.position3.pop();
            _self.triangleSpace.position3.pop();    
            _self.triangleSpace.position3.push(tempPoints.clone());
            _self.triangleSpace.position3.push(_self.triangleSpace.position1[1].clone());
        },_self.handlerAction.RIGHT_CLICK);*/
    }
     /*
    * 测距离方法
    */ 
    drawLine(calback){
        /**
         * 点击
         */
        let _self = this;

        if(_self.measureType){
            return false;
        }
            
        // 创建测量对象
        let lineItem = {
            distance : 0,
            lineObj : undefined,
            positions : [],
            entity : [],  
        };
        lineItem.id = generateUUID();
        _self.measureType = true;
        this.handlerAction = new Handler(_self.viewer);  //handler实体对象
        _self.viewer.scene.screenSpaceCameraController.enableRotate = false;//锁定相机
        _self._resultTip = _self.entitys.createMsgTip();
        _self.handlerAction.COUNTER = 0; //初始化
        _self.handlerAction.Action(function(e){ //第一次点击
            if(_self.Tools.nullBool(e.position)){
                return false;
            }
            let cartesian = _self.mouseManager.screenToWorld(e.position);
            lineItem.positions.push(cartesian); //模拟
            lineItem.positions.push(cartesian.clone());
            /**
             * 创建实体
             */
            let entity = _self.entitys.createEntity();
            entity.position = cartesian;
            entity.point = _self.entitys.getPoint();
            entity.label = _self.entitys.getLabel(lineItem.distance + "米"); 
            lineItem.entity.push(_self.entitys.add(entity)); //创建点
        },_self.handlerAction.LEFT_CLICK);
        /**
         * 移动
         */
        _self.handlerAction.Action(function(e){
            if(_self.Tools.nullBool(e.endPosition)){
                 return false;
            }
            let cartesian = _self.mouseManager.screenToWorld(e.endPosition);
            if(lineItem.positions.length >= 2){
                if (!Cesium.defined(lineItem.lineObj)) {
                    lineItem.lineObj = new entityFactory({type:"createLine",data:{positions:lineItem.positions,clampToGround:true}});
                     if(_self.Tools.nullBool( lineItem.lineObj)){
                         return false;
                     }
                   
                    lineItem.entity.push(_self.entitys.add(lineItem.lineObj)); //创建线
                }else{
                    lineItem.positions.pop();
                    lineItem.positions.push(cartesian.clone());
                }
                _self.entitys.showTip(_self._resultTip,true,cartesian,'鼠标右键结束');
            }else{
                _self.entitys.showTip(_self._resultTip,true,cartesian,'点击地图');
            }
            lineItem.distance = _self.getSpaceDistance(lineItem.positions);
        },_self.handlerAction.MOUSE_MOVE);
        /**
         * 右键取消
         */
        this.handlerAction.Action(function(e){
            if(_self.Tools.nullBool(e.position)){
                return false;
            }
            _self.handlerAction.destroy(); //关闭事件句柄
            lineItem.positions.pop(); //最后一个点无效
            _self.lineSpace.push(lineItem);
            _self.viewer.scene.screenSpaceCameraController.enableRotate = true;//解锁相机
            _self.entitys.remove(_self._resultTip);  // 清除提示信息
            _self.measureType = false; // 测量状态变更

            if(calback){
                let arrays=[];
                lineItem.positions.forEach(item=>{
                    arrays.push(_self.mouseManager.worldToLonlat(item))
                   
                })
                calback(arrays)
            }
        },_self.handlerAction.RIGHT_CLICK);
    } 
    // 移除距离
    removeLine(){
           // 移除距离测量
           if(this.lineSpace){
            for (let index = this.lineSpace.length-1; index >= 0 ; index--) {
                if(this.lineSpace[index].entity.length > 0){
                    for(let i in this.lineSpace[index].entity){
                        this.entitys.remove(this.lineSpace[index].entity[i]);
                    }
                    // 移除当前数据
                    this.lineSpace.splice(index,1)         
                }
            }
        }
    }
    // // 添加监听
    // addPostRenderEvent(gisPosition){
    //     let _self = this;
    //     this.viewer.scene.postRender.addEventListener(
    //         callbackFunc
    //     );
    //     let markerPopup = document.createElement("div");
    //     markerPopup.className = "info-popup-wrap";
    //     markerPopup.style.position = "absolute";
    //     markerPopup.style.width = "100px";
    //     markerPopup.style.height = "30px";
        
    //     let sureBtn = document.createElement("button");
    //     sureBtn.className = "info-popup-sure";
    //     sureBtn.innerHTML = "x";
    //     sureBtn.onclick = function() {alert(1)};
    //     markerPopup.appendChild(sureBtn);
    //     _self.viewer.cesiumWidget.container.appendChild(markerPopup);
    //     function callbackFunc(){
    //         const canvasHeight = _self.viewer.scene.canvas.height;
    //         const windowPosition = new Cesium.Cartesian2();
    //         Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    //             _self.viewer.scene,
    //             gisPosition,
    //             windowPosition
    //         );
    //         markerPopup.style.bottom = canvasHeight - windowPosition.y + "px";
    //         const elWidth = markerPopup.offsetWidth;
    //         markerPopup.style.left = windowPosition.x - elWidth / 2 + "px";
    //     }

    // }
    
    // removePostRenderEvent(){
    //     this.viewer.scene.postRender.removeEventListender(callbackFunc);
    // }
    
    creatSplitView(dom,mapLayer){
        // let mapLayers = new Cesium.ArcGisMapServerImageryProvider({
        //     url : '//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        // });
        // let dom = document.getElementById("cesiumContainer")
        let opt = {viewer: this.viewer,map:mapLayer,dom:document.getElementById(dom)}            
        const SplitViewFun = new SplitView(opt);
        this.duibiObj = SplitViewFun
    }
    removeSplitView(){
        if(this.duibiObj){
            this.duibiObj.remove();
            this.duibiObj = null;
        }
    }
    /**
     * @Descripttion:比例尺 
     * @Author: 陈杰
     * @Date: 2022-02-20 13:02:53
     * @LastEditors: 
     * @param {*}
     * @return {*}
     */    
    scaleDenominator(calback){
        let viewer=this.viewer;
        this.viewer.scene.postRender.addEventListener(function() {
            let scene = viewer.scene;
            let width = scene.canvas.clientWidth;
            let height = scene.canvas.clientHeight;
            
            let left = scene.camera.getPickRay(
                new Cesium.Cartesian2((width / 2) | 0, height - 1)
            );
            let right = scene.camera.getPickRay(
                new Cesium.Cartesian2((1 + width / 2) | 0, height - 1)
            );
            
            let globe = scene.globe;
            let leftPosition = globe.pick(left, scene);
            let rightPosition = globe.pick(right, scene);
            let geodesic = new Cesium.EllipsoidGeodesic();
            let leftCartographic = globe.ellipsoid.cartesianToCartographic(
                leftPosition
            );
            let rightCartographic = globe.ellipsoid.cartesianToCartographic(
                rightPosition
            );

            geodesic.setEndPoints(leftCartographic, rightCartographic);
            let pixelDistance = geodesic.surfaceDistance;
            // var distances = [
            //     1,
            //     2,
            //     3,
            //     5,
            //     10,
            //     20,
            //     30,
            //     50,
            //     100,
            //     200,
            //     300,
            //     500,
            //     1000,
            //     2000,
            //     3000,
            //     5000,
            //     10000,
            //     20000,
            //     30000,
            //     50000,
            //     100000,
            //     200000,
            //     300000,
            //     500000,
            //     1000000,
            //     2000000,
            //     3000000,
            //     5000000,
            //     10000000,
            //     20000000,
            //     30000000,
            //     50000000
            //   ];
            //   let maxBarWidth = 100;
            //   let distance;
            //   for (
            //     let i = distances.length - 1;
            //     !Cesium.defined(distance) && i >= 0;
            //     --i
            //   ) {
            //     if (distances[i] / pixelDistance < maxBarWidth) {
            //       distance = distances[i];
            //     }
            //   }
            //   let label
            //   if (Cesium.defined(distance)) {
            //    label =
            //       distance >= 1000
            //         ? (distance / 1000).toString() + " km"
            //         : distance.toString() + "m";
                
            //   } 
            calback?calback(pixelDistance):null;
        })

    }


}
