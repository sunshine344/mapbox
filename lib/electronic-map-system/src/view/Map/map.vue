<template>
    <div class="map3d">
        <div id="map3d">
            
        </div>
          <div class="testmap">
              <!-- <button type="button" @click="drawPolygon()">绘制多边形</button>
              <button type="button" @click="drawRectange()">绘制矩形</button>
              <button type="button" @click="drawboxReactangle()">拉框</button> -->
              <!-- <button type="button" @click="thermodynamic()">热力图</button> -->
              <!-- <button type="button" @click="raylight()">光线</button> -->
          </div>
            <div class="heatmap" id="heatmapbox" ></div>
    </div>
</template>
<script lang="ts">
// import { state } from "@store";
import {
  reactive,
  defineComponent,
  toRefs,
  Ref,
  ref,
  onBeforeMount,
  onMounted
} from "vue";
import colorConfig from "@assets/config.ts";
import supermap from "@assets/js/map.js";
import { objectEach } from "igu/lib/core/utils";
import { outputStore } from "@store";
import { useRoute, useRouter } from "vue-router";


//xf
// 路径规划
import MapPath from "@assets/js/mapPath/mapPath.js";
// 标绘
import MapPlot from "@assets/js/mapPlot/mapPlot.js";
//xf

import { toBig, toSmall, compass } from "@assets/js/lib/baseControl.js";
import MarkPoint from "./src/image/markerpoing.png";
import MapMeasure from "@assets/js/lib/mapMeasurement.js";
import Measure from "@assets/js/lib/measure/measure.js";
const state = sessionStorage.getItem("state");
import  WKT from 'terraformer-wkt-parser' ;//wkt依赖 from 'terraformer-wkt-parser' ;//wkt依赖
// import {squareGrid,lengthToRadians } from '@turf/turf';
import "./map.scss"
import { geometry } from "@turf/helpers";
import StagnationPointDetection from "./src/image/stagnationpointdetection.png";
import {fileDatatrajectoryCollision } from "@api/core/list.ts";
// import { AnyObject } from "@config/type/global";
// import AnyObject from "@config/amb";
import { object } from "vue-types";
import { message } from "ant-design-vue";

