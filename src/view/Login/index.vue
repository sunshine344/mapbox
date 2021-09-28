<!--
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 15:30:56
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-27 14:14:14
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
						placeholder="请输入用户名"
						v-model="ues.username"
						@keyup="enterKeys"
					/>
					<input
						type="password"
						placeholder="请输入密码"
						v-model="ues.password"
						@keyup="enterKeys"
					/>
					<button class="Login" @click="iLogin">登陆</button>
				</div>
			</div>
			<ul>
				<li v-for="(item, i) in list" :key="i"></li>
			</ul>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@import "./login.scss";
</style>
<script lang="ts">
import { defineComponent, reactive, ref, withKeys } from "vue";
import {Login} from "@api/core/use";
import { setup, removeSub } from "@shared/storage";
import Message from "@components/Message";
import { useRouter } from "vue-router";
const ues = reactive({
	username: "",
	password: "",
});
const route = ref();
const getValue = (obj: any, value: any) =>
	obj.value && obj.value[value] && obj.value[value];
const enterKeys = () => withKeys(() => iLogin(), ["enter", "native"]);

async function iLogin() {
	if (!verification()) {
		Message.error("请输入用户名/密码");
		return;
	}
	const { code, msg, data } = await Login(ues);
	if (code === 200) {
		setup({
			token: data.token,
			user: data,
		});
		getValue(route, "push")("/home");
	}
	Message[code === 200 ? "success" : "error"](msg);
}

function verification() {
	const { username, password } = ues;
	return username && password;
}

export default defineComponent({
	setup() {
		route.value = useRouter();
		removeSub("user", "token");
		return {
			list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			ues,
			enterKeys,
			iLogin,
		};
	},
});
</script>