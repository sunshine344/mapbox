/*
 * @Autor        : Pat
 * @Description  : App Main
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-01-20 09:20:23
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-18 14:32:05
 */
import { createBlock, defineComponent, openBlock } from 'vue';
import { RouterView } from "vue-router";
// Initialization App main
// Vue tsx development model
export default defineComponent({
	name: 'App',
	setup() {
		return () => (openBlock(), createBlock(RouterView));
	}
});