<template>
  <div class="detection">
    <!-- 驻点检测 -->
    <div class="thermodynamic">
      <div class="buttons PingFangSC14">
        <div
          :class="data.staf ? 'active' : ''"
          @click="data.staf = !data.staf"
        >
          驻点检测
        </div>
        <div
          :class="!data.staf ? 'active' : ''"
          @click="data.staf = !data.staf"
        >
          历史记录
        </div>
        <img src="./src/image/close.png" alt="" @click="closeDetection" />
      </div>
      <div class="content-detail">
        <div class="staf" v-if="data.staf">
          <div class="data-change">
            <div class="data-title PingFangSC16">数据选择</div>
            <div class="data-select">
              <a-select
                style="width: 335px; height: 36px"
                @change="dataSelect"
                placeholder="请选择数据"
              >
               <a-select-option :value="item.key" v-for="(item,i) in  data.selectList" :key='i'>
                  {{item.value}}
              </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="data-change">
            <div class="data-title PingFangSC16">分析ID</div>
            <div class="data-select">
              <a-select
                style="width: 335px; height: 36px"
                @change="idSelect"
                placeholder="请选择数据ID"                
              >
              <a-select-option :value="item.key" v-for="(item,i) in  data.analyseList" :key='i'>
                  {{item.value}}
              </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="analyse-change">
            <div class="data-title PingFangSC16">分析范围</div>
            <div class="analyse-range">
                <i class="iconfont icon-shape-rectangle" title="绘制矩形" @click="drawrectgangle('rectangle')" ></i>
                <i class="iconfont icon-shape-polygon" title="绘制多边形" @click="drawrectgangle('rectanglePolygon')" ></i>                            
            </div>
          </div>
          <div class="data-change">
            <div class="data-title PingFangSC16">时间范围</div>
            <div class="time-range PingFangSC12" >
                <div>
                      <input type="datetime-local" class="measureDate" placeholder="请选择日期" @change='startChage($event)'>
                </div>
                ~
                <div>
                      <input type="datetime-local" class="measureDate" placeholder="请选择日期" @change='endChage($event)'>
                </div>
            </div>
          </div>
          <div class="data-change">
            <div class="data-title PingFangSC16">空间阈值</div>
            <div class="time-select">
                <div class="PingFangSC12">
                    <input type="number" class="measureDate" placeholder="请输入空间阈值" @change="spaceSelect($event)">
                </div>
                <div >
                    <a-select default-value="m" style="width: 160px;height:36px;" class="PingFangSC12">
                        <a-select-option value="m">
                            m
                        </a-select-option>
                        <a-select-option value="km" >
                            km
                        </a-select-option>
                    </a-select>
                </div>
            </div>
          </div>
          <div class="data-change">
            <div class="data-title PingFangSC16">时间阈值</div>
            <div class="time-select">
                <div class="PingFangSC12">
                    <input type="number" class="measureDate" placeholder="请输入时间" @change="timeSelect($event)">
                </div>
                <div >
                    <a-select default-value="分" style="width: 160px;height:36px;" class="PingFangSC12">
                        <a-select-option value="分" >
                            分
                        </a-select-option>
                        <a-select-option value="时" >
                            时
                        </a-select-option>
                    </a-select>
                </div>
            </div>
          </div>
          <div class="data-change">
            <div class="data-title PingFangSC16">分级设色</div>
            <div class="color-range" v-for="(item,i) in data.colorList" :key='i'> 
                <div>
                    <input type="number" :value="item.val1" @change="rangeChange($event,i)"/>
                </div>
                <span>~</span>
                <div>
                    <input type="number" :value="item.val2" @change="rangeChanges($event,i)"/>
                </div>
                <span class="color-change">
                    <input type="color" class="icolor" :value="item.color" @change="colorChange($event,i)"/>
                </span>
            </div>
          </div>
          <div class="button-groups">
            <div class="actives PingFangSC14" @click='analyse'>分析</div>
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
              <tr
                class="PingFangSC14"
                v-for="(item, i) in data.tabelData"
                :key="i"
              >
                <td>{{ item.name }}</td>
                <td>{{ item.time }}</td>
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
    </div>
    <!--  -->
  </div>
