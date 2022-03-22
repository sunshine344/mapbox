<template>
    <div class="plot">
        <div class="thermodynamic">
            <div class="content-detail">
                <div class="analyse">
                    <div class="analyse-change">
                      <div class="data-title PingFangSC16">分析范围</div>
                      <div class="data-box-tile">
                        <div class="analyse-range">
                          <div v-for="(item,index) in data.plotBtn" :class="{active:data.plotActive== index }" :key="index" @click="poltBtnClick(item,index)">
                            <i :class="item.iconClass"></i>
                            <img class="img" v-if="data.plotBtn.length-1 != index" src="./src/image/line.png" alt="">
                          </div>
                        </div>
                        <div class="search-btn" v-if="data.plotBtnItem">
                          <span class="actives" @click="searchPath1">保存</span><span @click="resetBtn">取消</span>
                        </div>
                      </div>
                    </div>
                    <div class="data-change">
                        <div class="data-title PingFangSC16">上传文件</div>
                        <div class="time-range PingFangSC12" > 
                          <!-- uploadFile: 上传文件的回调，可进行接口提交 -->
                          <UploadItem upDataType=".kml" @upload="uploadFile" ref="uploadItem"></UploadItem>


                        </div>
                        <div class="change PingFangSC14">
                          <!-- removeItemData:删除 -->
                          <!-- showDetail:信息展示 -->
                          <UpDataList :listPage="listPage"  @showDetail="showDetail" @removeItemData="removeItemData"></UpDataList>
                        </div>
                    </div>
                    
                </div>
                
            </div>
            <!-- 基本信息编辑 -->
            <div class="bast-from" v-if="data.formPoput">
              <div class="cons-first">
                  <div class="cons-title PingFangSC16">
                      <span></span>
                      <div>基本信息</div>
                  </div>
                  <div class="close-mask"></div>
              </div>
    
              <a-form
                 ref="formRef"
                :model="formState"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                >
                  <a-form-item
                    label="标绘名称"
                    name="layerName"
                  >
                    <a-input
                      v-model:value="formState.layerName"
                      placeholder="请输入标绘名称"
                    />
                  </a-form-item>
                  <a-form-item
                    label="标绘描述"
                    name="describe"
                  >
                    <a-textarea 
                      rows='8'
                      v-model:value="formState.describe"
                      placeholder="请输入标绘描述"
                      allow-clear 
                    />
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 20, offset: 5 }">
                    <button class="search-btn actives" style="margin-left: 10px;" @click="onSubmit">保存</button>
                    <button class="search-btn" @click="resetBtn">取消</button>
                  </a-form-item>
              </a-form>
            </div>
            <!-- 分析结果弹框 -->
            <div class="consequence">
                <div class="cons-first">
                    <div class="cons-title PingFangSC16">
                        <span></span>
                        <div>详情</div>
                    </div>
                    <div class="close-mask">
                    </div>
                </div>
                <div class="cons-id PingFangSC14">
                    ID : <span>******</span>
                </div>
                <div class="cons-table">
                    <table>
                        <thead>
                            <tr>
                                <th class="PingFangSC16">类型</th>
                                <th class="PingFangSC16">经度</th>
                                <th class="PingFangSC16">纬度</th>
                                <th class="PingFangSC16">时间</th>
                                <th class="PingFangSC16">备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="PingFangSC12" v-for="(item,i) in data.tabelDatas" :key="i">
                                <td>{{item.type}}</td>
                                <td>{{item.longitude}}</td>
                                <td>{{item.latitude}}</td>
                                <td>{{item.time}}</td>
                                <td>{{item.remark}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import "./Plot.scss";
import {
  reactive,
  defineComponent,
  toRefs,
  Ref,
  ref,
  toRaw,
  UnwrapRef, 
  onBeforeMount,
  onMounted,
} from "vue";
import { UploadOutlined } from '@ant-design/icons-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { Modal , notification, message} from "ant-design-vue";
import * as turf from '@turf/turf'
import UploadItem from '@components/upDataItem/upDataItem.vue'
import UpDataList from '@components/upDataList/upDataList.vue'
interface FormState {
  layerName: string;
  describe: string;
}
// 接口参数
import { 
    DataSave,             // 数据保存
    DelLayerData,          // 数据删除
    GetLayerData,          // 获取数据列表
    UpsaveLayerData,       // 文件上传
} from '@/api/core/mapPathPlot.ts'
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  preview?: string;
  originFileObj?: any;
  file: string | Blob;
}
declare interface AnyObject {
  //声明数组对象
  [key: string]: any;
}
export default defineComponent({
  components: {
    UploadItem,
    UpDataList,
    UploadOutlined,
  },
  props: { title: String },
//   emits: "closePanel",
  setup(props, context) {
    const data: any = reactive({
      mflage: false,
      analyse: true,
      current: 1,
      mode1: "",
      plotActive:null,
      plotBtnItem: null,
      plotData: [],
      plotBtn:[
        {
          type:"point",
          iconClass:"iconfont icon-tianjiadian",
        },
        {
          type:"linestring",
          iconClass:"iconfont icon-biaoxian_1",
        },
        {
          type:"polygon",
          iconClass:"iconfont icon-cemian1",
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
      showTitle: "",
      formPoput: false,
    });
    // from 表单名称
    const uploadItem = ref();
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      layerName: "",
      describe: "",
    });
    const rules = {
      layerName: [
        { required: true, message: "请输入标绘名称！", trigger: "blur" },
      ],
      describe: [
        { required: true, message: "请输入标绘名称！", trigger: "blur" },
      ],
    }
    // 上传
    const uploadFile = async(formData:any) => {
      const res = await UpsaveLayerData(formData)
      debugger
      if(res.code == 0){
        uploadItem.value.uploadSuccess(res.msg)
      }else{
        uploadItem.value.uploadError(res.msg)
      }
    };
    // 完成
    
    data.showTitle = props.title;
    if (props.title) {
      data.flag = true;
    }
    function dataChange() {}
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
    function closeAnalyse() {
    //   data.flag = false;
    //   context.emit("closePanel", data.showTitle);
        console.log(1111);
        
    }


    /**
     * @description: 标绘点击事件
     * @param {*} item 点击类型
     */    
    function poltBtnClick(item:AnyObject,index:any){
      if(data.plotBtnItem){
        Modal.confirm({
            title: '是否清除上次标绘结果，重新标绘？',
            onOk() {
                // 重新标绘
                Modal.visible = false;
                // 清除地图标绘
                context.emit('mapPlotRemoveAll');
                data.plotBtnItem = item;
                data.plotActive = index;
                // 地图创建标绘
                context.emit('plotBtn',item);

            },
            onCancel() {},
        })
        
      }else{
        data.plotBtnItem = item;
        data.plotActive = index;
        // 地图创建标绘
        context.emit('plotBtn',item);
      }

      
    }
    /**
     * @description: 保存
     */    
    function searchPath1(){
      // 获取地图绘制的对象 ,判断是否有值
      context.emit('getPlotData');

    }
    function setPlotData(arr:any){
      if(arr.length == 0){
        notification["warning"]({
          message: '提示',
          description:
            '请至少标绘一个完整的点或线或面在进行保存',
        });
      }else{
        // 出现弹窗
        data.formPoput = true;
        // 取消地图监听事件
        
        context.emit('removeEvent');
      }
    }
    /**
     * @description: 取消保存
     */    
    function resetBtn(){
      context.emit('getPlotDataCancel');
    }
    function setPlotDataCancel(arr:any){
      if(arr.length != 0){
          Modal.confirm({
              title: '已有标绘数据，是否删除标绘的内容？',
              onOk() {
                 // 清除地图
                Modal.visible = false;
                // 删除数据，清除高亮
                data.plotBtnItem = null;
                data.plotActive = null;
                data.formPoput = false;
                context.emit('mapPlotRemoveAll');
              },
              onCancel() {},
          })
      }else{
        // 删除数据，清除高亮
        data.plotBtnItem = null;
        data.plotActive = null;
        data.formPoput = false;
        // 清除地图
        context.emit('mapPlotRemoveAll');
      }
    }
    /**
     * @description: from 提交
     */    
    const onSubmit = () => {
      formRef.value.validate().then(() => {
          // console.log('values', formState, toRaw(formState));
          data.formPoput = true;
          // 调用地图
          context.emit('getMapPlotDataCancel');
        })
        .catch((error: ValidateErrorEntity<FormState>) => {});
    };

    function ajaxDataSave(){
      
      //
      // let obj = {
      //   layerName: formState.layerName,   // 数据名称
      //   layerType: data.plotBtnItem.type,   // 数据类型
      //   describe: formState.describe,    // 数据描述
      //   geom: string,        // 数据体

      // }
    }
    function setMapPlotDataCancel(arr:any){
      console.log(arr)
      let GEOArr = [];
      for (let index = 0; index < arr.length; index++) {
        let GEO: any;
        const element = arr[index];
        if(data.plotBtnItem.type == "point"){
          GEO = turf.point(element);
        }else if(data.plotBtnItem.type == "linestring"){
          GEO = turf.lineString(element);
        }else {
          GEO = turf.polygon(element);
        }
        GEOArr.push(GEO);    
      }
      let obj = {
        layerName: formState.layerName,   // 数据名称
        layerType: data.plotBtnItem.type,   // 数据类型
        describe: formState.describe,    // 数据描述
        geom: GEOArr
      }
      positiveCoding(obj)
    }
     /**
     * @description: 正向匹配接口请求, 通过地图掺入参数
     * @param {*} params 接口参数
     */        
    const positiveCoding = async (params: any) => {
      debugger
      const res = await DataSave(params);
      if(res && res.data.code){
        // 保存成功删除其他
        // 删除数据，清除高亮
        data.plotBtnItem = null;
        data.plotActive = null;
        data.formPoput = false;
        context.emit('mapPlotRemoveAll');
      }else{
        alert('数据错误');
      }
    };

    // 列表及分页
    const listPage = reactive({
      list:[],
      total: 0,
      pageSize: 5,
      msgBtn: true,
    })
    onMounted(() => {
      // 判断是否登录
      //  :before-upload="beforeUpload"
    
      ajaxGetData({
        pageIndex: 1,   // 当前页
        pageSize: 5,    // 分页条数
      });
    });
    //接口请求列表
    const pageData = reactive({
      pageIndex: 1,   // 当前页
      pageSize: 10,    // 分页条数
      total:0,        // 总数
    })
    const removeItemData = (item:any)=>{
      let obj = {
        layerId: item.layerId
      }
      ajaxDelectDataItem(obj)
    }
    
    const showDetail = (item:any)=>{
      debugger
    }
    const getDataPage = (params: any)=>{
      ajaxGetData(params);
      // 清除地图上图
    }
    const ajaxGetData = async(params: any)=>{
      const res = await GetLayerData(params);
      debugger
      if(res && res.code == 0){
        // 处理数据
        listPage.list = res.data.data;
        listPage.total =  res.data.total;
      }else{
        message.error(res.msg);
      }
    }

    const ajaxDelectDataItem = async (params: any) => {
      const res = await DelLayerData(params);
      if(res && res.code == 0){
        message.success(res.msg);
        // 列表请求
      }else{
        message.error(res.msg);
      }
    } 

    return {
      data,
      dataChange,
      handleMenuClick,
      closeAnalyse,
      handleOpenChange1,
      handlePanelChange1,
      changeDate,
      onOk,
      poltBtnClick,  // 标绘点击
      searchPath1,
      setPlotData,
      resetBtn,
      setPlotDataCancel,
      setMapPlotDataCancel,
      uploadItem,
      // form 表单
      formRef,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      formState,
      rules,
      onSubmit,
      uploadFile,
      // 接口请求列表
      listPage,
      pageData,
      removeItemData,
      showDetail

    };
  }
});
</script>

<style lang="scss" scoped>
// @import "./TrackCollision.scss";
</style>