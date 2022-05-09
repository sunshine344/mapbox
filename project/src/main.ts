/*
 * @Autor        : Pat
 * @Description  : Main
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 15:08:43
 * @LastEditors  : Pat
 * @LastEditTime : 2022-05-09 11:08:58
 */
import App from './App';
import { createApp } from 'vue';
import { config, ENV } from '@config/amb';
import { setRoute } from '@router';
import requestRem from '@shared/rem';
import { setTitle } from 'igu/lib/core/utils';
import '_common/scss/common.scss';
import '@components/Message/src/scss/index.scss';
import { setupProdMockServer } from '../mock/_createProductionServer';
import { requestApi } from '@api/config/request';
const app = createApp(App);
requestApi();
setRoute(app);
requestRem(1920);
config?.moduleName && setTitle(config.moduleName);
// Turn off vue related warning messages
app.config.warnHandler = () => null;
// Open system performance
app.config.performance = true;
// The development environment takes effect
if (ENV === 'dev') {
	// Whether to enable Mockjs
	// If the Amb mock parameter is enabled
	// then mock data simulation is enabled
	if (config?.mock || !config?.mock) {
		setupProdMockServer();
	}
} else {
	// Close page error prompt
	app.config.errorHandler = () => null;
}
