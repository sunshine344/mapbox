<template>
    <div class="thematic">
        <!-- 统计专题图 -->
        <div class="thermodynamic">
            <div class="buttons PingFangSC14" >
                <div  :class="data.thematic?'active':''" @click="data.thematic=!data.thematic">统计专题图</div>
                <div :class="!data.thematic?'active':''" @click="data.thematic=!data.thematic">历史记录</div>
                <img src="./src/image/close.png" alt="" @click="closeMap">
            </div>
            <div class="content-detail">
                <div class="analyse" v-if="data.thematic">
                    <div class="data-change">
                        <div class="data-title PingFangSC16">数据选择</div>
                        <div class="data-select">
                            <a-select default-value="lucy" style="width: 335px;height:36px;" @change="dataSelect" >
                                    <a-select-option value="jack">
                                        Jack
                                    </a-select-option>
                                    <a-select-option value="lucy" >
                                        Lucy
                                    </a-select-option>
                                    <a-select-option value="disabled" >
                                        Disabled
                                    </a-select-option>
                                    <a-select-option value="Yiminghe" >
                                        yiminghe
                                    </a-select-option>
                                </a-select>
                        </div>
                    </div>
                    <div class="data-change">
                        <div class="data-title PingFangSC16">结果样式</div>
                        <div class="color-range">
                            <label><button @click="data.checked=!data.checked" :class="data.checked?'checked':''"></button><span>统计表</span></label>
                            <label><button @click="data.checked=!data.checked" :class="!data.checked?'checked':''"></button><span>统计图</span></label>
                        </div>
                    </div>
                    <div class="button-group">
                        <div class="actives PingFangSC14">统计</div>
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
                        <tbody>
                            <tr class="PingFangSC14" v-for="(item,i) in data.tabelData" :key="i">
                                <td>{{item.name}}</td>
                                <td>{{item.time}}</td>
                                <td>
                                    <i class="iconfont icon-winfo-icon-chakanxiangqing"></i>
                                    <i class="iconfont icon-shanchu"></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- 分页器 -->
                    <div class="pagination">
                        <a-pagination v-model="data.current" :total="50" show-less-items />
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script lang="ts">
import "./ThematicMap.scss";
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
  setup(props, context) {
    const data: any = reactive({
      mflage: false,
      thematic: true,
      current: 1,
      mode1: "",
      tabelData: [
        {
          name: "小陈",
          time: "2021-12-25-34:23"
        },
        {
          name: "小陈",
          time: "2021-12-25-34:23"
        },
        {
          name: "小陈",
          time: "2021-12-25-34:23"
        },
        {
          name: "小陈",
          time: "2021-12-25-34:23"
        },
        
      ],
      tabelDatas: [
        {
          type: "****",
          longitude: "*****",
          latitude: "*****",
          time: "2021-12-25-34:23",
          remark:'******'
        },
        {
          type: "****",
          longitude: "*****",
          latitude: "*****",
          time: "2021-12-25-34:23",
          remark:'******'
        },
        
      ],

      flag: true,
      showTitle: ""
    });
    data.showTitle = props.title;
    if (props.title) {
      data.flag = true;
    }
    function dataSelect() {}
    function handleMenuClick() {
      // console.log(data.showTitle)
    }
    function handleOpenChange1(open: boolean) {
      //   if (open) {
      //     data.mode1 = "time";
      //   }
    }
    function changeDate(value: any, dateString: any) {}
    function onOk(value: any) {}
    function handlePanelChange1(val: string) {}
    function closeMap() {
    //   data.flag = false;
    //   context.emit("closePanel", data.showTitle);
        console.log(1111);
        
    }
    return {
      data,
      dataSelect,
      handleMenuClick,
      closeMap,
      handleOpenChange1,
      handlePanelChange1,
      changeDate,
      onOk
    };
  }
});
</script>

<style lang="scss" scoped>
// @import "./TrackCollision.scss";
</style>