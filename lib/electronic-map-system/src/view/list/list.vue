<template>

  <div class="container">

    <div class="map">

      <!-- scaleDenominator 比例尺 compass指南针-->

      <Map ref="map3d" @compass="compass" @mpaload="mpaload" @scaleDenominator="scaleDenominator" @longlat="longlat" @mapPlotPoint="getPlotPoint" :eleTableData='data.eleTableData'></Map>

    </div>

    <div class="content">

      <div class="list">

        <a-menu mode="inline">

          <a-menu-item

            v-for="(item, i) in data.list"

            :key="i"

            style="padding-left: -24px"

            :class="data.imgTitle === item.title ? 'is-active' : ''"

            @click="showPop(item.title)"

          >

            <img :src="item.img" alt="" class="image" />

            <span class="PingFangSC16">{{ item.title }}</span>

          </a-menu-item>

        </a-menu>

      </div>

      <!-- 指南针 -->

      <div class="compass">

        <div>

          <!-- display:'inline-block 不可去掉，否则iconfont不能转动 -->

          <i

            class="iconfont icon-zhibeizhen"

            :style="{ transform: compassCss, display: 'inline-block' }"

          ></i>

        </div>

        <div @click="toBig">

          <i class="iconfont icon-fangda"></i>

        </div>

        <div @click="toSmall">

          <i class="iconfont icon-fangxiao"></i>

        </div>

        <div @click="clearMap">

          <i class="iconfont icon-qingchu"></i>

        </div>

      </div>

      <!-- 比例尺 -->

      <ul class="measuringScale">

        <li class="scale">

          <span>{{measuringScale}}</span>

          <!-- <i class="iconfont icon-bilichi"></i> -->

        </li>

        <li><span>x:{{currentLong[0]}}</span><span>y:{{currentLong[1]}}</span><span>z:{{currentLong[2]}}</span><span>layer:{{currentZoom}}</span></li>

      </ul>

      <!-- 功能区 -->

      <div class="subfield">

        <div class="branch" @click="data.sContent = !data.sContent">

          <span>搜索</span>

        </div>

        <div class="branch"  @click="location">

          <span>定位</span>

        </div>

        <div class="branch" @click="mapMeasuredistance">

          <span>测量</span>

        </div>

        <div class="branch" @click="rollerShtter">

          <span>卷帘</span>

        </div>

        <div class="branch" @click="splitScreen()">

          <span>分屏</span>

        </div>

        <div class="branch">

          <span>打印</span>

        </div>

      </div>

      <!-- 切换图层 -->

      <div class="coverage">

        <!-- <img src="../../assets/images/coverage.png" alt=""> -->

        <!-- <img src="../../assets/images/base-map.png" alt=""> -->

        <div class="layer" @click="data.layer = !data.layer" :class="data.layer?'is-active':''">

          <i class="iconfont icon-layer"></i>

        </div>

        <div class="layer" @click="data.baseMap=!data.baseMap" :class="data.baseMap?'is-active':''">

          <i class="iconfont icon-ditu"></i>

        </div>

      </div>

      <!-- 测绘工具 -->

      <ul class="maker" v-if="data.mflage">

        <li @click="pickPosition">拾取</li>

        <li @click="distanceMeasure">距离</li>

        <li @click="areaMeasure">面积</li>

      </ul>

      <!-- 搜索工具 -->

      <div class="search" v-if="data.sContent">

        <!-- 普通查询 -->

        <div class="normal" v-if="data.search">

          <div class="input">

            <input type="text" placeholder="请输入关键字查询" />

            <i class="iconfont icon-sousuo searchicon"></i>

          </div>

          <div class="expert" @click="data.search = false">高级查询</div>

          <!-- 查询列表 -->

          <ul class="serch-list">

            <li>查询列表</li>

            <li>查询列表</li>

            <li>查询列表</li>

            <li>查询列表</li>

            <li>查询列表</li>

          </ul>

        </div>

        <!-- 高级查询 -->

        <div class="advance" v-else>

          <div class="ad-search">

            <div></div>

            <div class="advance-search">高级查询</div>

            <div @click="searchback">返回</div>

          </div>

          <ul class="search-content">

            <li>

              <a-select default-value="lucy" style="width: 204px">

                <a-select-option value="jack"> Jack </a-select-option>

                <a-select-option value="lucy"> Lucy </a-select-option>

                <a-select-option value="disabled"> Disabled </a-select-option>

                <a-select-option value="Yiminghe"> yiminghe </a-select-option>

              </a-select>

            </li>

            <li>

              <i class="iconfont icon-tianjiadian draw-img"  :class="[buffertype==0?'drawtypeactive':'']"  @click="drawBuffer(0)" title="点"></i>

              <i class="iconfont icon-biaoxian_1 draw-img" :class="[buffertype==1?'drawtypeactive':'']"  @click="drawBuffer(1)" title="线"></i>

              <i class="iconfont icon-shape-polygon draw-img" :class="[buffertype==2?'drawtypeactive':'']" @click="drawBuffer(2)" title="矩形"></i>

              <!-- <img src="./image/markerpoing.png" alt="" class="draw-img" />

              <img src="./image/markerpoing.png" alt="" class="draw-img" />

              <img src="./image/markerpoing.png" alt="" class="draw-img" /> -->

            </li>

            <li>缓冲半径：<input type="text" v-model="bufferBadius" /><span>m</span></li>

            <li class="input"> 

              <input type="text" placeholder="请输入关键字查询" @onkeypress="search" />

              <i class="iconfont icon-sousuo searchicon" @click="search"></i>

            </li>

          </ul>

        </div>

      </div>

      <!-- 功能弹框 -->

      <div class="pop" v-if="data.pop">

        <!-- <Pop :title="data.imgTitle" @closePanel="closePop"></Pop> -->

        <!-- ThermodynamicDiagramAnalysis 时态热力图点击分析触发方法 

            rectganle 点击绘制矩形触发方法  rectangle为绘制矩形rectanglePolygon 为多边形
            odanalyse od分析，点击分析触发方法
        -->

        <!-- xf 

          // 路径规划

          mapPickPoint: 地图打点点击

          removePoint: 地图清除打点

          setPoint: 地图打点

          removePlanAll: 重置

          setLine: 绘制面

          positionPoint: 定位点数据

          linkage: 高亮线

          // 地图标绘

          plotBtn：地图标绘点击

          getPlotData: 获取地图的标绘数据

          getPlotDataCancel:获取地图的标绘数据

          getMapPlotDataCancel:获取地图的标绘数据

          removeEvent: 取消地图监听事件
          data.defenceData.analysisScope=wkt;
        -->
      <component  :elcData='data.elcTableData' @stagnation='getStagnationData' :is="data.componentFlag" @closePanel='closePop'  @removeEvent="removeEvent" @getMapPlotDataCancel="getMapPlotDataCancel" @mapPlotRemoveAll="mapPlotRemoveAll" @getPlotDataCancel="getPlotDataCancel" @getPlotData="getPlotData" @plotBtn="mapPlotBtn" @linkage="linkage"  @positionPoint="positionPoint" @setLine="mapSetLine" @removePlanAll= removePlanAll @setPoint="mapSetPoint" @removePoint="mapRemovePoint" @mapPickPoint="mapPickPoint" @rectganle="rectganle"  @ThermodynamicDiagramAnalysis="girdThermodynamicDiagram"  :flag='data.closeFlag' ref="analyze" @electric='getElectricData' @TrackCollison='getTrackData' @odanalyse="odanalyse"></component>
      </div>
      <!-- 切换图层弹框 -->
      <div class="layers" v-if="data.layer">
        <div class="layers-title">
          <div></div>
          <div>图层选择</div>
        </div>
        <ul class="layers-change">
          <li class="item" v-for="(item, i) in maplayers" :key="i">
            <span class="transport">{{ item.title }}</span>
            <a-menu mode="inline" @select="selectMaplayer">
              <a-sub-menu key="sub1">
                <a-menu-item v-for="key in item.children" :key="key.url">
                  {{ key.title }}
                </a-menu-item>
              </a-sub-menu>
            </a-menu>
          </li>
        </ul>
      </div>
      <!-- 底图切换 -->
      <div class="base-map-change" v-if="data.baseMap">
           <div class="base-map">
             <div class="require-map" v-for="(item,i) in data.requireMap" :key='i' @click="changeMap(item.title,item)" :class="data.mapTitle==item.title?'is-checked':''">
               <div>{{item.name}}</div>
               <span>{{item.title}}</span>
             </div>
           </div>
           <div class="map-type" >
            <a-checkbox @change="onChange(data.requireMapchilren[0],!data.requireMapchilren[0].check)">
             {{data.requireMapchilren[0].title}}
            </a-checkbox>
            <a-checkbox @change="onChange(data.requireMapchilren[1],!data.requireMapchilren[1].check)">
              {{data.requireMapchilren[1].title}}
            </a-checkbox>
            <a-checkbox @change="onChange(data.requireMapchilren[2],!data.requireMapchilren[2].check)">
              {{data.requireMapchilren[2].title}}
            </a-checkbox>
            <div class="map-group" v-if="data.mapTitle=='影像地图'">
              <a-checkbox @change="onChange(data.requireMapchilren[3],!data.requireMapchilren[3].check)">
              {{data.requireMapchilren[3].title}}
            </a-checkbox>
            <a-checkbox @change="onChange(data.requireMapchilren[4],!data.requireMapchilren[4].check)">
               {{data.requireMapchilren[4].title}}
            </a-checkbox>
            </div>
           </div>
      </div>
      <!--  -->
      <div class="loaction" >
        <Location ref="locationref" @primary="locationprimary" ></Location>
      </div>
      <div class="lonlat">
        <LongLat ref="longlatref"></LongLat>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
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
import MARK_POINT from "./image/markerpoing.png";
import img1 from "@/assets/images/upload.png"; //route
import img2 from "@/assets/images/route.png";
import img3 from "@/assets/images/plotting.png";
import img4 from "@/assets/images/rail.png";
import img5 from "@/assets/images/crash.png";
import img6 from "@/assets/images/analyse.png";
import img7 from "@/assets/images/detection.png";
import img8 from "@/assets/images/tense.png";
import img9 from "@/assets/images/subject.png";
import img11 from "@/assets/images/upload1.png"; //route
import img22 from "@/assets/images/route1.png";
import img33 from "@/assets/images/plotting1.png";
import img44 from "@/assets/images/rail1.png";
import img55 from "@/assets/images/crash1.png";
import img66 from "@/assets/images/analyse1.png";
import img77 from "@/assets/images/detection1.png";
import img88 from "@/assets/images/tense1.png";
import img99 from "@/assets/images/subject1.png";
import Map from "../Map/map.vue";
import "./list.scss";
import Pop from "@components/Bounce/Bounce.vue";
import ElectronicFence from "@components/ElectronicFence/ElectronicFence.vue";
import OdAnalyse from "@components/OdAnalyse/OdAnalyse.vue";
import Plot from "@components/Plot/Plot.vue";
import RoutePlan from "@components/RoutePlan/RoutePlan.vue";
import StagnationDetection from "@components/StagnationDetection/StagnationDetection.vue";
import ThematicMap from "@components/ThematicMap/ThematicMap.vue";
import TrackCollision from "@components/TrackCollision/TrackCollision.vue";
import Upload from "@components/Upload/Upload.vue";
import Location from "@components/Location/Index.vue";
import LongLat from "@components/longlat/Index.vue";
// import { numberlike } from "moment";

