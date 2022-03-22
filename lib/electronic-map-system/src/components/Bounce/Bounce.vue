<template>
    <div class="bounce" v-if="data.mflage">
        <!-- 时态热力图 -->
        <!-- <button @click="historyResult">测试按钮</button> -->
        <div class="thermodynamic">
            <div class="buttons PingFangSC14">
                <div :class="data.thermal?'active':''" @click="data.thermal=!data.thermal">热力分析</div>
                <div :class="!data.thermal?'active':''" @click="data.thermal=!data.thermal">历史记录</div>
                <img src="./src/image/close.png" alt="" @click="closeBounce">
            </div>
            <div class="content-detail">
                <div class="thermal" v-if="data.thermal">
                    <div class="data-change">
                        <div class="data-title PingFangSC16">数据选择</div>
                        <div class="data-select">
                            <a-select  style="width: 335px;height:36px;" @change="handleChange" class="PingFangSC12" placeholder="请选择数据" >
                                    <a-select-option :value="item.key" v-for="(item,i) in  data.selectList" :key='i'>
                                        {{item.value}}
                                    </a-select-option>
                                </a-select>
                        </div>
                    </div>
                    <div class="data-change">
                        <div class="data-title PingFangSC16">网格选择</div>
                        <div class="data-select">
                            <a-select class="PingFangSC12" style="width: 335px;height:36px;" @change="reseauChange" >
                                    <a-select-option value="100">
                                        100*100
                                    </a-select-option>
                                    <a-select-option value="200">
                                        200*200
                                    </a-select-option>
                                    <a-select-option value="400">
                                        400*400
                                    </a-select-option>
                                    <a-select-option value="600">
                                       600*600
                                    </a-select-option>
                                </a-select>
                        </div>
                    </div>
                    <div class="data-change">
                        <div class="data-title PingFangSC16">时间分辨率</div>
                        <div class="time-select">
                            <div class="PingFangSC12">
                                <input type="number" class="measureDate" placeholder="请输入时间分辨率" @change='timeChange($event)'>
                            </div>
                            <div >
                                <a-select default-value="jack" style="width: 160px;height:36px;" class="PingFangSC12">
                                    <a-select-option value="jack">
                                        秒
                                    </a-select-option>
                                    <a-select-option value="lucy" >
                                        分
                                    </a-select-option>
                                    <a-select-option value="disabled" >
                                        时
                                    </a-select-option>
                                </a-select>
                            </div>
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
                    <div class="data-change color-seeting">
                        <div class="data-title PingFangSC16">
                            <span>分级设色</span>
                            <!-- <i class="iconfont icon-zengjia" @click="addColor"></i> -->
                        </div>
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
                    <div class="button-group PingFangSC14">
                        <div class="actives" @click="analysis">分析</div>
                        <div @click='conserve'>保存</div>
                        <div>导出</div>
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
        </div>
        <!--  -->
    </div>
</template>

<script lang="ts">
import "./Bounce.scss";
import { queryHistory, dataChange,saveResult } from "@api/core/list.ts";
import axios from "axios";
import { setup, getsub } from "@shared/storage";
import {
  reactive,
  defineComponent,
  toRefs,
  Ref,
  ref,
  onBeforeMount,
  onMounted
} from "vue";
declare interface AnyObject {
  //声明数组对象
  [key: string]: any;
}
export default defineComponent({
  //   props: { title: String },
  //   emits:'closePanel',
  setup(props, context) {
    const data: any = reactive({
      mflage: true,
      thermal: true,
      tabelData: [],
      flag: true,
      showTitle: "",
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
      total: 0,
      selectList: [],
      bounce: {
        fileId: "",
        endTime: "",
        startTime: "",
        timeAxis: "",
        values: "",
        color: []
      }
      //   style:style
    });

    async function historyResult() {
      const res = await queryHistory({
        model_Type: 1,
        pageIndex: 1,
        pageSize: 10
      });
      if (res.code === 0) {
        data.tabelData = res.data.total;
        data.total = res.data.total;
      }

      //   数据选择
      const conse = await dataChange();
    //   console.log('数据选择的',conse.data);
      if (conse.code === 0) {
        data.selectList = conse.data;
      }
    }
    historyResult();

    // 数据选择
    function handleChange(val: any) {
      data.bounce.fileId = val;
    }
    function handleMenuClick() {
      // console.log(data.showTitle)
    }
    function reseauChange(val: string) {
      data.bounce.values = val;
    }
    // 分级设色增加
    function addColor() {
      data.colorList.push({
        val1: "",
        val2: "",
        color: ""
      });
    }
    // 开始时间
    function startChange(val: any) {
      // console.log('开始时间',val.target.value);
    //   data.bounce.startTime.replace('-',' ')
    //   data.bounce.startTime.replace('T',' ')
    //   data.bounce.startTime.replace(':',' ')
      
      data.bounce.startTime = val.target.value.replace('-','').replace(':','').replace('T','');
      data.bounce.startTime=data.bounce.startTime.replace('-','')
    //   console.log('起始时间',data.bounce.startTime);
      
    }
    // 结束时间
    function endChange(val: any) {
      // console.log('结束',val);
      data.bounce.endTime =  val.target.value.replace('-','').replace(':','').replace('T','');;
      data.bounce.endTime=data.bounce.endTime.replace('-','')
    }
    function closeBounce() {
      data.mflage = false;
      context.emit("closePanel", "时态热力图");
    }
    function timeChange(val: any) {
      data.bounce.timeAxis = val.target.value;
    }
    function rangeChange(val: any, i: number) {
      data.colorList[i].val1 = val.target.value;
    //   console.log("选择的数据", data.colorList);
    }
    const rangeChanges = (val: any,i:number) => {
      data.colorList[i].val2 = val.target.value;
    };
    const colorChange = (val: any,i:number) => {
      data.colorList[i].color = val.target.value;
    };

    const analysis = () => {
        data.bounce.color=data.colorList;
        context.emit("ThermodynamicDiagramAnalysis", data.bounce);
    };
    // 保存
    function conserve(){
        
    }
    return {
      data,
      handleChange,
      handleMenuClick,
      closeBounce,
      analysis,
      historyResult,
      addColor,
      reseauChange,
      startChange,
      endChange,
      timeChange,
      rangeChange,
      rangeChanges,
      colorChange,
      conserve
    };
  }
});
</script>

<style lang="scss" scoped>
@import "./Bounce.scss";
</style>