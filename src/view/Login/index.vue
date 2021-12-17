<!--
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 15:30:56
 * @LastEditors  : Pat
 * @LastEditTime : 2021-12-17 16:59:10
-->
<template>
	<div class="login">
		<div class="wrap">
			<div class="container">
				<div class="loginTitle">
					<img class="logImg" />
					<h2>Title Name</h2>
				</div>
				<div class="ruleForm">
					<input
						type="text"
						class="input"
						placeholder="请输入用户名"
						v-model="ues.username"
						@keyup.enter="iLogin"
					/>
					<input
						type="password"
						class="input last-child"
						placeholder="请输入密码"
						v-model="ues.password"
						@keyup.enter="iLogin"
					/>
					<button class="Login" @click="iLogin">登陆</button>
				</div>
			</div>
			<ul>
				<li v-for="(item, i) in list" :key="i"></li>
			</ul>
			<div class="sphere">
				<div class="ring" :class="`ring_${i}`" v-for="(item, i) in list" :key="i"></div>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@import "./login.scss";
</style>
<script lang="ts">
import { defineComponent, reactive, ref, withKeys } from "vue";
import { Login } from "@api/core/use";
import Message from "@components/Message";
import { useRouter } from "vue-router";
import { actions, clearState } from "@store";

const ues = reactive({
	username: "",
	password: "",
});
const route = ref();
const getValue = (obj: any, value: any) => obj.value && obj.value[value] && obj.value[value];

async function iLogin() {
	if (!verification()) {
		Message.error("请输入用户名/密码");
		return;
	}
	Login(ues).then(({ code, msg, data }: AnyObject) => {
		if (code === 200) {
			actions.updateUser(data);
			actions.updateToken(data.token);
			getValue(route, "push")("/home");
		};
		Message[code === 200 ? "success" : "error"](msg);
	}).catch((error: AnyObject) => {
		console.log(error)
		Message.error("登陆失败！");
	})
}

function verification() {
	const { username, password } = ues;
	return username && password;
}

export default defineComponent({
	setup() {
		route.value = useRouter();
		clearState();
		return {
			list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			ues,
			iLogin,
		};
	},
});
</script>