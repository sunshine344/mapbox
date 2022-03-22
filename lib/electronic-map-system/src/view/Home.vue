<!--
 * @Autor        : Pat
 * @Description  : Home
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 16:15:51
 * @LastEditors  : Pat
 * @LastEditTime : 2021-10-16 19:54:42
-->
<template>
  <div id="app">
    <div class="home PingFangSC14">
      <div class="mask"></div>
      <div class="frame"></div>
      <div class="content">
        <div class="logo"></div>
        <div class="rest">
          <div class="classify styleChange">
            <!-- <div class="classify styleChange" @click="styleChange"> -->
            <i class="iconfont icon-switch"></i>
            <span>样式切换</span>
          </div>
          <div class="classify">
            <i class="iconfont icon-fuwuhao"></i>
            <span>服务示列</span>
          </div>
          <div class="classify" @click="data.uflag = !data.uflag">
            <span>请登录</span>
            <i class="iconfont icon-xiala1"></i>
          </div>
          <div class="qustion">?</div>
        </div>
        <ul class="user-list" v-if="data.uflag">
          <li>修改密码</li>
          <li @click="systemManage">系统管理</li>
          <li>退出登录</li>
        </ul>
        <div class="page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  reactive,
  defineComponent,
  toRefs,
  Ref,
  ref,
  onBeforeMount,
  onMounted
} from "vue";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const data: any = reactive({
      uflag: false
    });
    const route = useRoute();
    const router = useRouter();
    function systemManage() {
      data.uflag = false;
      router.push("/home/AtlasManagement");
    }
    return {
      data,
      systemManage
    };
  }
});
</script>
<style lang="scss">
@import "@/assets/scss/config/color.scss";
@import "@/assets/scss/config/commonStyle.scss";
@import "@/assets/scss/config/font.scss";
@import "@/assets/scss/config/size.scss";
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-family: "PingFang Regular";
  font-size: 14px;
}

.home {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  color: var(--fontColorfff);

  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    // background: url("@/assets/images/mask.png") no-repeat;
    z-index: 1;
    pointer-events: none;
    // border: 1px solid red;
  }
  .frame {
    top: 60px;
    width: 100%;
    height: 92%;
    position: absolute;
    background: url("../assets/images/frame.png") no-repeat;
    background-size: 100% 100%;
    pointer-events: none;
    z-index: 4;
  }

  .content {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    .page {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }

  .logo {
    position: absolute;
    left: 99px;
    top: 38px;
    width: 450px;
    height: 70px;
    display: flex;
    flex-direction: column;
    background: url("../assets/images/logo.png") no-repeat;
    background-size: 100% 100%;
    z-index: 3;
  }

  // 样式切换
  .rest {
    pointer-events: auto;
    position: absolute;
    top: 19px;
    right: 19px;
    width: 370px;
    height: 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
    // font-size: PingFangSC16;
    color: var(--fontColorfff);
    // background: var(--styleChangeBackground);
    .classify {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      background: url("../assets/images/rectangle2.png") no-repeat;
      background-size: 100% 100%;
      width: 100px;
      height: 38px;
      cursor: pointer;
      line-height: 38px;
      i {
        width: 20px;
        height: 16px;
        color: var(--fontColorfff);
        display: inline-block;
        // font-size: PingFangSC16;
        margin-right: 5px;
      }

      .icon-switch {
        font-size: 20px;
      }

      .icon-xiala1 {
        margin-left: 5px;
        margin-right: 0px;
      }
    }

    .user {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 38px;
      background: url("../assets/images/rectangle2.png") no-repeat;
      background-size: 100% 100%;
      cursor: pointer;

      .image {
        width: 11px;
        height: 10px;
        margin-left: 5px;
      }
    }

    .qustion {
      width: 39px;
      height: 38px;
      background: url("../assets/images/border.png") no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 38px;
      cursor: pointer;
    }
  }

  .user-list {
    pointer-events: auto;
    position: absolute;
    top: 64px;
    right: 64px;
    z-index: 3;
    width: 102px;
    height: 109px;
    // border: 1px solid #125CA3;
    background: url("../assets/images/userbox.png") no-repeat;
    // background: red;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    li {
      width: 100%;
      height: 36px;
      line-height: 36px;
      text-align: center;
      box-sizing: border-box;
      border: 1px solid transparent;
    }

    li:hover {
      border: 1px solid #fbcf0f;
      background: rgba(235, 167, 5, 0.4);
    }
  }
}

.styleChange {
  cursor: pointer;
}

#vertical-slider {
  display: none;
}
</style>
