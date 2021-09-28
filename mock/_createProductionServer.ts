/*
 * @Autor        : Pat
 * @Description  : createProdMockServer
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-01-26 15:19:43
 * @LastEditors  : Pat
 * @LastEditTime : 2021-04-06 17:17:24
 */
// import Mock from "mockjs";
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';
const modules = import.meta.globEager('./model/*.mock.ts'), mockModules: any[] = [];
// Traverse all .mock.ts files in the model folder as mockjs templates
Object.keys(modules).forEach((key) => {
	if (key.includes('/_')) { return }
	mockModules.push(...modules[key].default);
});
// Used in a production environment. 
// Need to manually import all modules
export function setupProdMockServer() {
	let currentMockURL = {};
	// console.log("%c启用mock接口%c", "color:red;font-weight:bold", "color:black;")
	Object.keys(mockModules).map((i: any) => {
		let name = mockModules[i].method + "API";
		!currentMockURL[name] && (currentMockURL[name] = {});
		currentMockURL[name][`${mockModules[i].url}`] = mockModules[i].explain;
		// console.log(`%c${mockModules[i].url}%c`, "color:red;font-weight:bold", "color:black;")
	})
	console.log(`%c当前启用Mock接口%c`, "color:red;font-weight:bold", "color:black;", currentMockURL)
	createProdMockServer(mockModules);
}
