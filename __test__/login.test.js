/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-26 15:47:22
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-28 09:49:59
 */
import { mount } from '@vue/test-utils'
import '@testing-library/jest-dom'
import Login from '@view/Login/index.vue';
const wrapper = mount(Login);
test('输入用户信息', async () => {
	// `render`方法，解析组件到document，也绑定 `screen` 的所有与组件交互的有效请求。
	expect("wrapper.find('p').text()");
	const vm = wrapper.vm;
	vm.ues.username = 'asdasda';
	vm.ues.password = 'asdasda';
});

test('用户登录', async () => {
	await wrapper.find('button.Login').trigger('click');
	expect(wrapper.vm.iLogin);
})