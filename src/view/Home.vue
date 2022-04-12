<!--
 * @Autor        : Pat
 * @Description  : Home
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 16:15:51
 * @LastEditors  : Pat
 * @LastEditTime : 2022-02-25 17:02:26
-->

<template>
	<h1>{{ hallo }}</h1>
</template>
<script setup lang="ts">
import { state } from '@store';
const {
	use: {
		token,
		user: { name, role },
	},
} = state;
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
const hallo = `hallo word! ${name} ${role} ${token}`;
</script>
<style>
#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>
