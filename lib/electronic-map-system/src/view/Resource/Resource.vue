<template>
  <div class="AtlasManagementBox">
    <div class="leftNav">
      <leftNav></leftNav>
    </div>
    <div class="ResourceRight">
      <div class="topBtns">
        <div class="top">
          <button :class="isShow ? 'active' : ''" @click="change()">
            数据资源
          </button>
          <button :class="!isShow ? 'active' : ''" @click="change()">
            地图服务
          </button>
        </div>
        <div class="bom">
          <a-form-model layout="inline" :model="formInline">
            <a-form-model-item>
              <a-select v-model="formInline.user" placeholder="来源筛选">
                <a-select-option value="shanghai"> Zone one </a-select-option>
                <a-select-option value="beijing"> Zone two </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item>
              <a-date-picker
                v-model="formInline.password"
                type="date"
                placeholder="年份筛选"
                style="min-width: 140px"
              />
            </a-form-model-item>
            <a-form-model-item>
              <a-select v-model="formInline.user" placeholder="数据类型">
                <a-select-option value="shanghai"> Zone one </a-select-option>
                <a-select-option value="beijing"> Zone two </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item>
              <a-button @click="handleSubmit" html-type="submit">搜索</a-button>
            </a-form-model-item>
          </a-form-model>
          <div class="ri">
            <button>新增</button>
          </div>
        </div>
      </div>
      <ul v-if="isShow" class="tab">
        <li>
          <div class="imgbox"></div>
          <div class="textbox">
            <h5>我是标题</h5>
            <p>
              <span>数据年份：</span><span>2008</span><span>数据来源：</span
              ><span>随风来</span><span>更新状态：</span><span>已更新</span>
              <span>数据类型：</span><span>阳光型</span>
            </p>
          </div>
          <div class="btnbox">
            <button class="active btn">编辑</button>
            <button class="btn">删除</button>
          </div>
        </li>
        <li>
          <div class="imgbox"></div>
          <div class="textbox">
            <h5>我是标题</h5>
            <p>
              <span>数据年份：</span><span>2008</span><span>数据来源：</span
              ><span>随风来</span><span>更新状态：</span><span>已更新</span>
              <span>数据类型：</span><span>阳光型</span>
            </p>
          </div>
          <div class="btnbox">
            <button class="active btn">编辑</button>
            <button class="btn">删除</button>
          </div>
        </li>
        <li>
          <div class="imgbox"></div>
          <div class="textbox">
            <h5>我是标题</h5>
            <p>
              <span>数据年份：</span><span>2008</span><span>数据来源：</span
              ><span>随风来</span><span>更新状态：</span><span>已更新</span>
              <span>数据类型：</span><span>阳光型</span>
            </p>
          </div>
          <div class="btnbox">
            <button class="active btn">编辑</button>
            <button class="btn">删除</button>
          </div>
        </li>
        <li>
          <div class="imgbox"></div>
          <div class="textbox">
            <h5>我是标题</h5>
            <p>
              <span>数据年份：</span><span>2008</span><span>数据来源：</span
              ><span>随风来</span><span>更新状态：</span><span>已更新</span>
              <span>数据类型：</span><span>阳光型</span>
            </p>
          </div>
          <div class="btnbox">
            <button class="active btn">编辑</button>
            <button class="btn">删除</button>
          </div>
        </li>
      </ul>
      <ul v-else class="tabtwo">
        <li>
          <div class="imgbox"></div>
          <div class="textbox">
            <p>服务名称:<span>香港萨达的撒大的撒大</span></p>
            <p>服务名称:<span>香港萨达的撒大的撒大</span></p>
            <p>服务名称:<span>香港萨达的撒大的撒大</span></p>
          </div>
          <div class="btnbox">
            <button class="active btn">编辑</button>
            <button class="btn">删除</button>
          </div>
        </li>
        <li>
          <div class="imgbox"></div>
          <div class="textbox">
            <p>服务名称:<span>香港萨达的撒大的撒大</span></p>
            <p>服务名称:<span>香港萨达的撒大的撒大</span></p>
            <p>服务名称:<span>香港萨达的撒大的撒大</span></p>
          </div>
          <div class="btnbox">
            <button class="btn">编辑</button>
            <button class="btn">删除</button>
          </div>
        </li>
        <li>
          <div class="imgbox"></div>
          <div class="textbox">
            <p>服务名称:<span>香港萨达的撒大的撒大</span></p>
            <p>服务名称:<span>香港萨达的撒大的撒大</span></p>
            <p>服务名称:<span>香港萨达的撒大的撒大</span></p>
          </div>
          <div class="btnbox">
            <button class="btn">编辑</button>
            <button class="btn">删除</button>
          </div>
        </li>
        <li>
          <div class="imgbox"></div>
          <div class="textbox">
            <p>服务名称:<span>香港萨达的撒大的撒大</span></p>
            <p>服务名称:<span>香港萨达的撒大的撒大</span></p>
            <p>服务名称:<span>香港萨达的撒大的撒大</span></p>
          </div>
          <div class="btnbox">
            <button class="btn">编辑</button>
            <button class="btn">删除</button>
          </div>
        </li>
      </ul>

      <div class="pag">
        <Paging></Paging>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import "./Resource.scss";
import { defineComponent, defineAsyncComponent, ref, Ref } from "vue";
export default {
  components: {
    leftNav: defineAsyncComponent(
      () => import("@/components/leftNav/leftNav.vue")
    ),
    Paging: defineAsyncComponent(() => import("@/components/Paging/index.vue")),
  },
  setup() {
    let formInline = { user: "", password: "" };
    function handleSubmit(e: object) {
      console.log(1111, e);
    }
    function change() {
      isShow.value = !isShow.value;
    }
    let isShow: Ref<boolean> = ref(true);
    return {
      formInline,
      handleSubmit,
      isShow,
      change,
    };
  },
};
</script>
<style lang="scss" scoped>
// @import "./Resource.scss";
</style>