import {
  fileDatatemporalHeat,
  searchreverse,
  fileDatatrajectoryCollision,
  getElectric,
  getTrack,
  getOdAnalyse,
  getStagnation
} from "@api/core/list.ts";

import { lineString, buffer, point as POINT } from "@turf/turf";

import WKT from "terraformer-wkt-parser"; //wkt依赖

import { message } from "ant-design-vue";
// import { createServer } from "tls";

declare interface AnyObject {
  //声明数组对象

  [key: string]: any;
}

let map: AnyObject = {};

const CONFIG: AnyObject = (window as any).CONFIG;

export default defineComponent({
  components: {
    Pop,
    Map,
    ElectronicFence,
    OdAnalyse,
    Plot,
    RoutePlan,
    StagnationDetection,
    ThematicMap,
    TrackCollision,
    Upload,
    Location,
    LongLat
  },

  setup() {
    const data = reactive({
      list: [
        {
          title: "数据上传",
          img: img1,
          component: Upload
        },
        {
          title: "路径规划",
          img: img2,
          component: RoutePlan
        },
        {
          title: "三维标绘",
          img: img3,
          component: Plot
        },
        {
          title: "电子围栏",
          img: img4,
          component: ElectronicFence
        },
        {
          title: "轨迹碰撞",
          img: img5,
          component: TrackCollision
        },
        {
          title: "OD分析",
          img: img6,
          component: OdAnalyse
        },
        {
          title: "驻点检测",
          img: img7,
          component: StagnationDetection
        },
        {
          title: "时态热力图",
          img: img8,
          component: Pop
        },
        {
          title: "统计专题图",

          img: img9,

          component: ThematicMap
        }
      ],
      
      eleTableData: [],
      detile: false,
      mflage: false,
      search: true,
      sContent: false,
      layer: false,
      pop: false,
      imgTitle: "",
      componentFlag: "",
      closeFlag: false,
      baseMap: false,
      mapTitle: "",
      requireMap: CONFIG.basemap.base,
      requireMapchilren: CONFIG.basemap.children,
      elcData:'',
      elcTableData: [],
      defenceData:{
        tabel:[],
        analysisScope: ''     
      }

      // requireMap:[

      //   {

      //     title:'矢量地图',

      //     name:'矢量地图'

      //   },

      //   {

      //     title:'影像地图',

      //     name:'影像地图'

      //   },

      //   {

      //     title:'香港地图',

      //     name:'香港地图'

      //   },

      // ]
    });

    let style: String = "";
    let buffertype: Ref<null | number> = ref(null); //缓冲类型
    let bufferBadius: Ref<any> = ref(null);
    let measuringScale: Ref<string | number> = ref("");
    let locationref: Ref<any> = ref("");
    let longlatref: Ref<any> = ref("");
    let maplayers: Ref<Array<AnyObject>> = ref(CONFIG.layers); //图层切换
    let compassCss: Ref<any> = ref(""); //指南针旋转
    let map3d: Ref<any> = ref(""); //地图对象ref
    let analyze: Ref<any> = ref(""); // 组件选择
    let measureobj: AnyObject = {}; //测量对象
    let imageProvider: any = null;
    let provider: any = null;
    let currentLong: Ref<any[]> = ref([]); //鼠标移动经纬度
    let currentZoom: Ref<number> = ref(0);
    let splitScreenflag: Ref<Boolean> = ref(false);
    let pointCenterlabelEnty: AnyObject | null = null; //用于保存驻点检测返回实体
    let oddatasource:any=null;//od分析的实体
    const styleChange = (): void => {
      style = "";
      for (const key in colorConfig) {
        style += `${key}:${colorConfig[key]};`;
      }
      console.log(style, "-------");
      let el: AnyObject = document.body;
      el.setAttribute("style", style);
    };

    // 切换图片

    function changeImg(title: string) {
      // alert(1111)
      let change: any[] = [
        {
          title: "数据上传",
          img: img11
        },
        {
          title: "路径规划",
          img: img22
        },
        {
          title: "三维标绘",
          img: img33
        },
        {
          title: "电子围栏",
          img: img44
        },
        {
          title: "轨迹碰撞",
          img: img55
        },
        {
          title: "OD分析",
          img: img66
        },
        {
          title: "驻点检测",
          img: img77
        },
        {
          title: "时态热力图",
          img: img88
        },
        {
          title: "统计专题图",
          img: img99
        }
      ];

      let list: any[] = data.list;

      change.forEach((item: AnyObject, i: number) => {
        if (title === item.title) {
          list[i].img = item.img;
        }
      });
    }

    // 恢复图片
    function backImg(title: string) {
      let inherent: any[] = [
        {
          title: "数据上传",
          img: img1
        },
        {
          title: "路径规划",
          img: img2
        },
        {
          title: "三维标绘",
          img: img3
        },
        {
          title: "电子围栏",
          img: img4
        },
        {
          title: "轨迹碰撞",
          img: img5
        },
        {
          title: "OD分析",
          img: img6
        },
        {
          title: "驻点检测",
          img: img7
        },
        {
          title: "时态热力图",
          img: img8
        },
        {
          title: "统计专题图",
          img: img9
        }
      ];

      let list: any[] = data.list;

      inherent.forEach((item: AnyObject, i: number) => {
        if (title === item.title) {
          list[i].img = item.img;
        }
      });
      removeOdAnsiys();//清除od分析弹框
    }

    // 显示对应的弹框
    function showPop(title: string) {
      data.pop = !data.pop;

      changeImg(title);

      data.imgTitle = title;

      if (!data.pop) {
        backImg(title);
        data.componentFlag = "";
        data.imgTitle = "";
      }

      const array: any[] = data.list;

      array.forEach((item: AnyObject, i: number) => {
        if (title === item.title) {
          data.componentFlag = array[i].component;

          // console.log(data.componentFlag);
        }
      });
    }

    // 接收子组件
    function closePop(val: string) {
      // console.log(val);

      data.componentFlag = "";

      data.imgTitle = "";

      data.pop = false;
    }

    let basemaplayer: AnyObject | null = null;

    let curentobj: AnyObject = {};

    // 底图切换
    function onChange(data?: any, check?: boolean) {
      data["check"] = check;

      if (curentobj[data.name]) {
        switch (data.type) {
          case "MapServer":
            curentobj[data.title].show = data["check"];

            break;

          case "terrian":
            //  curentobj[data.title].show=data['check'];

            // data['check']?map3d.value.terrianshow(curentobj[data.title]):map3d.value.terrianshow(false);

            if (data["check"]) {
              curentobj[data.title] = map3d.value.mapTerrian(
                data.title,

                data.url
              );
            } else {
              map3d.value.removeterrian();

              delete curentobj[data.title];
            }

            //  curentobj[data.title]

            break;

          case "3dtitles":
            curentobj[data.title].show = data["check"];

            data["check"] ? map3d.value.flyEntity(curentobj[data.title]) : null;

            break;
        }
      } else {
        switch (data.type) {
          case "MapServer":
            curentobj[
              data.title
            ] = map3d.value.UrlTemplateGeographicTilingSchemeImageryProvider(
              data.title,

              data.url
            );

            break;

          case "terrian":
            curentobj[data.title] = map3d.value.mapTerrian(
              data.title,

              data.url
            );

            break;

          case "3dtitles":
            map3d.value.obliquephotography(
              { url: data.url, heightOffset: -100 },

              (enty: AnyObject) => {
                curentobj[data.title] = enty;

                map3d.value.flyEntity(enty);
              }
            );

            break;
        }
      }
    }

    // 选择底图
    function changeMap(title: string, item: AnyObject) {
      data.mapTitle = title;

      if (basemaplayer) {
        map3d.value.removelayer(basemaplayer);

        basemaplayer = null;
      }

      if (item.type == "MapServer") {
        basemaplayer = map3d.value.UrlTemplateGeographicTilingSchemeImageryProvider(
          item.title,

          item.url
        );
      }

      //  map3d.value.map.UrlTemplateGeographicTilingSchemeImageryProvider(

      // //     "chengdu",

      // //     "http://222.73.139.7:8082/tileMap/services/MapServer/ms67c22e31cf/tile/{z}/{y}/{x}?startLevel=1"

      // // );
    }

    /**

     * @Descripttion: 电子围栏方法

     * @Author: 陈杰

     * @Date: 2022-02-17 15:59:15

     * @LastEditors:

     * @param {*} type  rectangle为绘制矩形rectanglePolygon 为多边形

     * @return {*}

     */

    const rectganle = (type: string): void => {
      switch (type) {
        case "rectangle":
          map3d.value.drawboxReactangle((wkt: string) => {
            wkt;
            // 绘制矩形的wkt
            data.elcData = wkt;
          });
          break;
        case "rectanglePolygon":
          map3d.value.drawRectange((wkt: string) => {
            wkt;
            // 绘制多边形的wkt
            data.elcData = wkt;
          });
          break;
      }
    };

    // 电子围栏
    async function getElectricData(val: any) {
      // console.log("电子围栏数据", val);
      // const parmas: AnyObject = {
      //   analysisScope: val.analysisScope,
      //   endTime: val.endTime,
      //   fileId: val.fileId,
      //   startTime: val.startTime
      // };

      const parmas: AnyObject = {
        analysisScope:
          "POLYGON((114.13307015591 22.3392745535538,114.133055121264 22.3390981968837,114.133003391704 22.3389279574811,114.132916955295 22.3387703775298,114.132799133834 22.3386315126961,114.13265445518 22.3385166994191,114.132488479248 22.3384303498436,114.132307584339 22.3383757822735,114.132118722041 22.3383550936606,114.131929150094 22.3383690790278,114.131746153501 22.3384172009208,114.131576764594 22.3384976100632,114.131427492798 22.3386072164196,114.131304074498 22.3387418079378,114.131211252595 22.3388962124062,114.131152594242 22.3390644962097,114.131130353752 22.3392401923453,114.131145385943 22.339416548938,114.131197113279 22.3395867887072,114.131283548032 22.3397443694133,114.131401368657 22.3398832352751,114.131546047423 22.3399980496969,114.131712024398 22.3400844003597,114.131892921121 22.3401389687942,114.13208178573 22.3401596579167,114.132271360131 22.3401456726269,114.132454358948 22.3400975503673,114.132623749511 22.3400171404701,114.132773022143 22.3399075330856,114.132896440331 22.3397729404226,114.132989261191 22.3396185348668,114.133047917729 22.339450250199,114.13307015591 22.3392745535538))",
        endTime: "20220227232059",
        fileId: "620e11926db5b3899c2471bd",
        startTime: "20220201001404"
      };

      // console.log('绘制的数据',data.elcData);

      // getElectric

      const res = await getElectric(parmas);

      // console.log("电子围栏", res);

      if (res.code === 0) {
        analyze.value.getTableData(res.data,parmas)
      }
    }
    // 轨迹碰撞
    async function getTrackData(val: any) {
      // console.log('轨迹碰撞',val);
      // const parmas={
      //   analysisScope:'',
      //   dataIds:'',
      //   distance:val.distance,
      //   endTime:val.endTime,
      //   startTime:val.startTime
      // }
      const parmas = {
        analysisScope:
          " POLYGON((114.13307015591 22.3392745535538,114.133055121264 22.3390981968837,114.133003391704 22.3389279574811,114.132916955295 22.3387703775298,114.132799133834 22.3386315126961,114.13265445518 22.3385166994191,114.132488479248 22.3384303498436,114.132307584339 22.3383757822735,114.132118722041 22.3383550936606,114.131929150094 22.3383690790278,114.131746153501 22.3384172009208,114.131576764594 22.3384976100632,114.131427492798 22.3386072164196,114.131304074498 22.3387418079378,114.131211252595 22.3388962124062,114.131152594242 22.3390644962097,114.131130353752 22.3392401923453,114.131145385943 22.339416548938,114.131197113279 22.3395867887072,114.131283548032 22.3397443694133,114.131401368657 22.3398832352751,114.131546047423 22.3399980496969,114.131712024398 22.3400844003597,114.131892921121 22.3401389687942,114.13208178573 22.3401596579167,114.132271360131 22.3401456726269,114.132454358948 22.3400975503673,114.132623749511 22.3400171404701,114.132773022143 22.3399075330856,114.132896440331 22.3397729404226,114.132989261191 22.3396185348668,114.133047917729 22.339450250199,114.13307015591 22.3392745535538))",
        dataIds:
          "90cf483f-6bf0-4c70-8404-d12be360a08a,8f2c63c4-db5b-419f-8f40-adf192a36ead",
        distance: 100,
        endTime: "20220227232059",
        startTime: "20220201001404"
      };
      const res = await fileDatatrajectoryCollision(parmas);
      console.log("轨迹碰撞的后端数据", res);
    }
   async function getStagnationData(val: any) {
      // console.log("驻点检测的数据", val);

      // const parmas:AnyObject={
      //   dataId: val.dataId,//用户id
      //   endDate: val.endDate,
      //   fileId:val.fileId,//批次id
      //   startDate: val.startDate,
      //   polygonStr:val.polygonStr,//空间范围
      //   scopeThreshold:val.scopeThreshold,//空间阈值
      //   timeThreshold:val.timeThreshold//时间阈值
      // }
       const parmas:AnyObject={
        dataId: '7fc05a37-c28a-4a94-800b-f5c49454aaeb',
        endDate: '20220207052931',
        fileId:'62186d76e769de9f843a0d3b',
        startDate: '20220201014318',
        polygonStr:'POLYGON((114.133220261963 22.3361370298258,114.133205226982 22.3359606731256,114.13315349793 22.3357904338162,114.133067062851 22.335632854078,114.13294924349 22.335493989569,114.132804567628 22.3353791767159,114.13263859507 22.3352928276471,114.132457703989 22.335238260647,114.132268845825 22.3352175726458,114.132079278159 22.3352315586426,114.131896285832 22.3352796811591,114.131726901009 22.3353600908948,114.131577632959 22.3354696977915,114.131454217923 22.3356042897763,114.131361398678 22.3357586946197,114.131302742273 22.335926978692,114.131280502946 22.33610267498,114.131295535473 22.3362790316028,114.131347262301 22.3364492712787,114.131433695725 22.3366068517715,114.13155151425 22.3367457173085,114.131696190224 22.3368605313063,114.131862163825 22.3369468814623,114.13204305672 22.3370014493265,114.132231917194 22.3370221378373,114.132421487313 22.3370081519179,114.132604481864 22.3369600290349,114.132773868343 22.3368796185446,114.132923137228 22.3367700106199,114.133046552153 22.3366354174905,114.133139370356 22.3364810115599,114.133198024946 22.3363127266234,114.133220261963 22.3361370298258))',
        scopeThreshold:'500',
        timeThreshold:'60'
      }
      const res=await getStagnation(parmas);
      console.log('驻点检测的数据',res);
      
    }
    /**

     * @Descripttion: 头部工具方法

     * @Author: 陈杰

     * @Date: 2022-01-21 15:08:41

     * @LastEditors:

     * @param {*}

     * @return {*}

     */

    onMounted(() => {});

    /**

     * @Descripttion:  地图工具

     * @Author: 陈杰

     * @Date: 2022-02-13 17:56:20

     * @LastEditors:

     * @param {*}

     * @return {*}

     */

    // 指南针

    const compass = (e: string): void => {
      compassCss.value = e;
    };

    //地图放大

    const toBig = (): void => {
      map3d.value.toopMethod.toBig(); //
    };

    //地图缩小

    const toSmall = () => {
      map3d.value.toopMethod.toSmall(); //
    };

    // 清除地图

    const clearMap = () => {
      map3d.value.toopMethod.clearAll();

      cleardrawBuffer(); //删除搜索
    };

    // 距离测量

    const mapMeasuredistance = () => {
      data.mflage = !data.mflage;

      // map3d.value.toopMethod.measureDistance()
    };

    const rollerShtter = () => {
      map3d.value.toopMethod.shutterContrast();
    };

    const splitScreen = () => {
      splitScreenflag.value = !splitScreenflag.value;

      map3d.value.toopMethod.spitScreen(splitScreenflag.value ? true : false);
    };

    // 距离测量

    const distanceMeasure = () => {
      map3d.value.toopMethod.measureDistance();
    };

    // 测面

    const areaMeasure = () => {
      map3d.value.toopMethod.measureArea();
    };

    const pickPosition = () => {
      map3d.value.toopMethod.pickup(
        (cartographic: AnyObject, event: AnyObject, viewer: AnyObject) => {
          //  longlatref.value.show({long:cartographic[0],lat:cartographic[1]})

          longlatref.value.show({
            long: cartographic[0],

            lat: cartographic[1]
          });
        }
      );
    };

    // 图层切换

    const selectMaplayer = (e: AnyObject) => {
      map3d.value.changMap(e.key, e.key); //切换图层
    };

    // 定位

    const location = () => {
      locationref.value.show();
    };

    const locationprimary = (e: AnyObject) => {
      let pointArray: {
        text?: String;

        point: Array<Number | String>;

        img: any;
      }[] = [
        {
          text: `${e.long},${e.lat}`,

          point: [Number(e.long), Number(e.lat)],

          img: MARK_POINT
        }
      ];

      map3d.value.locationArray(pointArray);

      // option.heading,option.pitch,option.roll

      locationref.value.close();
    };

    /**

     * @Descripttion: 网格热力图

     * @Author: 陈杰

     * @Date: 2022-02-15 15:38:31

     * @LastEditors:

     * @param {*}

     * @return {*}

     */

    interface paragramsType {
      values?: number; //网格

      timeAxis?: number; //分辨率

      startTime?: number | string; //开始时间

      endTime?: number | string; //结束时间
    }

    interface colorType {
      //网格颜色配置

      [key: number]: string;
    }

    // 网格热力图调用方法

    // const girdThermodynamicDiagram = (

    //   paragrams: paragramsType = {

    //     values: 100,

    //     timeAxis: 15,

    //     startTime: 20220124093742,

    //     endTime: 20220124093756

    //   },

    //   color: colorType = {

    //     100: "rgba(123,166,66,0.6)",

    //     500: "rgba(164,154,0.6)",

    //     1000: "rgba(23,154,23,0.6)",

    //     2000: "rgba(173,60,31,0.6)"

    //   }

    // ): void => {

    //   fileDatatemporalHeat(paragrams).then((res: AnyObject) => {

    //     if (res.code == 0) {

    //       // res.data

    //       for (const key in res.data) {

    //         if (res.data[key]) {

    //           map3d.value.gridThermodynamicDiagram(

    //             res.data[key],

    //             paragrams.values,

    //             color,

    //             (enty: AnyObject) => {

    //               //加载网格热力图

    //               // enty 加载实体

    //             }

    //           );

    //         }

    //       }

    //     }

    //   });

    // }; async

    async function girdThermodynamicDiagram(val: any) {
      // console.log('接收到的参数',val);

      // const param = {

      //   fileId: val.fileId,

      //   endTime: "20220227232059",

      //   startTime: "20220201001404",

      //   timeAxis: parseInt(val.timeAxis),

      //   values: val.values

      // };

      const param = {
        fileId: "620e11926db5b3899c2471bd",

        endTime: "20220201231404",

        startTime: "20220201001404",

        timeAxis: 70,

        values: "100"
      };

      // console.log('传递',param);

      let color: AnyObject = {
        100: "rgba(123,166,66,0.6)",
        500: "rgba(164,154,0.6)",
        1000: "rgba(23,154,23,0.6)",
        2000: "rgba(173,60,31,0.6)"
      };

      const res = await fileDatatemporalHeat(param);

      console.log("热力图返回的数据", res);

      let mapData = [];
      let n=0;
      if (res.code === 0) {
        for (const key in res.data) {
          if (res.data[key]) {
           if(n>1) return ;
            map3d.value.gridThermodynamicDiagram(
              res.data[key],

              param.values,

              color,

              (enty: AnyObject) => {
                //加载网格热力图
                // enty 加载实体
              }
            );
            n++;
          }
        }
      }
    }

    // 移除网格热力图实体

    const removeGirdThermodynamicDiagram = (enty: AnyObject) => {
      map.removePolygn(enty);
    };

    // 地图出事后事件

    const mpaload = () => {
      changeMap(CONFIG.basemap.base[0].title, CONFIG.basemap.base[0]);

      data.mapTitle = CONFIG.basemap.base[0].title;
    };

    // 比例尺

    const scaleDenominator = (e: string | number) => {
      // measuringScale.value=Math.floor(Number(e));

      if (e >= 1) {
        measuringScale.value = Math.floor(Number(e)) + "公里";
      } else {
        measuringScale.value = Math.floor(Number(e) * 1000) + "米";
      }
    };

    // 获取经纬度

    const longlat = (e: AnyObject) => {
      currentLong.value = e.position; //位置

      currentZoom.value = Math.floor(e.zoom); //层级
    };

    //驻点检测

    const pointCenterlabel = (
      data = [
        {
          id: 1,

          point: [114.132302137876, 22.3358752256809, 0],

          color: "rgba(251,0,252,0.8)",

          text: "100"
        },

        {
          id: 2,
          point: [114.132179831129, 22.3358123972273, 0],

          color: "rgba(250,176,0,0.8)",

          text: "100"
        }
      ]
    ) => {
      map3d.value.pointCenterlabel(pointCenterlabel, (enty: AnyObject) => {
        pointCenterlabelEnty = enty;
      });
    };

    // 删除驻点检测实体

    const removepointCenterlabel = (enty: AnyObject) => {
      map3d.value.removePointCenterlabel(enty);
    };

    /**

     * @Descripttion: 高级搜索

     * @Author: 陈杰

     * @Date: 2022-02-22 13:28:17

     * @LastEditors:

     * @param {*}

     * @return {*}

     */
    

    let bufferEnty: AnyObject[] = [];

    let drawgeojson: any = null; //保存当前绘制geojson

    const drawBuffer = (type: number) => {
      buffertype.value = type;

      if (bufferEnty.length > 0) {
        bufferEnty.forEach((item: AnyObject) => {
          map3d.value.removeCollection(item);
        });

        bufferEnty = [];
      }

      map3d.value.toopMethod.removeDistance(); //移除绘线

      map3d.value.removedrawRectange();

      if (type == 0) {
        //打点

        map3d.value.toopMethod.pickup(
          (cartographic: AnyObject, event: AnyObject, viewer: AnyObject) => {
            // locationArrayicon

            let pointArray: {
              text?: String;

              point: Array<Number | String>;

              img: any;
            }[] = [
              {
                text: `${cartographic[0]},${cartographic[1]}`,

                point: [Number(cartographic[0]), Number(cartographic[1])],

                img: MARK_POINT
              }
            ];

            let collection = map3d.value.locationArrayicon(pointArray);

            buffertype.value = null;

            bufferEnty.push(collection);

            let geojson = POINT([
              Number(cartographic[0]),

              Number(cartographic[1])
            ]);

            drawgeojson = geojson; //保存当前点位geojson
          }
        );
      } else if (type == 1) {
        //会线

        map3d.value.toopMethod.measureDistance((e: any) => {
          let geojson: any = lineString(e); //生成geojson

          drawgeojson = geojson; //保存当前点位geojson

          // let buffergeojson:AnyObject=buffer(geojson,500, {units: 'miles'})

          // console.log('线段',buffergeojson)
        });

        buffertype.value = null;
      } else if (type == 2) {
        //绘多边形

        map3d.value.drawboxReactangle((e: any) => {
          let geojson: any = WKT.parse(e);

          drawgeojson = geojson; //保存当前点位geojson

          // let buffergeojson:AnyObject=buffer(geojson,500, {units: 'miles'});

          buffertype.value = null;

          // console.log('线段',buffergeojson)
        });
      }
    };

    // 清除缓冲实体

    const cleardrawBuffer = () => {
      if (bufferEnty.length > 0) {
        bufferEnty.forEach((item: AnyObject) => {
          map3d.value.removeCollection(item);
        });

        bufferEnty = [];
      }

      map3d.value.toopMethod.removeLine(); //移除距离

      map3d.value.removedrawRectange();
    };

    const searchback = () => {
      //点击返回按钮

      data.search = true;

      if (bufferEnty.length > 0) {
        bufferEnty.forEach((item: AnyObject) => {
          map3d.value.removeCollection(item);
        });

        bufferEnty = [];
      }

      map3d.value.toopMethod.removeLine(); //移除距离

      map3d.value.removedrawRectange();
    };

    const search = () => {
      //搜索

      // drawgeojson

      if (!Number(bufferBadius.value)) {
        message.warning("请输入有效数字数字");

        return;
      }

      let buffergeojson: AnyObject = buffer(drawgeojson, bufferBadius.value, {
        units: "miles"
      });

      searchreverse({
        keyword: "荃灣聖多明",

        geojson: JSON.stringify({
          type: "FeatureCollection",

          features: [buffergeojson]
        }),

        pageIndex: 1,

        pageSize: 3,

        releaseId: "ms6666"
      }).then((res: any) => {
        console.log("返回", res);
      });
    };
    /**
     * @Descripttion:Od分析 
     * @Author:
     * @Date: 2022-02-24 17:26:46
     * @LastEditors: 
     * @param {*}
     * @return {*}
     */   
    const odanalyse=()=>{
       interface paragramsType{
          endDate:string,  //结束时间20220206005405
          fileId:string, //批次ID  620e11926db5b3899c2471bd
          polygonStr:string,//范围数据(WKT字符串) 
          startDate:string,//20220203200956
          timeThreshold:string,//20220201221846
         
        }
        let pagrams:paragramsType={ //分析参数
              endDate:'20220206005405',
              fileId:'62186d76e769de9f843a0d3b',
              polygonStr:'POLYGON((114.133220261963 22.3361370298258,114.133205226982 22.3359606731256,114.13315349793 22.3357904338162,114.133067062851 22.335632854078,114.13294924349 22.335493989569,114.132804567628 22.3353791767159,114.13263859507 22.3352928276471,114.132457703989 22.335238260647,114.132268845825 22.3352175726458,114.132079278159 22.3352315586426,114.131896285832 22.3352796811591,114.131726901009 22.3353600908948,114.131577632959 22.3354696977915,114.131454217923 22.3356042897763,114.131361398678 22.3357586946197,114.131302742273 22.335926978692,114.131280502946 22.33610267498,114.131295535473 22.3362790316028,114.131347262301 22.3364492712787,114.131433695725 22.3366068517715,114.13155151425 22.3367457173085,114.131696190224 22.3368605313063,114.131862163825 22.3369468814623,114.13204305672 22.3370014493265,114.132231917194 22.3370221378373,114.132421487313 22.3370081519179,114.132604481864 22.3369600290349,114.132773868343 22.3368796185446,114.132923137228 22.3367700106199,114.133046552153 22.3366354174905,114.133139370356 22.3364810115599,114.133198024946 22.3363127266234,114.133220261963 22.3361370298258))',
              startDate:'20220203200956',
              timeThreshold:'20220201221846'
          
        }
      getOdAnalyse(pagrams).then((res:any)=>{
            if(res.data&&res.data.odData){
              let ODdata:AnyObject=res.data.odData;
               let pointsArray:any[]=[];
                Object.keys(ODdata).forEach((item:string)=>{
                    pointsArray.push({
                          properties:ODdata[item].oPoint,
                          startPoint:[ODdata[item].oPoint.lon,ODdata[item].oPoint.lat], //起点
                          endPoint:[ODdata[item].dPoint.lon,ODdata[item].dPoint.lat], //终点
                          startText:ODdata[item].oPoint.remarks, //起点文字
                          endtext:ODdata[item].dPoint.remarks, //终点文字
                          time:3000, //动画时间
                          height:100, //弧线高度
                          color: "#0000FF",//光线颜色,
                          textColor:'#fff',//文字颜色
                          width: 30,//宽度
                            num: 10000,//点位密集度
                            })
                  })
              oddatasource=map3d.value.raylight(pointsArray,(e:AnyObject)=>{
                    let properties:AnyObject={
                      filedatatime:e.filedatatime._value,
                      lat:e.lat._value,
                      lon:e.lon._value,
                      remarks:e.remarks
                    }
                    analyze.value.showDetail(properties)
               });//
            }else{
                 message.warning(res.msg);
            }

      })





    } 
    const removeOdAnsiys=()=>{
      map3d.value.removeraylight(oddatasource)
    }
    // map.vue里面删除od分析方法 removeraylight
    /****************************************** 路径规划 *****************************************/

    const mapPickPoint = (item: AnyObject) => {
      debugger;

      map3d.value.plotPointFun(item);
    };

    const getPlotPoint = (itemArr: Array<number>) => {
      analyze.value.getPickPointArr(itemArr);
    };

    const mapRemovePoint = (item: AnyObject) => {
      map3d.value.removePointFun(item);
    };

    const mapSetPoint = (item: AnyObject) => {
      map3d.value.setPathPointFun(item);
    };

    /**

     * @description: 重置事件地图调用

     */

    const removePlanAll = () => {
      map3d.value.removePlanAllFun();
    };

    const mapSetLine = (item: AnyObject) => {
      map3d.value.setDataLine(item);
    };

    const positionPoint = (clickItem: AnyObject, type: string) => {
      map3d.value.flotPositionPoint(clickItem, type);
    };

    const linkage = (ite: AnyObject, idx: number, index: number) => {
      map3d.value.setlinkage(ite, idx, index);
    };

    /***************************************** 三维标绘 **********************************************/

    const mapPlotBtn = (item: AnyObject) => {
      map3d.value.mapPlotBtFun(item);
    };

    const getPlotData = () => {
      let s = map3d.value.getPlotDataFun();

      analyze.value.setPlotData(s);
    };

    const getPlotDataCancel = () => {
      let s = map3d.value.getPlotDataFun();

      analyze.value.setPlotDataCancel(s);
    };

    const getMapPlotDataCancel = () => {
      let s = map3d.value.getPlotDataFun();

      analyze.value.setMapPlotDataCancel(s);
    };

    const mapPlotRemoveAll = () => {
      map3d.value.removeAllMapPlot();
    };

    const removeEvent = () => {
      map3d.value.removeEventFun();
    };

    return {
      data,
      styleChange,
      compassCss,
      compass,
      changeImg,
      backImg,
      map3d,
      toBig,
      toSmall,
      clearMap,
      mapMeasuredistance,
      rollerShtter,
      splitScreenflag,
      splitScreen,
      distanceMeasure,
      areaMeasure,
      pickPosition,
      showPop,
      closePop,
      maplayers,
      selectMaplayer,
      girdThermodynamicDiagram,
      removeGirdThermodynamicDiagram,
      onChange,
      changeMap,
      rectganle,
      mpaload,
      scaleDenominator,
      measuringScale,
      longlat,
      currentLong,
      currentZoom,
      location,
      locationref,
      locationprimary,
      longlatref,
      pointCenterlabel,
      getElectricData, //电子围栏
      // 路径规划
      analyze,
      mapPickPoint,
      getPlotPoint,
      mapRemovePoint,
      mapSetPoint,
      removePlanAll,
      mapPlotBtn,
      mapSetLine,
      positionPoint,
      linkage,
      // 标绘
      getPlotData,
      getPlotDataCancel,
      getMapPlotDataCancel,
      mapPlotRemoveAll,
      removeEvent,
      drawBuffer,
      buffertype,
      searchback,
      cleardrawBuffer,
      search,
      bufferBadius,
      getTrackData, //轨迹碰撞
      getStagnationData,
      odanalyse,
      removeOdAnsiys
    };
  }
});

//
</script>



<style scoped>
</style>
