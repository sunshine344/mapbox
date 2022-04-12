<!--
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 15:30:56
 * @LastEditors  : Pat
 * @LastEditTime : 2022-04-12 14:31:32
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
						v-model="ues.username"
						type="text"
						class="input"
						placeholder="请输入用户名"
						@keyup.enter="iLogin"
					/>
					<input
						v-model="ues.password"
						type="password"
						class="input last-child"
						placeholder="请输入密码"
						@keyup.enter="iLogin"
					/>
					<button class="Login" @click="iLogin">登陆</button>
				</div>
			</div>
			<ul>
				<li v-for="(item, i) in list" :key="i"></li>
			</ul>
			<div class="sphere">
				<div v-for="(item, i) in list" :key="i" class="ring" :class="`ring_${i}`"></div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { Login } from '@api/core/use';
import Message from '@components/Message';
import { useRouter } from 'vue-router';
import { actions, clearState } from '@store';

const ues = reactive({
	username: '',
	password: '',
});
const route = ref();
const getValue = (obj: any, value: any) => obj.value && obj.value[value] && obj.value[value];

interface AnyObject {
	[key: string]: any;
}

async function iLogin() {
	if (!verification()) {
		Message.error('请输入用户名/密码');
		return;
	}
	Login(ues)
		.then(({ code, msg, data }: AnyObject) => {
			if (code === 200) {
				actions.updateUser(data);
				actions.updateToken(data.token);
				getValue(route, 'push')('/home');
			}
			Message[code === 200 ? 'success' : 'error'](msg);
		})
		.catch(() => {
			Message.error('登陆失败！');
		});
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
<style lang="scss" scoped>
@import './login.scss';
</style>