</template>

<script lang="ts">
import "./StagnationDetection.scss";
import { analyseId, dataChange, queryHistory } from "@api/core/list.ts";

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
  // emits: "closePanel",
  setup(props, context) {
    const data = reactive({
      mflage: false,
      staf: true,
      current: 1,
      mode1: "",
      tabelData: [{
        name:'',time:''
      }],
      flag: true,
      showTitle: "",
      total: 0,
      selectList: [{
        key:'',
        value:''
      }],
      analyseList: [
        {key:'',
        value:""}
      ],
      colorList: [
        {
          val1: "",
          val2: "",
          color: ""
        },
        {
          val1: "",
          val2: "",
          color: ""
        }
      ],
      stagnation: {
        dataId: '', //用户id
        endDate: '',
        fileId: '', //批次id
        startDate: '',
        polygonStr: '', //空间范围
        scopeThreshold: 0, //空间阈值
        timeThreshold: 0, //时间阈值
        color:[
          {
          val1: "",
          val2: "",
          color: ""
        },
        {
          val1: "",
          val2: "",
          color: ""
        }
        ]
      }
      //   style:style
    });
    // 数据选择
    function dataSelect(val:any) {
      data.stagnation.fileId=val
    }
    
    function idSelect(val:any) {
      data.stagnation.dataId=val
    }
    // 绘制矩形方法
    const drawrectgangle = (type: string): void => {
      // console.log('绘制举行的方法',type);
      context.emit("rectganle", type);
    };
    function handleMenuClick() {
      // console.log(data.showTitle)
    }
    function handleOpenChange1(open: boolean) {
      //   if (open) {
      //     data.mode1 = "time";
      //   }
    }
    async function getAllData() {
      const res = await queryHistory({
        model_Type: 4,
        pageIndex: 1,
        pageSize: 10
      });

      if (res.code === 0) {
        data.tabelData = res.data;
        data.total = res.data.total;
      }

      //   数据选择
      const wes = await dataChange();
      // console.log("数据选择的", conse.data);
      if (wes.code === 0) {
        data.selectList = wes.data;
      }
      // 分析id
      const analyse = await analyseId();
      console.log("分析id", analyse.data);
      if (analyse.code === 0) {
        data.analyseList = analyse.data;
      }
    }

    getAllData();
    function rangeChange(val: any, i: number) {
      data.colorList[i].val1 = val.target.value;
      //   console.log("选择的数据", data.colorList);
    }
    const rangeChanges = (val: any, i: number) => {
      data.colorList[i].val2 = val.target.value;
    };
    const colorChange = (val: any, i: number) => {
      data.colorList[i].color = val.target.value;
    };
    function startChage(val:any){
      data.stagnation.startDate=val.target.value;
    }
     function endChage(val:any){
      data.stagnation.endDate=val.target.value;
    }
    function spaceSelect(val:any){
      data.stagnation.scopeThreshold=parseInt(val.target.value);
    }
    function timeSelect(val:any){
      data.stagnation.timeThreshold=parseInt(val.target.value);
    }
    function onChange(value: any, dateString: any) {}
    function onOk(value: any) {}
    function handlePanelChange1(val: string) {}
    function closeDetection() {
      // data.flag = false;
      // context.emit("closePanel", data.showTitle);
    }
    function analyse(){
      data.stagnation.color=data.colorList
      // console.log('驻点检测',data.stagnation);
      context.emit("stagnation", data.stagnation);
      
    }
    return {
      data,
      dataSelect,
      idSelect,
      handleMenuClick,
      closeDetection,
      handleOpenChange1,
      handlePanelChange1,
      onChange,
      onOk,
      rangeChange,
      rangeChanges,
      colorChange,
      spaceSelect,
      timeSelect,
      analyse,
      startChage,
      endChage,
      drawrectgangle
    };
  }
});
</script>

<style lang="scss" scoped>
// @import "./TrackCollision.scss";
</style>