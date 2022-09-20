<!--
 * @Autor        : Pat
 * @Description  : Home
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 16:15:51
 * @LastEditors  : Pat
 * @LastEditTime : 2022-02-25 17:02:26
-->

<template>
	<div class="el-flex">
		<h1 style="font-size: 64px; margin: 10%">{{ systemName }}</h1>
		<h1 style="font-size: 24px">{{ hallo }}</h1>
	</div>
</template>
<script setup lang="ts">
import { state } from '@store';
const {
	sys: {
		config: { systemName },
	},
} = state;
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
const hallo = `Welcome to Vue framework front-end team development template`;
</script>
<style>
#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>
