<template>
  <div class="collision">
    <!-- 轨迹碰撞 -->
    <div class="thermodynamic">
      <div class="buttons PingFangSC14">
        <div
          :class="data.collison ? 'active' : ''"
          @click="data.collison = !data.collison"
        >
          轨迹碰撞
        </div>
        <div
          :class="!data.collison ? 'active' : ''"
          @click="data.collison = !data.collison"
        >
          历史记录
        </div>
        <img src="./src/image/close.png" alt="" @click="closeColision" />
      </div>
      <div class="content-detail">
        <div class="collison" v-if="data.collison">
          <div class="data-change">
            <div class="data-title PingFangSC16">数据选择</div>
            <div class="data-select">
              <a-select
                style="width: 335px; height: 36px"
                @change="collsionChange"
              >
               <a-select-option :value="item.key" v-for="(item,i) in  data.selectList" :key='i'>
                    {{item.value}}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="data-change">
            <div class="data-title PingFangSC16">分析ID</div>
            <div class="id-select">
              <input type="text" placeholder="请选择ID号">
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
            <div class="data-title PingFangSC16">距离范围</div>
            <div class="time-select">
                <div class="PingFangSC12">
                    <input type="number" class="measureDate" placeholder="请输入距离范围" @change="distanceChange($event)">
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
import "./TrackCollision.scss";
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
  // emits: "closePanel",
  setup(props, context) {
    const data: any = reactive({
      mflage: false,
      collison: true,
      current: 1,
      mode1: "",
      tabelData: [],
      flag: true,
      showTitle: "",
      total: 0,
      selectList: [],
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
      trackData: {
        analysisScope: "",
        dataIds: "",
        distance: "",
        endTime: "",
        startTime: "",
        color: []
      }
      //   style:style
    });
    data.showTitle = props.title;
    if (props.title) {
      data.flag = true;
    }
    function collsionChange(val: string) {}
    // 绘制矩形方法
    const drawrectgangle = (type: string): void => {
      // console.log('绘制举行的方法',type);
      context.emit("rectganle", type);
    };
    async function queryData() {
      const res = await queryHistory({
        model_Type: 2,
        pageIndex: 1,
        pageSize: 10
      });
      // console.log(res);

      if (res.code === 0) {
        data.tabelData = res.data.total;
        data.total = res.data.total;
      }

      //   数据选择
      let datas: any = await dataChange();
      // console.log("数据选择的", datas);
      if (datas.code === 0) {
        data.selectList = datas.data;
      }
    }
    queryData();
    // 开始时间
    function startChange(val: any) {
      data.trackData.startTime = val.target.value
        .replace("-", "")
        .replace(":", "")
        .replace("T", "");
      data.trackData.startTime = data.bounce.startTime.replace("-", "");
    }
    // 结束时间
    function endChange(val: any) {
      data.trackData.endTime = val.target.value
        .replace("-", "")
        .replace(":", "")
        .replace("T", "");
      data.trackData.endTime = data.bounce.endTime.replace("-", "");
    }
    //
    function distanceChange(val: any) {
      data.trackData.distance = parseInt(val.target.value);
    }
    function onChange(value: any, dateString: any) {}
    function makeSure(value: any) {}
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
    function analyse() {
      // console.log('轨迹碰撞的',data.trackData);
      data.trackData.color = data.colorList;
      context.emit("TrackCollison", data.trackData);
    }

    function closeColision() {
      data.flag = false;
      context.emit("closePanel", data.showTitle);
    }
    return {
      data,
      collsionChange,
      closeColision,
      onChange,
      makeSure,
      analyse,
      startChange,
      endChange,
      distanceChange,
      rangeChange,
      rangeChanges,
      colorChange,
      drawrectgangle
    };
  }
});
</script>

<style lang="scss" scoped>
// @import "./TrackCollision.scss";
</style>