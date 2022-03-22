<template>
    <div class="od-analyse">
        <!-- OD分析 -->
        <!-- <button @click="getAnalayseData">登录</button> -->
        <div class="thermodynamic">
            <div class="buttons PingFangSC14" >
                <div  :class="data.analyse?'active':''" @click="data.analyse=!data.analyse">OD分析</div>
                <div :class="!data.analyse?'active':''" @click="data.analyse=!data.analyse">历史记录</div>
                <img src="./src/image/close.png" alt="" @click="closeAnalyse">
            </div>
            <div class="content-detail">
                <div class="analyse" v-if="data.analyse">
                    <div class="data-change">
                        <div class="data-title PingFangSC16">数据选择</div>
                        <div class="data-select">
                            <a-select style="width: 335px;height:36px;" @change="dataChanges" >
                                <a-select-option :value="item.key" v-for="(item,i) in  data.selectList" :key='i'>
                                    {{item.value}}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="analyse-change">
                        <div class="data-title PingFangSC16">分析范围</div>
                        <div class="analyse-range">
                            <i class="iconfont icon-shape-rectangle" title="绘制矩形" @click="drawrectgangle('rectangle')" ></i>
                            <img src="./src/image/line.png" alt="" class="img">
                            <i class="iconfont icon-shape-polygon"  title="绘制多边形" @click="drawrectgangle('rectanglePolygon')"></i>                            
                        </div>
                    </div> 
                    <div class="data-change">
                        <div class="data-title PingFangSC16">时间范围</div>
                        <div class="time-range PingFangSC12" > 
                            <div>
                                 <input type="datetime-local" class="measureDate" placeholder="请选择日期" @change="startChange($event)">                                
                            </div>
                            ~
                            <div>
                                <input type="datetime-local" class="measureDate" placeholder="请选择日期" @change="endChange($event)">
                            </div>
                        </div>
                    </div>
                    <div class="data-change">
                        <div class="data-title PingFangSC16">时间阀值</div>
                        <div class="color-range PingFangSC12">
                            <a-date-picker show-time placeholder="请选择日期" @change="changeDate" @ok="onOk" :locale='data.locale' />
                        </div>
                    </div>
                    <div class="button-group">
                        <div class="actives PingFangSC14" @click="analyse">分析</div>
                        <div class="PingFangSC14">保存</div>
                        <div class="PingFangSC14">导出</div>
                    </div>
                </div>
                <div class="history" v-else>
                    <table>
                        <thead>
                            <tr>
                                <th class="PingFangSC16">姓名</th>
                                <th class="PingFangSC16">时间</th>
                                <th class="PingFangSC16">操作</th>
                            </tr>
                        </thead>
                        <tbody v-if="data.tabelData.length>0">
                            <tr class="PingFangSC14" v-for="(item,i) in data.tabelData" :key="i">
                                <td>{{item.name}}</td>
                                <td>{{item.time}}</td>
                                <td>
                                    <i class="iconfont icon-winfo-icon-chakanxiangqing"></i>
                                    <i class="iconfont icon-shanchu"></i>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan='3' style="text-align:center">暂无数据</td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- 分页器 -->
                    <div class="pagination" v-if="data.total">
                        <a-pagination v-model="data.current" :total="data.total" show-less-items />
                    </div>
                </div>
            </div>
            <!-- 分析结果弹框 -->
            <div class="consequence" v-if="data.resultMask">
                <div class="cons-first">
                    <div class="cons-title PingFangSC16">
                        <span></span>
                        <div>详情</div>
                    </div>
                    <div class="close-mask" @click="clickdetail" >
                    </div>
                </div>
                <!-- <div class="cons-id PingFangSC14">
                    ID : <span>******</span>
                </div> -->
                <div class="cons-table">
                    <table>
                        <thead>
                            <tr>
                                <!-- <th class="PingFangSC16">类型</th> -->
                                <th class="PingFangSC16">经度</th>
                                <th class="PingFangSC16">纬度</th>
                                <th class="PingFangSC16">时间</th>
                                <th class="PingFangSC16">备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="PingFangSC12" v-for="(item,i) in data.tabelDatas" :key="i">
                                <!-- <td>{{item.type}}</td> -->
                                <td :title="item.longitude">{{item.longitude}}</td>
                                <td :title="item.latitude">{{item.latitude}}</td>
                                <td :title="item.time">{{item.time}}</td>
                                <td :title="item.remark">{{item.remark}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import "./OdAnalyse.scss";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import { queryHistory, dataChange } from "@api/core/list.ts";

import {
  reactive,
  defineComponent,
  toRefs,
  Ref,
  ref,
  onBeforeMount,
  onMounted
} from "vue";
import { func } from "vue-types";
declare interface AnyObject {
  //声明数组对象
  [key: string]: any;
}
export default defineComponent({
  props: { title: String },
  //   emits: "closePanel",
  setup(props, context) {
    const data: any = reactive({
      mflage: false,
      analyse: true,
      current: 1,
      mode1: "",
      total: 0,
      locale: locale,
      selectList: [],
      tabelData: [],
      tabelDatas: [
        {
          type: "****",
          longitude: "*****",
          latitude: "*****",
          time: "2021-12-25-34:23",
          remark: "******"
        },
        {
          type: "****",
          longitude: "*****",
          latitude: "*****",
          time: "2021-12-25-34:23",
          remark: "******"
        }
      ],
      flag: true,
      showTitle: "",
      analyseData: {
        polygonStr: "", //范围数据
        endDate: "",
        fileId: "",
        startDate: "",
        timeThreshold: ""
      },
      resultMask:false
    });
    data.showTitle = props.title;
    if (props.title) {
      data.flag = true;
    }
    async function getAnalayseData() {
      const res = await queryHistory({
        model_Type: 3,
        pageIndex: 1,
        pageSize: 10
      });
      //   console.log(res);

      if (res.code === 0) {
        data.tabelData = res.data.total;
        data.total = res.data.total;
      }

      //   数据选择
      let datas: any = await dataChange();
      console.log("数据选择的", datas);
      if (datas.code === 0) {
        data.selectList = datas.data;
      }
    }
    getAnalayseData();
    function dataChanges() {}
    const drawrectgangle = (type: string): void => {
      // console.log('绘制举行的方法',type);
      context.emit("rectganle", type);
    };
    function changeDate(value: any, dateString: any) {}
    function onOk(value: any) {}
    // 开始时间
    function startChange(val: any) {
      // console.log('开始时间',val.target.value);
      //   data.bounce.startTime.replace('-',' ')
      //   data.bounce.startTime.replace('T',' ')
      //   data.bounce.startTime.replace(':',' ')
      //   data.bounce.startTime = val.target.value
      //     .replace("-", "")
      //     .replace(":", "")
      //     .replace("T", "");
      //   data.bounce.startTime = data.bounce.startTime.replace("-", "");
      //   console.log('起始时间',data.bounce.startTime);
    }
    // 结束时间
    function endChange(val: any) {
      // console.log('结束',val);
      //   data.bounce.endTime = val.target.value
      //     .replace("-", "")
      //     .replace(":", "")
      //     .replace("T", "");
      //   data.bounce.endTime = data.bounce.endTime.replace("-", "");
    }
    function closeAnalyse() {
      //   data.flag = false;
      //   context.emit("closePanel", data.showTitle);
      console.log(1111);
    }
    const analyse = () => {
      context.emit("odanalyse");
    };
    const showDetail=(e:AnyObject)=>{
      data.resultMask=true;
      data.tabelDatas=[{
                longitude:e.lon,
                latitude:e.lat,
                time:e.filedatatime,
                remark:e.remarks
      }]
    }
  const clickdetail=()=>{
      data.resultMask=false;
  }
    return {
      data,
      dataChanges,
      closeAnalyse,
      changeDate,
      onOk,
      getAnalayseData,
      startChange,
      endChange,
      analyse,
      drawrectgangle,
      showDetail,
      clickdetail
    };
  }
});
</script>

<style lang="scss" scoped>
// @import "./TrackCollision.scss";
</style>