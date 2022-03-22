<template>
  <div class="LogManagementBox">
    <div class="leftNav">
      <leftNav></leftNav>
    </div>
    <div class="rightCon">
      <div class="topSerch">
        <a-input v-model:value="queryValue" placeholder="请输入关键字">
        </a-input>
        <a-button @click="serch">搜索</a-button>
      </div>
      <div class="tab">
        <table class="bomtab">
          <thead>
            <tr>
              <th>序号</th>
              <th>类型</th>
              <th>用户名</th>
              <th>IP地址</th>
              <th>日志时间</th>
              <th>方法名</th>
              <th>方法描述</th>
              <th>请求地址</th>
              <th>请求参数</th>
              <th>操作结果</th>
              <th>详情</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in data.tabList" :key="i">
              <td>{{ Number(i) + 1 }}</td>
              <td>
                <a-tooltip placement="topLeft">
                  <template #title>{{ item.logType }}</template>
                  {{ item.logType }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft">
                  <template #title>{{ item.userName }}</template>
                  {{ item.userName }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft">
                  <template #title>{{ item.userIp }}</template>
                  {{ item.userIp }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft">
                  <template #title>{{ item.createTime }}</template>
                  {{ item.createTime }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft">
                  <template #title>{{ item.methodName }}</template>
                  {{ item.methodName }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft">
                  <template #title>{{ item.methodRemark }}</template>
                  {{ item.methodRemark }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft">
                  <template #title>{{ item.reqUrl }}</template>
                  {{ item.reqUrl }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft">
                  <template #title>{{ item.reqParam }}</template>
                  {{ item.reqParam }}
                </a-tooltip>
              </td>
              <td>
                <a-tooltip placement="topLeft">
                  <template #title>{{ item.resInfo }}</template>
                  {{ item.resInfo }}
                </a-tooltip>
              </td>
              <td>
                <a-button @click="see(item.exceptionInfo)">查看详情</a-button>
              </td>
              <!-- <td>{{ item.exceptionInfo }}</td> -->
            </tr>
          </tbody>
        </table>
        <a-modal
          cancelText="取消"
          okText="确定"
          v-model:visible="visible"
          title="查看详情"
          @ok="handleOk"
        >
          <p>{{ data.modalVal == null ? "暂无异常信息" : data.modalVal }}</p>
        </a-modal>
      </div>
      <div class="pag">
        <a-pagination
          v-model:current="current"
          size="small"
          :pageSize="13"
          :total="Number(data.total)"
          show-less-items
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import "./LogManagement.scss";
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  onMounted,
  ref,
  watch,
} from "vue";
import { Getjournal } from "@api/core/journal.ts";
interface userInfo {
  queryValue: string;
  nowPage: number;
  pageSize: number;
}
export default defineComponent({
  components: {
    leftNav: defineAsyncComponent(
      () => import("@/components/LeftNav/LeftNav.vue")
    ),
  },

  setup() {
    // 头部搜索数据
    const queryValue = ref<string>("");
    const formInline = reactive<userInfo>({
      queryValue: "",
      nowPage: 1,
      pageSize: 13,
    });
    const visible = ref<boolean>(false);
    const data: any = reactive({
      tabList: [],
      total: 10,
      modalVal: null,
    });
    function see(val: string) {
      visible.value = true;
      data.modalVal = val;
      console.log(val);
    }
    function handleOk() {
      visible.value = false;
    }
    // 头部搜索
    function serch() {
      formInline.queryValue = queryValue.value;
      getData();
    }
    function getData() {
      Getjournal(formInline).then((res: AnyObject) => {
        if (res.code == 0) {
          console.log(res);
          data.tabList = res.data.data;
          data.total = res.data.total;
        }
      });
    }
    // 当前页数
    const current = ref(1);
    watch(current, () => {
      formInline.nowPage = current.value;
      getData();
      console.log(current.value);
    });
    onMounted(() => {
      getData();
    });
    return {
      handleOk,
      see,
      visible,
      data,
      current,
      queryValue,
      getData,
      formInline,
      serch,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>