/*
 * @Description: file content
 * @Author: xufeng
 * @Date: 2022-02-19 12:27:24
 * @LastEditTime: 2022-02-22 11:06:42
 * @FilePath: \project\src\assets\js\mapPath\mapPath.js
 */
import { indexOf } from 'xe-utils';
import { GetCurrentMousePosition,FlyToPoint } from '../methodFun/methodFun.js'
import { parse, stringify } from 'wellknown';  // 坐标系转换 
export default class MapPath{

    constructor(viewer){
        this.viewer = viewer;  // 地图对象
        this.pathPointObj = null; // 选中绘制点的数据
        this.shortestPath = null; // 点集合
        this.linePath = null;     // 线集合
        this.handleArr = [];   // 事件集合
        this.shortestPathHighEntity = null;  // 地图高亮对象
    
        this.mapPathStatus = false; // 设置监听状态
 
    }
    /**
     * @description: 初始化最短路径
     */
    init(){
        // 线集合
        this.linePath = new Cesium.CustomDataSource(
            "searchFeatures"
        );
        this.viewer.dataSources.add(this.linePath);
        // 点集合
        this.shortestPath = new Cesium.CustomDataSource(
            "searchFeatures"
        );
        this.viewer.dataSources.add(this.shortestPath);
    }

    /**
     * @description: 标绘点
     * @param {*} item
     */    
    plotPoint(item,callBack){
        // 获取类型与 id
        // 判断id 是否存在
        // 存在就删除重新绘制
        this.pathPointObj = item;
        this.setMapPathStatus(true);
        this.creatOneClick(this.viewer,'one',callBack);
    }
    /**
     * @description: 设置监听状态
     */        
    setMapPathStatus(val){
        this.mapPathStatus = val;
    }
    addShortestPath1(cartographic){
        let longitude = Number(String(cartographic.longitude * 180 / Math.PI).replace(/^(.*\..{6}).*$/,"$1"));
        let latitude = Number(String(cartographic.latitude * 180 / Math.PI).replace(/^(.*\..{6}).*$/,"$1"));
        //let height = cartographic.height;
        let stringLonLat = ''+ longitude + ','+ latitude
        longitude,latitude 
    }
    /**
     * @description: 地图创建监听事件 
     * @param {string} type 监听一次或永久监听（"one","all"）
     * @param {object} viewer 传入的地图viewer对象
     * @param {function} callBack 回调方法，抛出cartographic对象
     */
    creatOneClick(viewer,type,callBack){
        this.removeHandleArr();
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        this.handleArr.push(handler);
        handler.setInputAction(function(event) {
            var cartesian = GetCurrentMousePosition(viewer.scene,event.position)
            let cartographic;
            if (Cesium.defined(cartesian)) {
                cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
                    cartesian
                );
                let longitude = Number(String(cartographic.longitude * 180 / Math.PI).replace(/^(.*\..{6}).*$/,"$1"));
                let latitude = Number(String(cartographic.latitude * 180 / Math.PI).replace(/^(.*\..{6}).*$/,"$1"));
                let dataArr = [
                    longitude,latitude
                ]
                callBack(dataArr,event)
            }
            if(type == 'one'){
                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                handler.destroy();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    /**
     * @description: 添加点位数据
     * @param {*} 
     * @return {*}
     */
    addShortestPath(item){
        let string = item.wkt.substring(item.wkt.indexOf("(")+1,item.wkt.indexOf(")"));
        let arrLonglat =  string.split(" ");
        let imgurl;
        debugger
        if(item.type == 'qd'){
            imgurl = '/src/assets/images/map/qd.png';
        }else if(item.type == 'zd'){
            imgurl = '/src/assets/images/map/zd.png';
        }else if(item.type == 'avoidancePoint'){
            imgurl = '/src/assets/images/map/tjd.png';
        }else{
            imgurl = '/src/assets/images/map/tjd.png';
        }
        // 删除之前绘制的点
        if(this.shortestPath.entities.getById(item.id)){
            this.shortestPath.entities.removeById(item.id)
        }
        // 添加一个点位
        this.shortestPath.entities.add({
            id: item.id,
            position: Cesium.Cartesian3.fromDegrees(arrLonglat[0], arrLonglat[1]),
            billboard: {
                image: imgurl,
                width: 48,
                height: 100,
                sizeInMaters:true,
                pixelOffset: new Cesium.Cartesian2(0, -30),
                clampToGround:true,
            }
        });
    }
    /**
     * @description: 获取数据类型
     * @param {All Type} 
     * @return {string}
     * @Date: 2020-07-06 11:20:02
     * @author: Pat
     */
    getType(obj) {
        return Object.prototype.toString.call(obj).replace(/\[/g, "").replace(/\]/g, "").replace(/\s/g, "").replace(/\object/g, "")
    }
    /**
     * @description: 地图创建线
     * @param {*} data
     * @return {*}
     */
     creatPathLine(data){
         
        let _this = this;
        // 线
        //先移除再创建
        
        this.linePath.entities.removeAll();
        this.shortestPathHighEntity = null;
        debugger
        data.dataList.forEach((element,index) => {
            // 数据处理
            element.dataList.forEach((elem,idx)=>{
                let jsond = parse(elem.wkt);
                let arrs = []
                jsond.coordinates.forEach(ele => {
                    let typeDs = _this.getType(ele);
                    if( typeDs == "Array"){
                        ele.forEach(el =>{
                            let fdr = _this.getType(el);
                            if(fdr == "Array"){
                                el.forEach(e =>{
                                    let fd = _this.getType(e);
                                    if(fd == "Array"){
                                    arrs.push(e[0],e[1]);
                                    }else{
                                        arrs.push(e);
                                    }
                                })
                            }else{
                            arrs.push(el)
                            }
                        })
                    }
                });
                _this.linePath.entities.add({
                    id: index+''+idx,
                    name: 'fgfdg',
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArray(arrs),
                        width: 5,
                        material: Cesium.Color.fromCssColorString("#3e2ca0"),
                        // material: new Cesium.PolylineOutlineMaterialProperty({
                        //     color: Cesium.Color.ORANGE,
                        //     outlineWidth: 2,
                        //     outlineColor: Cesium.Color.BLACK
                        // }),
                        clampToGround: true
                    },
                    shapeType: "Polyline"
                })
            })
        });
        //居中
        setTimeout(() => {
            this.viewer.flyTo(this.linePath);      
        }, 1000);    
    }
    /**
     * @description: 地图高亮 线定位
     * @param {Object} item 点击的数据
     * @return {*} 
     */
    mapLineHighlight(item,idx,index){
        // 去除高亮
        if(this.shortestPathHighEntity){
            this.shortestPathHighEntity.polyline.material = Cesium.Color.fromCssColorString("#3e2ca0");
        } 
        let en = this.linePath.entities.getById(index+''+idx);
        en.polyline.material = Cesium.Color.fromCssColorString("#ff9000");
        this.shortestPathHighEntity = en;
        this.viewer.flyTo(en);  
    }
    /**
     * @description: 地图高亮 点定位
     * @param {Object} item 点击的数据
     * @return {*} 
     */
    mapPointHighlight(item, type){
        // 去除高亮
        if(this.shortestPathHighEntity){
            this.shortestPathHighEntity.polyline.material = Cesium.Color.fromCssColorString("#3e2ca0");
        } 
        let jsondjSon;
        if(type == 'last'){
            jsondjSon = parse(item.endPoint);
        }else{
            jsondjSon = parse(item.startPoint);
        }
        FlyToPoint(this.viewer, Cesium.Cartesian3.fromDegrees(jsondjSon.coordinates[0],jsondjSon.coordinates[1]))    
    }
    /**
     * @description: 清除添加的事件
     */    
     removeHandleArr(){
        if(this.handleArr.length > 0){
            for(let i in this.handleArr)this.handleArr[i].destroy();
            this.handleArr = [];
        }
    }
    /**
     * @description: 打点后单个点位删除 
     * @param {Object} item 点击的数据
     * @return {*} 
     */
    removePathpoint(item){
        if(this.shortestPath.entities.getById(item.id)){
            this.shortestPath.entities.removeById(item.id);
        }
    }
    /**
     * @description: 最短路径地图删除
     */
    removeAll(){
        this.removeHandleArr()
        this.shortestPath.entities.removeAll();
        this.linePath.entities.removeAll();
    }     

}