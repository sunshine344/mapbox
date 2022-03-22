<template>
    <div>
        <div id="map3d">
        <div id="vertical-slider"></div>
        <div id="horizontal-slider" style="display: none;"></div>
        </div>
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
import { toBig, toSmall, compass } from "@assets/js/lib/baseControl.js";
import MarkPoint from "@/src/image/markerpoing.png";
import MapMeasure from "@assets/js/lib/mapMeasurement.js";
import Measure from "@assets/js/lib/measure/measure.js";
const state = sessionStorage.getItem("state");
import {squareGrid,lengthToRadians } from '@turf/turf'
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
     let splitScreenFlag:Ref<Boolean>=ref(false)
    const defaultLoadMap=()=>{
    //  let dianziditu:any= map.UrlTemplateImageryProviderGeographicTilingScheme(
    //       "dainziditu",
    //       "https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=915de993ea6873664830bf5d8217723c"
    //     );
      statelliteImage=map.UrlTemplateImageryProviderGeographicTilingScheme(
          "weixingyingxiang",
          "https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=915de993ea6873664830bf5d8217723c"
        )
        statelliteImage.show=false;
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
      measureDistance() {
        // measureobj.measureDistance(); //测距
        measureobj.drawLine();
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
        map.MultiViewportMode("NONE");
        splitScreenFlag.value = false;
        statelliteImage.show=false;
      
      
        // map.shutterContrast(false); //移除卷帘
      },
      //卷帘对比
      shutterContrast() {
        statelliteImage.show=!statelliteImage.show;
        map.shutterContrast(statelliteImage.show?statelliteImage:false);
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
    let gridThermodynamicDiagram=(squareGridAObj:AnyObject,option?:AnyObject,color?:'')=>{
          squareGridAObj.features.forEach((item:AnyObject) => {
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
           map.addPolygn(squareGridAObj,(datasource:AnyObject)=>{
              //  map._viewer.flyTo(datasource)
              //  map.mapdem('yugangao','/bjdzdt/3swdx/layer.json')
          })
    }
    /**
     * @Descripttion:移除网格地图 
     * @Author: 陈杰
     * @Date: 2022-02-12 15:14:45
     * @LastEditors: 
     * @param {*} enty
     * @return {*}
     */    
    let removegridThermodynamicDiagram=(enty:AnyObject)=>{
          	map.removeAllCollection(enty);
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
        toopMethod.compass()
      // (window as any).mapobj = map;
        map._viewer.scene.globe.depthTestAgainstTerrain = false;
        // map.screenPosition((position:string|number[])=>{
        //     console.log('位置',position)
        // })
        map.movepostion((e:any)=>{
          //  console.log(('经度：'+e.postion[0]+'纬度：'+e.postion[1]))
          console.log(e.postion[0])
        })
      imageProvider = map.UrlTemplateImageryProvider(
        "chengdu",
        "http://222.73.139.7:8082/tileMap/services/MapServer/ms67c22e31cf/tile/{z}/{y}/{x}?startLevel=1"
      );
    defaultLoadMap();//默认加载地图
     
     
      map.flyToCamera(
        {
          position: {
            x: -1346866.6549951846,
            y: 5480442.330310115,
            z: 3185364.9512785384
          },
          heading: 0.101371661895854,
          pitch: -0.6962577776307106,
          roll: 6.2798715131889224
        },
        3,
        () => {
          toopMethod.compass(); //指南针
        }
      );
         // objectEach

        var cellSide:number =50;
        var options:AnyObject = {units: 'kilometers'};
        let squareGridAObj:AnyObject = squareGrid([109.650789918,20.2141799223,117.313711727,25.5196164008], cellSide, options);
      let data = [
        {
            "x": 3295,
            "y": 2869,
            "total": 0,
            "fileDataTime": "20220124093742"
        },
        {
            "x": 3297,
            "y": 2862,
            "total": 0,
            "fileDataTime": "20220124093742"
        },
        {
            "x": 3295,
            "y": 2869,
            "total": 0,
            "fileDataTime": "20220124093742"
        },
        {
            "x": 3297,
            "y": 2862,
            "total": 0,
            "fileDataTime": "20220124093742"
        },
        {
            "x": 3295,
            "y": 2869,
            "total": 0,
            "fileDataTime": "20220124093742"
        },
        {
            "x": 3297,
            "y": 2863,
            "total": 0,
            "fileDataTime": "20220124093742"
        },
        {
            "x": 3295,
            "y": 2869,
            "total": 0,
            "fileDataTime": "20220124093742"
        },
        {
            "x": 3297,
            "y": 2863,
            "total": 0,
            "fileDataTime": "20220124093742"
        },
        {
            "x": 3295,
            "y": 2869,
            "total": 0,
            "fileDataTime": "20220124093742"
        },
        {
            "x": 3297,
            "y": 2863,
            "total": 0,
            "fileDataTime": "20220124093742"
        },
        {
            "x": 3295,
            "y": 2869,
            "total": 0,
            "fileDataTime": "20220124093742"
        },
        {
            "x": 3297,
            "y": 2863,
            "total": 0,
            "fileDataTime": "20220124093742"
        },
        {
            "x": 3295,
            "y": 2869,
            "total": 0,
            "fileDataTime": "20220124093742"
        }]













        squareGridAObj.features.forEach((item:AnyObject)=> {
          item.properties.num=Math.floor(Math.random()*1000)
        
      });
      // //调用网格热力图
       gridThermodynamicDiagram(squareGridAObj,{100:'rgba(123,166,66,0.6)',500:'rgba(164,154,0.6)',1000:'rgba(23,154,23,0.6)',2000:'rgba(173,60,31,0.6)'});
      // provider = map.ArcGisMapServerImageryProvider(
      //   "arcgisprovider",
      //   "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
      // );
      
    
      
    });
    return {
      data,
      toopMethod, //工具方法
      compassCss,
      gridThermodynamicDiagram,
      removegridThermodynamicDiagram,
      defaultLoadMap,
      splitScreenFlag
    };
  }
  // components:{
  //   Content
  // }
});
</script>

<style lang="less" scoped>

</style>