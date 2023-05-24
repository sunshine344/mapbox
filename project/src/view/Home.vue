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
		<Mapbox />
	</div>
</template>
<script setup lang="ts">
import { state } from '@store';
import Mapbox from './Mapbox/index.vue';

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
.el-flex{
	height: 100%;
	width: 100%;
}
</style>
