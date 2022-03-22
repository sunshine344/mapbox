<!--
 * @Autor        : Pat
 * @Description  : Home
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 16:15:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-02-12 16:43:39
-->
<template>
  <div class="home">
    <div class="map">
      <Map></Map>
    </div>
    <div class="mask"></div>
    <div class="frame"></div>
    <div class="content">
      <div class="logo"></div>
      <div class="rest">
        <div class="classify styleChange">
          <!-- <div class="classify styleChange" @click="styleChange"> -->
          <i class="iconfont icon-switch"></i>
          <span>样式切换</span>
        </div>
        <div class="classify">
          <i class="iconfont icon-fuwuhao"></i>
          <span>服务示列</span>
        </div>
        <div class="classify" @click="data.uflag = !data.uflag">
          <span>请登录</span>
          <i class="iconfont icon-xiala1"></i>
        </div>
        <div class="qustion">?</div>
      </div>
      <ul class="user-list" v-show="data.uflag">
        <li>修改密码</li>
        <li @click="systemManage">系统管理</li>
        <li>退出登录</li>
      </ul>
      <div class="page">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// import { state } from "@store";
import Map from "../Map/map.vue";
import {
  reactive,
  defineComponent,
  toRefs,
  Ref,
  ref,
  onBeforeMount,
  onMounted,
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
// import styles from "./home.scss";

const state = sessionStorage.getItem("state");
declare interface AnyObject {
  //声明数组对象
  [key: string]: any;
}
// objectEach

let map: AnyObject = {};

export default defineComponent({
  setup() {
    const data: any = reactive({
      detile: false,
      flag: false,
      uflag: false,
      styleFlage: false,
    });
    const route = useRoute();
    const router = useRouter();
    // let style: String = styles;
    // window.localStorage.setItem("style", styles);
    let compassCss: Ref<any> = ref(""); //指南针旋转
    let measureobj: AnyObject = {}; //测量对象
    let imageProvider: any = null;
    let provider: any = null;
    let flag: boolean = data.flag;
    let _data: AnyObject = data;
    // 样式切换
    let style: any = null;
    const styleChange = (): void => {
      let el: AnyObject = document.body;
      el.setAttribute("style", style);

      data.styleFlage = !data.styleFlage;
      if (data.styleFlage === false) {
        let style: any = localStorage.getItem("style");
        el.setAttribute("style", style);
      } else {
        style = "";
        for (const key in colorConfig) {
          style += `${key}:${colorConfig[key]};`;
        }
      }
    };
    // 系统管理
    function systemManage() {
      data.uflag = false;
      router.push("/home/AtlasManagement");
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
      splitScreenFlag: false, //是否分屏
      init() {
        // measureobj = new MapMeasure(map._viewer); //测量工具
        measureobj = new Measure(map._viewer);
        // Measure
      },
      // 分屏
      spitScreen(flag: Boolean | undefined): void {
        this.splitScreenFlag = flag;
        map.MultiViewportMode(flag ? "HORIZONTAL" : "NONE");
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
            img: MarkPoint,
          },
        ];
        // option.heading,option.pitch,option.roll
        let collection: any = map.addPointMark(pointArray, {
          width: 40,
          height: 40,
          pixelOffset: [0, -100],
        });
        map.flyEntity(collection, {
          heading: 0.10434587483793223,
          roll: 5.100453392969939e-11,
          pitch: -0.6644403226377262,
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
        // map.shutterContrast(false); //移除卷帘
      },
      //卷帘对比
      shutterContrast() {
        map.shutterContrast(provider);
      },
    };
    onMounted(() => {
      // let link = document.createElement("link");
      // link.type = "text/css";
      // link.id = "app";
      // link.rel = "stylesheet";
      // link.href = style1;
      // document.getElementsByTagName("head")[0].appendChild(link);

      map = new supermap();
      map.init();
      (window as any).mapobj = map;
      map._viewer.scene.globe.depthTestAgainstTerrain = false;
      imageProvider = map.UrlTemplateImageryProvider(
        "chengdu",
        "http://222.73.139.7:8082/tileMap/services/MapServer/ms67c22e31cf/tile/{z}/{y}/{x}?startLevel=1"
      );
      map.flyToCamera(
        {
          position: {
            x: -1346866.6549951846,
            y: 5480442.330310115,
            z: 3185364.9512785384,
          },
          heading: 0.101371661895854,
          pitch: -0.6962577776307106,
          roll: 6.2798715131889224,
        },
        3,
        () => {
          toopMethod.compass(); //指南针
        }
      );
      provider = map.ArcGisMapServerImageryProvider(
        "arcgisprovider",
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
      );

      toopMethod.init(); //初始化
    });
    return {
      data,
      styleChange,
      toopMethod, //工具方法
      compassCss,
      systemManage,
    };
  },
  components: {
    Map,
  },
});
</script>

<style lang="scss">
@import "./home.scss";
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
}
</style>
<style  >
.cesium-widget canvas {
  width: 100%;
}
</style>
