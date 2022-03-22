<template>
    <div class="electronic-fence">
        <!-- 电子围栏 -->
        <div class="thermodynamic">
            <div class="buttons PingFangSC14" >
                <div  :class="data.thermal?'active':''" @click="data.thermal=!data.thermal">电子围栏</div>
                <div :class="!data.thermal?'active':''" @click="data.thermal=!data.thermal">历史记录</div>
                <img src="./src/image/close.png" alt="" @click="closeBounce">
            </div>
            <div class="content-detail">
                <div class="thermal" v-if="data.thermal">
                    <div class="data-change">
                        <div class="data-title PingFangSC16">数据选择</div>
                        <div class="data-select">
                            <a-select style="width: 335px;height:36px;" @change="handleChange" placeholder="请输入地址名称">
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
                            <i class="iconfont icon-shape-polygon" title="绘制多边形" @click="drawrectgangle('rectanglePolygon')" ></i>                            
                        </div>
                    </div>
                    <div class="data-change">
                        <div class="data-title PingFangSC16">时间范围</div>
                        <div class="time-range">
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
                        <div class="data-title PingFangSC16">结果样式</div>
                        <div class="color-range">
                            <label><button @click="openMask('统计表')" :class="data.mflage?'checked':''"></button><span>统计表</span></label>
                            <label><button @click="openMask('统计图')" :class="!data.mflage?'checked':''"></button><span>统计图</span></label>
                        </div>
                    </div>
                    <div class="button-group">
                        <div class="actives PingFangSC14" @click="analyseResult">分析</div>
                        <div class="PingFangSC14" @click="conserve">保存</div>
                        <div class="PingFangSC14">导出</div>
                    </div>
                </div>
                <div class="history" v-else>
                    <table>
                        <thead>
                            <tr>
                                <th class="PingFangSC16">ID</th>
                                    <th class="PingFangSC16">出入类型</th>
                                    <th class="PingFangSC16">次数</th>                                    
                                    <th class="PingFangSC16">操作</th>
                            </tr>
                        </thead>
                        <tbody v-if="data.tabelData.length>0">
                            <tr class="PingFangSC14" v-for="(item,i) in data.tabelData" :key="i">
                                <td>{{item.id}}</td>
                                <td>{{item.accessType}}</td>
                                <td>{{item.accessTimes}}</td>
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
                    <div class="pagination" v-if="data.totals">
                        <a-pagination v-model="data.current" :total="data.totals" show-less-items />
                    </div>
                </div>
            </div>
            <!-- 统计表 -->
            <div class="cartogram" v-if="data.mask">
                <div v-if="data.mflage">
                    <div class="cartogram-title">
                    <div class="total">
                        <span></span> 
                        <div class="PingFangSC16">汇总</div>
                    </div>
                    <div class="back" @click="data.mask=false">
                        返回
                    </div>
                    </div>
                    <div class="history">
                        <table>
                            <thead>
                                <tr>
                                    <th class="PingFangSC16">ID</th>
                                    <th class="PingFangSC16">出入类型</th>
                                    <th class="PingFangSC16">次数</th>                                    
                                    <th class="PingFangSC16">操作</th>
                                </tr>
                            </thead>
                            <tbody v-if="data.tabelDatas.length>0">
                                <tr class="PingFangSC14" v-for="(item,i) in data.tabelDatas" :key="i">
                                    <td>{{item.id}}</td>
                                    <td>{{item.accessType}}</td>
                                    <td>{{item.accessTimes}}</td>
                                    <td>
                                        明细
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
                <div v-else>
                    <div class="cartogram-title">
                    <div class="total">
                        <span></span> 
                        <div class="PingFangSC16">明细</div>
                    </div>
                    <div class="back" @click="data.mask=false">
                        返回
                    </div>
                    </div>
                    <div class="historys">
                        <table>
                            <thead>
                                <tr>
                                    <th class="PingFangSC16">ID</th>
                                    <th class="PingFangSC16">时间</th>
                                    <th class="PingFangSC16">出入类型</th>                                    
                                    <th class="PingFangSC16">备注</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="PingFangSC14" v-for="(item,i) in data.detailData" :key="i">
                                    <td>{{item.id}}</td>
                                    <td>{{item.time}}</td>
                                    <td>{{item.outType}}</td>
                                    <td>{{item.remark}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- 分页器 -->
                        <div class="pagination" v-if="data.total">
                            <a-pagination v-model="data.current" :total="50" show-less-items />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--  -->
    </div>
</template>

<script lang="ts">
import "./ElectronicFence.scss";
import { dataChange, saveResult, queryHistory } from "@api/core/list.ts";

import {
  reactive,
  defineComponent,
  toRefs,
  Ref,
  ref,
  onBeforeMount,
  onMounted
} from "vue";
import { V_MODEL_DYNAMIC } from "@vue/compiler-dom";
declare interface AnyObject {
  //声明数组对象
  [key: string]: any;
}
export default defineComponent({
  props: { title: String, elcData: Array },
  // emits: "closePanel",
  setup(props, context) {
    const data: any = reactive({
      mflage: false,
      thermal: true,
      current: 1,
      mode1: "",
      tabelData: [],
      tabelDatas: [],
      detailData: [
        {
          id: 1,
          time: "2021-12-25-34:23",
          outType: "*****",
          remark: "***"
        },
        {
          id: 1,
          time: "2021-12-25-34:23",
          outType: "*****",
          remark: "***"
        },
        {
          id: 1,
          time: "2021-12-25-34:23",
          outType: "*****",
          remark: "***"
        },
        {
          id: 1,
          time: "2021-12-25-34:23",
          outType: "*****",
          remark: "***"
        },
        {
          id: 1,
          time: "2021-12-25-34:23",
          outType: "*****",
          remark: "***"
        }
      ],
      flag: true,
      showTitle: "",
      checked: false,
      total: 0,
      totals: 0,
      selectList: [],
      electronicData: {
        analysisScope: "",
        endTime: "",
        fileId: "",
        startTime: ""
      },
      statistical: false,
      mask: false,
      saveData: {
        analysisId: '', //分析id
        analysisScope: '', //分析范围面
        distance: '', //缓冲距离
        endTime: '', //时间范围 结束时间
        gridSize: 0, //网格大小
        id: '', //数据id
        jsonContent: '', //json字符串
        level: '', //分级设色
        modelType: 5, //模块类型1、时态热力图2、轨迹碰撞、3、OD分析4、驻点检查5、电子围栏
        spatialThreshold: '', //空间阈值
        startTime: '', //开始的时间
        timeAxis: '', //时间分辨率
        timeThreshold: '', //时间阈值
        userId: '' //用户编号
      }
    });
    // data.showTitle = props.title;
    // if (props.title) {
    //   data.flag = true;
    // }

    function handleChange(val: any) {
      data.electronicData.fileId = val;
    }
    function handleMenuClick() {
      // console.log(data.showTitle)
    }
    function handleOpenChange1(open: boolean) {
      //   if (open) {
      //     data.mode1 = "time";
      //   }
    }
    function onChange(value: any, dateString: any) {}
    function onOk(value: any) {}
    function handlePanelChange1(val: string) {}
    function closeBounce() {
      data.flag = false;
      context.emit("closePanel", data.showTitle);
    }
    async function getElectData() {
      //   数据选择
      const conse = await dataChange();
      // console.log('数据选择的',conse.data);
      if (conse.code === 0) {
        data.selectList = conse.data;
      }

      const res = await queryHistory({
        model_Type: 5,
        pageIndex: 1,
        pageSize: 10
      });
    //   console.log("电子围栏", res.data.total);
      if (res.code === 0) {
        data.tabelData = res.data;
        // data.totals = res.data.total;
      }
    }
    getElectData();
    // 开始时间
    function startChange(val: any) {
      data.electronicData.startTime = val.target.value
        .replace("-", "")
        .replace(":", "")
        .replace("T", "");
      data.electronicData.startTime = data.electronicData.startTime.replace(
        "-",
        ""
      );
    }
    // 结束时间
    function endChange(val: any) {
      data.electronicData.endTime = val.target.value
        .replace("-", "")
        .replace(":", "")
        .replace("T", "");
      data.electronicData.endTime = data.electronicData.endTime.replace(
        "-",
        ""
      );
    }
    // 绘制矩形方法
    const drawrectgangle = (type: string): void => {
      // console.log('绘制举行的方法',type);
      context.emit("rectganle", type);
    };
    const analyseResult = (): void => {
      context.emit("electric", data.electronicData);
    };
    // async
    function getTableData(val:any[],parmas:any){
        data.tabelDatas=val;
        data.total=data.tabelDatas.length;
        data.saveData.analysisScope=parmas.analysisScope;
        // analysisId: string,//分析id
      // analysisScope: string,//分析范围面
      // distance:string,//缓冲距离
      // endTime:string,//时间范围 结束时间
      // gridSize:number,//网格大小
      // id:string,//主键
      // jsonContent:string,//json字符串
      // level:string,//分级设色
      // modelType:number,//模块类型1、时态热力图2、轨迹碰撞、3、OD分析4、驻点检查5、电子围栏
      // spatialThreshold:number,//空间阈值
      // startTime:string,//开始的时间
      // timeAxis:number,//时间分辨率
      // timeThreshold:number,//时间阈值
      // userId:string//用户编号
      data.saveData.endTime=parmas.endTime;
      data.saveData.analysisId=parmas.fileId;
      data.saveData.startTime=parmas.startTime;
      console.log(data.saveData);
      
    //   let res=await saveResult(data.saveData);
    //   console.log('保存结果',res);
      
    }
    // 蒙板
    const openMask = (title: string): void => {
      data.mask = true;
      if (title == "统计表") {
        data.mflage = true;
      } else {
        data.mflage = false;
      }
    };
    // 保存绘制结果V_MODEL_DYNAMIC
    function conserve() {
      // analysisId: string,//分析id
      // analysisScope: string,//分析范围面
      // distance:string,//缓冲距离
      // endTime:string,//时间范围 结束时间
      // gridSize:number,//网格大小
      // id:string,//数据id
      // jsonContent:string,//json字符串
      // level:string,//分级设色
      // modelType:number,//模块类型1、时态热力图2、轨迹碰撞、3、OD分析4、驻点检查5、电子围栏
      // spatialThreshold:number,//空间阈值
      // startTime:string,//开始的时间
      // timeAxis:number,//时间分辨率
      // timeThreshold:number,//时间阈值
      // userId:string//用户编号
    }
    return {
      data,
      handleChange,
      handleMenuClick,
      closeBounce,
      handleOpenChange1,
      handlePanelChange1,
      onChange,
      onOk,
      drawrectgangle,
      getElectData,
      startChange,
      endChange,
      analyseResult,
      conserve,
      openMask,
      getTableData
    };
  }
});
</script>

<style lang="scss" scoped>
// @import "./TrackCollision.scss";
</style>