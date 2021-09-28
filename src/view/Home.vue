<!--
 * @Autor        : Pat
 * @Description  : Home
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 16:15:51
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-26 11:28:45
-->


<template>
	<h1>{{ hallo }}</h1>
	<Timeline class="iaisodioas">
		<template #footer>
			<button>提交</button>
		</template>
		<slot name="footer">
			<button>提交</button>
		</slot>
		<div>11111111</div>
	</Timeline>
</template>
<script setup lang="ts">
import { getsub } from "@shared/storage";
import Timeline from "@components/Timeline";
const { name, role } = getsub("user");
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
let hallo = `hallo word! ${name} ${role}`;
</script>
<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>
