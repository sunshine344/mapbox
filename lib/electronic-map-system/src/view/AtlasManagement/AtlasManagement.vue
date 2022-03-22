<template>
  <div class="AtlasManagementBox">
    <div class="leftNav">
      <leftNav></leftNav>
    </div>
    <div class="AtlasManagementRight">
      <div class="TopSerch">
        <div class="serchTitle"><span></span>信息检索</div>
        <div class="serch">
          <div class="left">
            <a-input
              v-model:value="data.value"
              class="serInp"
              placeholder="请输入关键字查询"
              type="text"
            />
            <button @click="serch" class="serBtn">
              <img src="./src/images/serch.png" alt="" /> 搜索
            </button>
          </div>
          <div class="right">
            <button @click="addMoudl" class="add">新增</button>
          </div>
        </div>
      </div>

      <ul class="tab">
        <li v-for="(item, i) in data.tabList" :key="i">
          <div class="imgbox">
            <img :src="item.imageUrl" />
          </div>
          <div class="textbox">
            <p>
              服务名称:<span>{{ item.serviceName }}</span>
            </p>
            <p>
              服务地址:<span>{{ item.serviceRul }}</span>
            </p>
            <p>
              服务类型:<span>{{ item.serviceType }}</span>
            </p>
            <p>
              坐标系: <span>{{ item.coordinateType }}</span>
            </p>
            <p>
              坐标系服务简介:<span>{{ item.serviceIntroduction }}</span>
            </p>
          </div>
          <div class="btnbox">
            <button>打开地图</button>
            <button>编辑</button>
            <button>删除</button>
          </div>
        </li>
      </ul>

      <div class="pag">
        <a-pagination
          v-model:current="current"
          size="small"
          :pageSize="3"
          :total="Number(data.total)"
        />
      </div>

      <!-- 新增弹框 -->
      <div v-show="data.showModul" class="modal">
        <div class="modulbox">
          <div class="modulHead">
            <div class="modulHeadLeft">
              <span></span>
              新 增
            </div>
            <img
              @click="data.showModul = false"
              src="./src/images/guanbi.png"
              alt=""
            />
          </div>
          <div class="from">
            <a-form
              hideRequiredMark
              layout="inline"
              name="basics"
              :model="formInline"
              @finish="onFinish"
            >
              <a-form-item name="file">
                <p class="hp">上传图片文件</p>
                <a-upload
                  v-model:fileList="formInline.file"
                  name="logo"
                  action="/upload.do"
                  list-type="picture-card"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  @change="handleChange"
                >
                  <div v-if="data.fileListShow">
                    <img src="./src/images/xinzeng.png" alt="" />
                    <p>请上传图片文件</p>
                  </div>
                </a-upload>
              </a-form-item>
              <a-form-item
                name="serviceName"
                :rules="[{ required: true, message: '请填写服务名称!' }]"
              >
                <p>服务名称</p>
                <a-input
                  v-model:value="formInline.serviceName"
                  placeholder="请输入服务名称"
                >
                </a-input>
              </a-form-item>
              <a-form-item
                name="serviceRul"
                :rules="[{ required: true, message: '请填写服务地址!' }]"
              >
                <p>服务地址</p>
                <a-input
                  v-model:value="formInline.serviceRul"
                  placeholder="请输入服务地址"
                >
                </a-input>
              </a-form-item>

              <a-form-item
                name="serviceDictionaryId"
                :rules="[{ required: true, message: '请选择服务类型' }]"
              >
                <p>服务类型</p>
                <a-select
                  v-model:value="formInline.serviceDictionaryId"
                  placeholder="请选择服务类型"
                >
                  <a-select-option
                    v-for="(item, i) in data.serviceDictionaryList"
                    :key="i"
                    :value="item.id"
                    >{{ item.dictionaryValue }}</a-select-option
                  >
                </a-select>
              </a-form-item>
              <a-form-item
                name="coordinateDictionaryId"
                :rules="[{ required: true, message: '请选择坐标系' }]"
              >
                <p>坐标系</p>
                <a-select
                  v-model:value="formInline.coordinateDictionaryId"
                  placeholder="请选择坐标系"
                >
                  <a-select-option
                    v-for="(item, i) in data.coordinateList"
                    :key="i"
                    :value="item.id"
                    >{{ item.dictionaryValue }}</a-select-option
                  >
                </a-select>
              </a-form-item>
              <a-form-item
                name="serviceIntroduction"
                :rules="[{ required: true, message: '请输入坐标系服务简介' }]"
              >
                <p>坐标系服务简介</p>
                <a-textarea
                  placeholder="请输入坐标系服务简介"
                  v-model:value="formInline.serviceIntroduction"
                />
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button>取消</a-button>
                <a-button style="margin-left: 20px" html-type="submit"
                  >确定</a-button
                >
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import "./AtlasManagement.scss";
import {
  GetAtlasInfo,
  addAtlasInfo,
  getQueryDictionaryValue,
} from "@api/core/atlas.ts";
import { src } from "@/api/config/request.ts";
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  ref,
  watch,
  onMounted,
} from "vue";
function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
}
// 弹框
interface addInfo {
  file: object;
  serviceDictionaryId: null;
  serviceIntroduction: string;
  serviceName: string;
  coordinateDictionaryId: null;
  serviceRul: string;
}
interface queryDictionaryValue {
  dataType: number;
}
interface queryAtlasInfo {
  nowPage: number;
  pageSize: number;
  queryValue: string;
}
export default defineComponent({
  components: {
    leftNav: defineAsyncComponent(
      () => import("@/components/leftNav/leftNav.vue")
    ),
  },
  setup() {
    // 弹框数据
    const formInline = reactive<addInfo>({
      file: {},
      serviceDictionaryId: null,
      serviceIntroduction: "",
      serviceName: "",
      coordinateDictionaryId: null,
      serviceRul: "",
    });

    // 下拉数据
    const querformInline = reactive<queryDictionaryValue>({
      dataType: 2,
    });

    const data: any = reactive({
      // 表格数据
      tabList: [],
      // 弹框显示
      showModul: false,
      // 搜索数据
      value: "",
      // 上传显示
      fileListShow: true,
      // 默认地址
      imgUrl: "",
      // 坐标系选择数组
      coordinateList: [],
      // 服务类型选择数组
      serviceDictionaryList: [],
      total: 10,
    });
    // 搜索事件
    function serch() {
      queryAtlasInfo.queryValue = data.value;
      getData();
    }
    // 搜索数据
    const queryAtlasInfo = reactive<queryAtlasInfo>({
      queryValue: "",
      nowPage: 1,
      pageSize: 3,
    });
    // 获取表格数据方法
    function getData() {
      GetAtlasInfo(queryAtlasInfo).then((res: AnyObject) => {
        if (res.code == 0) {
          data.tabList = res.data.data.map((item: any, i: number) => {
            item.imageUrl = `${data.imgUrl}/img${item.imageUrl}`;
            return item;
          });
          data.total = res.data.total;
        }
      });
    }
    onMounted(() => {
      data.imgUrl = src.value.BASE_URL;
      getData();
    });

    // 弹框保存回调
    const onFinish = (values: any) => {
      console.log(111, values);
    };
    // 关闭弹框
    function setModal1Visible() {
      data.showModul = false;
    }
    // 打开弹框
    function addMoudl() {
      querformInline.dataType = 2;
      getQueryDictionaryValue(querformInline).then((res: AnyObject) => {
        if (res.code == 0) {
          data.coordinateList = res.data;
          querformInline.dataType = 1;
          getQueryDictionaryValue(querformInline).then((res: AnyObject) => {
            if (res.code == 0) {
              data.serviceDictionaryList = res.data;
            }
          });
        }
      });

      data.showModul = true;
    }
    // 当前页数
    const current = ref(1);
    watch(current, () => {
      queryAtlasInfo.nowPage = current.value;
      getData();
    });
    function beforeUpload(info: any) {
      console.log(123, info);
    }
    function handleChange(info: any) {
      // data.fileListShow = !data.fileListShow;

      console.log(321, info);
    }
    return {
      beforeUpload,
      querformInline,
      data,
      setModal1Visible,
      addMoudl,
      onFinish,
      current,
      formInline,
      handleChange,
      serch,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>