declare interface AnyObject {
  //声明数组对象
  [key: string]: any;
}
let map: AnyObject = {};
export default defineComponent({
  setup(props,context) {
    const data: any = reactive({
      detile: false,
      flag: false,
      uflag: false,
      styleFlage: false
    });
    const route = useRoute();
    const router = useRouter();
    let compassCss: Ref<any> = ref(""); //指南针旋转
    let measureobj: AnyObject = {}; //测量对象
    let imageProvider: any = null;
    let provider: any = null;
    let flag: boolean = data.flag;
    let _data: AnyObject = data;
     let statelliteImage:AnyObject={};//卫星影像变量
     let splitScreenFlag:Ref<Boolean>=ref(false);
     let layers:AnyObject={};//图层影像
     let premapLayer:AnyObject={};//记录之前图层
     let currentDixing:AnyObject={};//当前地形
     let odCurrentcollection:AnyObject|null=null;//od分析当前图层

    //xf
    let MapPathObj: AnyObject = {}; //路径规划对象
    let MapPlotObj: AnyObject = {}; //标绘对象
    //xf 
     let currentLocationcolLection:AnyObject|null=null;//记录当前定位位置
     let stagnationpointdetectionCollection:AnyObject|null=null;//驻点检测实体
    const defaultLoadMap=()=>{
  
      // map.UrlTemplateImageryProvider(
      //       "weixingyingxiang",
      //       "https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=915de993ea6873664830bf5d8217723c"
      //     )
    //  statelliteImage= map.UrlTemplateImageryProvider(
    //         "dainziditu",
    //         "https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=915de993ea6873664830bf5d8217723c"
    //       );
    //     statelliteImage.show=false;

        // currentDixing= map.mapdem('dixing','http://localhost:80/bjdzdt/3swdx');  //地形
        //   map.obliquephotography({url:'http://localhost:80/bjdzdt/4qxsy/tileset.json',heightOffset:-100},(enty:AnyObject)=>{
        //       map._viewer.flyTo(enty)
          
        //   });

       let timeoutobj:number= setTimeout(()=>{
           map.flyToCamera(
              {
                position: {
                  x: -2431598.365579905,
                  y:5456101.731957514,
                  z: 2367826.9457821264
                },
                heading: 0.15888956758803463,
                pitch:-0.5425060371496793,
                roll:6.28318501822336
              },
              3,
              () => {
                clearInterval(timeoutobj)
                toopMethod.compass(); //指南针
                 measureobj.scaleDenominator((e:string|number)=>{

                    context.emit('scaleDenominator',e)
                  

                 })//比例尺
                //  经纬度
                 map.movepostion((e:AnyObject)=>{
                      context.emit('longlat',e)
                 })


                 
              }
            );
        },1000)

    }
    /**
     * @Descripttion: 头部工具方法
     * @Author: 陈杰
     * @Date: 2022-01-21 15:08:41
     * @LastEditors:
     * @param {*}
     * @return {*}
     */

    let toopMethod: AnyObject = {
    
      init() {
        // measureobj = new MapMeasure(map._viewer); //测量工具
        measureobj = new Measure(map._viewer);
        // Measure
      },
      // 分屏
      spitScreen(flag:Boolean): void {
        map.MultiViewportMode(flag ? "HORIZONTAL" : "NONE");
       statelliteImage.show=flag?true:false;
        splitScreenFlag.value=flag;
        statelliteImage.setVisibleInViewport(0, false);
      },
      // 拾取
      pickup(calback:Function){
          map.creatOneClick('one',(cartographic:AnyObject,event:AnyObject,viewer:AnyObject)=>{
              calback?calback(cartographic,event,viewer):null
          })
      },
      //变大
      toBig() {
        toBig(map._viewer);
      },
      // 变小
      toSmall() {
        toSmall(map._viewer);
      },
      // 指南针
      compass() {
        compass(map._viewer, (degress: string) => {
       
          compassCss.value = degress;
             context.emit('compass',degress)
        });
      },

      // 定位
      location() {
        let pointArray: {
          text?: String;
          point: Array<Number | String>;
          img: any;
        }[] = [
          {
            text: "104,30",
            point: [104, 30],
            img: MarkPoint
          }
        ];
        // option.heading,option.pitch,option.roll
        let collection: any = map.addPointMark(pointArray, {
          width: 40,
          height: 40,
          pixelOffset: [0, -100]
        });
        map.flyEntity(collection, {
          heading: 0.10434587483793223,
          roll: 5.100453392969939e-11,
          pitch: -0.6644403226377262
        });
        // map.flyToCameralong({position:[104,30,1000],heading:0.10489045365956251,pitch:-0.5134892085197742,roll:6.283185212018719})

        //  setTimeout(() => {
        // 	 	map.removeAllCollection(collection);
        //  }, 2000);
      },
      // 测距
      measureDistance(calback?:Function) {
        // measureobj.measureDistance(); //测距
        measureobj.drawLine(calback);
      },
      removeDistance(){
        measureobj.removeLine()
      },
      // 测面
      measureArea() {
        // measureobj.measureArea(); //测距侧面
        measureobj.drawArea();
      },
      // 测高
      measureHeight() {
        // measureobj.measureHigh();
        measureobj.drawTriangle();
      },
      clearAll() {
        // measureobj.clearAll();
        measureobj.remove();
        if(statelliteImage.show){
          statelliteImage.show=false;
           map.shutterContrast(false); //清除卷帘

        };
        // map.MultiViewportMode("NONE");
        splitScreenFlag.value = false;
        statelliteImage.show=false;
        if(currentLocationcolLection){
            map.removeAllCollection(currentLocationcolLection);
            currentLocationcolLection=null;
        }
      
        // map.shutterContrast(false); //移除卷帘
      },
      //卷帘对比
      shutterContrast() {
        let layer:AnyObject={};
          if(measureobj.duibiObj){
                 measureobj.removeSplitView()
            }else{
              layer=map.UrlTemplateImageryProvider(
                "dainziditu",
                "https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=915de993ea6873664830bf5d8217723c"
              )
            measureobj.creatSplitView('map3d',layer)
              
          }
        
          // map.removeSplitView()
      }
    };
    /**
     * @Descripttion: 
     * @Author: 陈杰
     * @Date: 2022-02-12 13:09:44
     * @LastEditors: 
     * @param {*}
     * @return {*}
     */    
    let gridThermodynamicDiagram=(data:AnyObject,step:number,option?:AnyObject,color?:'',calback?:Function):void=>{
      if(!(data instanceof Array)) return;
      let bound:Array<number>=[109.650789918, 20.2141799223, 117.313711727, 25.5196164008];
        let xmin:number = bound[0];
        let xmax:number = bound[2];
        let ymin:number = bound[1];
        let ymax:number = bound[3];
        let longspace:number=xmax-xmin; //经度间隔
        let latspace:number=ymax-ymin;
        let features:AnyObject[]=[];
        function getlonglat(x:number,y:number,xmax:number,ymax:number,step:number){
            let long:number|string|null=null;
            let lat:number|string|null=null;
            let degree:number=step/(2*Math.PI*6371004)*360;//米换经纬度；
            lat=ymax-(y-1)*degree; //纬度
            long=xmax-(x-1)*degree; //经度
            let thirdlatlong:Array<number>=[long,lat];
            return [[[long-degree,lat],[long,lat],[long,lat-degree],[long-degree,lat-degree],[long-degree,lat]]]
        }
        for (let i = 0; i < data.length; i++) {
            let x:number=data[i].x;
            let y:number=data[i].y;
              features.push({
                type: "Feature",
                properties: {
                  num:data[i].total
                },
                geometry: {
                    type: "Polygon",
                    coordinates:getlonglat(x,y,xmax,ymax,step)
                }
            })
          
        }
        let json:AnyObject = {
                type: "FeatureCollection",
                features:features
            }
          json.features.forEach((item:AnyObject) => {
                    if(option){
                      for (const key in option) {
                          if(item.properties.num<=parseInt(key)){
                              item.properties.color=option[key];
                              break; //不可去除用于判断不同的颜色
                          }
                      }
                    }else{
                      item.properties.color='rgba(174,170,31)'
                    }
          });
         
          //加载网格热力图
           map.addPolygn(json,(datasource:AnyObject)=>{
              
               map._viewer.flyTo(datasource);
               calback?calback(datasource):null;//返回函数
              //  map._viewer.flyTo(enty)
              
          })
    }
    const removePolygn=(enty:AnyObject):void=>{
         map.removeAllCollection(enty)
    }
    /**
     * @Descripttion:移除网格地图 
     * @Author: 陈杰
     * @Date: 2022-02-12 15:14:45
     * @LastEditors:  公司定制图层 "http://222.73.139.7:8082/tileMap/services/MapServer/ms67c22e31cf/tile/{z}/{y}/{x}?startLevel=1"
     * @param {*} enty
     * @return {*}
     */    
    let removegridThermodynamicDiagram=(enty:AnyObject):void=>{
          	map.removeAllCollection(enty);
    }
    // 移除dataSource实体
    let removeCollection=(enty:AnyObject):void=>{
          	map.removeAllCollection(enty);
    }
    /**
     * @Descripttion: 切换图层
     * @Author: 陈杰
     * @Date: 2022-02-15 11:03:18
     * @LastEditors: 
     * @param {*} name 图层名字唯一标示
     * @param {*} url 图层地址
     * @return {*}
     */    
    let changMap=(name:string,url:string|boolean):void=>{
         
          if(!url){
            layers[name].show=false;
            return
          }
           for (const key in layers) {
            if(layers[key]){
              layers[key].show=false;
            }
          }
          if(layers[name]){
             layers[name].show=true;
               
          }else{
              let Provider: any = null;
              Provider = map.UrlTemplateGeographicTilingSchemeImageryProvider(name,url);
                layers[name]=Provider;
                

          }
       
    }
    /**
     * @Descripttion:电子围栏方法
     * @Author: 陈杰
     * @Date: 2022-02-16 16:11:22
     * @LastEditors: 
     * @param {*}
     * @return {*}
     */    
      // 绘制任意多边形
     const  drawPolygon=(calback?:Function):void=>{
        measureobj.drawpolygon((e:any)=>{
          let wkt:string=WKT.convert(e); //geometry转wkt传给后端
           calback?calback(wkt):null;
          // let geometry:AnyObject=WKT.parse(wkt);
          //   console.log('回调',wkt)
          
        })

     }
    //  绘制矩形
     const drawRectange=(calback?:Function):void=>{
        measureobj.drawRectangle((e:any)=>{
            let wkt:string=WKT.convert(e); //geometry转wkt传给后端
               calback?calback(wkt):null
               
        })
     }
     const removedrawRectange=()=>{
          measureobj.removeRect()

     }
    //  绘制拉框矩形
    // calback为回调函数返回wkt数据
    const drawboxReactangle=(calback?:Function):void=>{
        measureobj.drawRect((e:any)=>{
            let wkt:string=WKT.convert(e); //geometry转wkt传给后端
              calback?calback(wkt):null
          
        })
    }
    /**
     * @Descripttion: 切换公司定制图层xyz方式
     * @Author: 陈杰
     * @Date: 2022-02-18 10:04:26
     * @LastEditors: 
     * @param {*} id 图层id
     * @param {*} url图层地图 列如http://222.73.139.7:8082/tileMap/services/MapServer/ms67c22e31cf/tile/{z}/{y}/{x}?startLevel=1
     * @return {*}
     */    
    const UrlTemplateGeographicTilingSchemeImageryProvider=(id:string,url:string):AnyObject=>{
        return  map.UrlTemplateGeographicTilingSchemeImageryProvider(id,url);

    }
    // 加载地形 id 地图图层标识 url地形地址 如http://10.51.100.2:8000/bjdzdt/3swdx/
      // 三维地形：http://10.51.100.2:8000/bjdzdt/3swdx/layer.json
    
    const  mapTerrian=(id:string,url:string):AnyObject=>{
          return  map.mapdem(id,url)
    }
    // 地形显示与否， terrian地形实体或者falge隐藏
    const removeterrian=()=>{
        map.removeterrian()
      
    }
    // 加载模型
        // 倾斜摄影：http://10.51.100.2:8000/bjdzdt/4qxsy/tileset.json
      interface obliquephotographyOption{
            url:string,
            heightOffset ?:number
      }
    const obliquephotography=(data:obliquephotographyOption,calback ?:Function)=>{
          map.obliquephotography(data,calback)
    }
    // 地图飞入定位实体
    const flyEntity=(enty:AnyObject):void=>{
        map._viewer.flyTo(enty)
    }
    //删除图层layer
    const removelayer=(layer:AnyObject):void=>{
      map.removelayer(layer)
    }
    /**
     * @Descripttion: 轨迹碰撞方法
     * @Author: 陈杰
     * @Date: 2022-02-19 17:16:33
     * @LastEditors: 
     * @param {*}
     * @return {*}
     */   
    const thermodynamic=()=>{
      interface fileDatatrajectoryCollisionData{
          analysisScope:string,
          dataIds:string,
          distance:number,
          endTime:string|number,
          startTime:string|number
      }
      
      let pragrams:fileDatatrajectoryCollisionData={
              analysisScope:'POLYGON((114.13307015591 22.3392745535538,114.133055121264 22.3390981968837,114.133003391704 22.3389279574811,114.132916955295 22.3387703775298,114.132799133834 22.3386315126961,114.13265445518 22.3385166994191,114.132488479248 22.3384303498436,114.132307584339 22.3383757822735,114.132118722041 22.3383550936606,114.131929150094 22.3383690790278,114.131746153501 22.3384172009208,114.131576764594 22.3384976100632,114.131427492798 22.3386072164196,114.131304074498 22.3387418079378,114.131211252595 22.3388962124062,114.131152594242 22.3390644962097,114.131130353752 22.3392401923453,114.131145385943 22.339416548938,114.131197113279 22.3395867887072,114.131283548032 22.3397443694133,114.131401368657 22.3398832352751,114.131546047423 22.3399980496969,114.131712024398 22.3400844003597,114.131892921121 22.3401389687942,114.13208178573 22.3401596579167,114.132271360131 22.3401456726269,114.132454358948 22.3400975503673,114.132623749511 22.3400171404701,114.132773022143 22.3399075330856,114.132896440331 22.3397729404226,114.132989261191 22.3396185348668,114.133047917729 22.339450250199,114.13307015591 22.3392745535538))',
              dataIds:'90cf483f-6bf0-4c70-8404-d12be360a08a,8f2c63c4-db5b-419f-8f40-adf192a36ead',
              distance:100,
              endTime:'20220227232059',
              startTime:'20220201001404'
      }
      // fileDatatrajectoryCollision
       fileDatatrajectoryCollision(pragrams).then((res:any)=>{
             res
          if(res.data instanceof Array){
            let data:AnyObject[]=res.data;
            let points:AnyObject[]=[];
            let max:number=0;
            data.forEach((item:AnyObject)=>{
               let geometry:AnyObject=WKT.parse(item.key);
               max=Math.max(max,Number(item.value))
               points.push({
                 x:geometry.coordinates[0],
                 y:geometry.coordinates[1],
                 value:Number(item.value),
                 radius:Number(item.value)
               })
            })
          
              map.heatmapav(points,max)
          }

        })
        // console.log('热力图方法',h337 )

    }
    /**
     * @Descripttion:打印 
     * @Author: 陈杰
     * @Date: 2022-02-21 13:18:17
     * @LastEditors: 
     * @param {*}
     * @return {*}
     */    
    const printImage=()=>{
        map.printImage()

    }
    // 定位
    const locationArray=(array:AnyObject[])=>{
       let collection: any = map.addPointMark(array, {
          width: 40,
          height: 40,
          pixelOffset: [0, -100]
        });
        map.flyEntity(collection, {
          heading: 0.10434587483793223,
          roll: 5.100453392969939e-11,
          pitch: -0.6644403226377262
        });
        currentLocationcolLection=collection;
        return collection;

    }
    // 加点不定位
    const   locationArrayicon=(array:AnyObject[])=>{
       let collection: any = map.addPointMark(array, {
          width: 40,
          height: 40,
          pixelOffset: [0, -180]
        });
        return collection;

    }
    interface pointCenterlabeltype{
          id:string|number,
          point:number[],
          color?:string,
          text:string|number

    }
    /**
     * @Descripttion: 驻点检测
     * @Author: 陈杰
     * @Date: 2022-02-21 17:00:22
     * @LastEditors: 
     * @param {*} data
     * @param {*} calback
     * @return {*}
     */    
    const  pointCenterlabel=(data:pointCenterlabeltype[],calback?:Function)=>{
      if(stagnationpointdetectionCollection){
          removePointCenterlabel(stagnationpointdetectionCollection);
          stagnationpointdetectionCollection=null;
      }
      let  collection:any= map.addPointCirclekcenter(data);
      stagnationpointdetectionCollection=collection;//保存加点实体
      calback?calback(collection):null;
      flyEntity(collection)

    }
    // 驻点检测删除
    const  removePointCenterlabel=(collection:AnyObject)=>{
        map.removeAllCollection(collection)
    }

    /**
     * @Descripttion: oD分析光线
     * @Author: 陈杰
     * @Date: 2022-02-25 13:30:22
     * @LastEditors: 
     * @param {*}
     * @return {*}
     */
    // od分析光线
    interface dataType{
        id:string,
        startPoint:number[],//起点
        endPoint:number|string[], //终点
        startText?:string, //起点标注
        endtext?:string//终点标注
        time ?:number,//移动时间默认3000
        height?:number,//弧线最大高度
        color:string, //光线颜色
        width:number,//光线宽度
        num:number,//点位密集度默认1000，不可去掉
    }
     
    const raylight=(data:dataType[],calback?:Function):any=>{
        if(data instanceof Array){
          removeraylight(odCurrentcollection) ;//判断先清除
         let datasouce= map.PolylineTrailMaterialProperty(data,calback);
        //  flyEntity
          odCurrentcollection=datasouce
          map.flyEntity(datasouce);
         return datasouce
        }else{
            console.error('光线未传入数组',data)
            // message.warning("请");
        }

    }
    const removeraylight=(datasource:any)=>{
        if(datasource){
          map.removeAllCollection(datasource);
          odCurrentcollection=null;
          map.removEventPolylineTrailMaterialProperty();//移除光线监听事件

        }
    }
    onMounted(() => {
      // let link = document.createElement("link");
      // link.type = "text/css";
      // link.id = "app";
      // link.rel = "stylesheet";
      // link.href = style1;
      // document.getElementsByTagName("head")[0].appendChild(link);
        map = new supermap(); 
        map.init();
       

        toopMethod.init(); //初始化
        toopMethod.compass();
        
        map._viewer.scene.globe.depthTestAgainstTerrain = false; //为true时，球体会有高程遮挡效果（在没有地形时候也会有高程遮挡效果）
    
        // map.screenPosition((position:string|number[])=>{
        //     console.log('位置',position)
        // })

        //  (window as any).map = map;
      // imageProvider = map.UrlTemplateGeographicTilingSchemeImageryProvider(
      //     "chengdu",
      //     "http://222.73.139.7:8082/tileMap/services/MapServer/ms67c22e31cf/tile/{z}/{y}/{x}?startLevel=1"
      // );
      defaultLoadMap();//默认加载地图
       context.emit('mpaload') //地图初始化后出发
      
      // provider = map.ArcGisMapServerImageryProvider(
      //   "arcgisprovider",
      //   "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
      // );
      
      //xf
      // 路径规划对象创建
      MapPathObj = new MapPath(map._viewer);
      MapPathObj.init();
      // 标绘对象创建
      MapPlotObj = new MapPlot(map._viewer);
      MapPlotObj.init();
      //xf
      
    });

    //xf
    /******************************* 路径规划 *************************************/
    // 地图打点
    const plotPointFun = (item:AnyObject,callback?:Function):void=>{
      MapPathObj.plotPoint(item, addShortestPath)
    }
    const addShortestPath = (cartographic: Array<number>,event:AnyObject ):void =>{
      context.emit('mapPlotPoint',cartographic)
    } 
    const removePointFun = (item:AnyObject)=>{
      MapPathObj.removePathpoint(item)
    }
    const setPathPointFun = (item:AnyObject)=>{
      MapPathObj.addShortestPath(item);
    }
    /**
     * @description: 路径规划地图重置
     */    
    const removePlanAllFun = ()=>{
      MapPathObj.removeAll();
    }
    const setDataLine = (item:AnyObject)=>{
      MapPathObj.creatPathLine(item)
    }
    const flotPositionPoint = (clickItem:AnyObject, type:string)=>{
      MapPathObj.mapPointHighlight(clickItem,type)
    }
    const setlinkage = (ite:AnyObject,idx:number,index:number)=>{
      MapPathObj.mapLineHighlight(ite,idx,index)
    }
    /******************************* 地图标绘 *************************************/
    const mapPlotBtFun = (item:AnyObject,callback?:Function):void=>{
      MapPlotObj.addKMLDItem(item);
      // if(item.type == "point"){
      //   MapPlotObj.drawPoint(mapPlotBtCallback);
      // }else if(item.type == "point"){
      //   MapPlotObj.drawLineString(mapPlotBtCallback);
      // }else{
      //   MapPlotObj.drawPolygon(mapPlotBtCallback);
      // 
    }
    /**
     * @description: 获取绘制的数据
     */    
    const getPlotDataFun = ()=>{
      return MapPlotObj.getGeometryData();
    }
    const removeAllMapPlot = ()=>{
      MapPlotObj.removeAll()
    }
    
    const mapPlotBtCallback = ()=>{
      // MapPlotObj.drawPoint(item)
      
    }
    const removeEventFun = ()=>{
      MapPlotObj.removeHandle();
    }
    //xf

    return {
      data,
      toopMethod, //工具方法
      compassCss,
      gridThermodynamicDiagram,
      removegridThermodynamicDiagram,
      defaultLoadMap,
      splitScreenFlag,
      changMap,
      drawPolygon,
      drawRectange,
      drawboxReactangle,
      map,
      UrlTemplateGeographicTilingSchemeImageryProvider,
      flyEntity,
      mapTerrian,
      obliquephotography,
      removelayer,
      removeterrian,
      thermodynamic,
      locationArray,
      currentLocationcolLection,
      printImage,
      pointCenterlabel,
      removePointCenterlabel,
      raylight,
      //xf
      plotPointFun, 
      mapPlotBtFun,
      removePointFun,
      removePlanAllFun,
      setPathPointFun,
      setDataLine,
      flotPositionPoint,
      setlinkage,
      getPlotDataFun,
      removeAllMapPlot,
      removeEventFun,
      locationArrayicon,
      removeCollection,
      removedrawRectange,
      //xf
      removeraylight
      
    };
  }
  // components:{
  //   Content
  // }
});
</script>

<style lang="scss" scoped>
.map3d{
  width: 100%;
  height: 100%;
  #cesiumContainer{
    width: 100%;
    height: 100%;
    position: relative;
  }
}

</style>