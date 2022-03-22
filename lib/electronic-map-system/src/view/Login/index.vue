<!--
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 15:30:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-02-15 15:10:08
-->
<template>
  <div class="login">
    <img class="logo" src="./src/images/logo.png" alt="" />
    <div class="loginbox">
      <h2>欢迎登录</h2>
      <div class="loginFrom">
        <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <a-form-item
            name="account"
            :rules="[
              { required: true, message: '请正确填写用户名/邮箱/手机号!' },
            ]"
          >
            <a-input
              v-model:value="formState.account"
              placeholder="用户名/邮箱/手机号"
            />
          </a-form-item>

          <a-form-item
            name="passWord"
            :rules="[{ required: true, message: '请正确输入密码!' }]"
          >
            <a-input-password
              v-model:value="formState.passWord"
              placeholder="密码"
            />
          </a-form-item>

          <a-form-item style="width: 100%">
            <a-button type="primary" html-type="submit">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import "./login.scss";
import { defineComponent, reactive } from "vue";
import { message } from "ant-design-vue";
import { Login } from "@api/core/use";
import { useRouter } from "vue-router";
import { setup } from "@shared/storage";
interface FormState {
  account: string;
  passWord: string;
}
export default defineComponent({
  setup() {
    const router = useRouter();
    const formState = reactive<FormState>({
      account: "",
      passWord: "",
    });
    // 验证成功回调
    const onFinish = (values: any) => {
      Login(formState).then((res: AnyObject) => {
        if (res.code == 0) {
          message.success("登录成功 即将跳转");
          setTimeout(() => {
            setup("Authorization", res.data.sessionId);
            router.push("/home/list");
          }, 1000);
        }
      });
    };

    // 验证失败回调
    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>