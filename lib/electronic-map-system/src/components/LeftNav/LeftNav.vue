<!--
 * @Author: your name
 * @Date: 2022-02-17 15:28:01
 * @LastEditTime: 2022-02-18 13:33:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \dianziditu\src\components\LeftNav\LeftNav.vue
-->
<template>
  <div class="NavBox">
    <ul>
      <li>
        <img src="./image/xtml.png" alt="" />
        <span>系统目录</span>
        <span @click="back" style="margin-left: 40px">返回</span>
      </li>
      <li
        :class="data.rotepash == '/home/AtlasManagement' ? 'active' : ''"
        @click="toMangement"
      >
        <img src="./image/tcgl.png" alt="" />
        <span>图册管理</span>
      </li>
      <li
        :class="data.rotepash == '/home/Resource' ? 'active' : ''"
        @click="toResource"
      >
        <img src="./image/zyzx.png" alt="" />
        <span>资源中心</span>
      </li>
      <li
        :class="data.rotepash == '/home/UserManagement' ? 'active' : ''"
        @click="toUmanagement"
      >
        <img src="./image/yhgl.png" alt="" />
        <span>用户管理</span>
      </li>
      <li
        :class="data.rotepash == '/home/LogManagement' ? 'active' : ''"
        @click="toLmanagement"
      >
        <img src="./image/rzgl.png" alt="" />
        <span>日志管理</span>
      </li>
      <li :class="data.rotepash == '服务器监控' ? 'active' : ''">
        <img src="./image/fwqjk.png" alt="" />
        <span>服务器监控</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import "./LeftNav.scss";
import { defineComponent, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  setup(props, context) {
    const router = useRouter();
    const data: any = reactive({
      rotepash: "/home/AtlasManagement",
    });
    function back() {
      router.push("/home/list");
    }
    function toMangement() {
      router.push("/home/AtlasManagement");
    }
    function toResource() {
      router.push("/home/Resource");
    }
    function toUmanagement() {
      router.push("/home/UserManagement");
    }
    function toLmanagement() {
      router.push("/home/LogManagement");
    }
    onMounted(() => {
      // 当前页面路由
      const route = useRoute();
      data.rotepash = route.path;
    });
    return {
      back,
      data,
      toMangement,
      toResource,
      toUmanagement,
      toLmanagement,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>