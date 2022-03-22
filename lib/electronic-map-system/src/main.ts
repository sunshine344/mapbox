/*
 * @Autor        : Pat
 * @Description  : Main
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 15:08:43
 * @LastEditors  : Pat
 * @LastEditTime : 2022-02-25 17:55:59
 */
import App from './App';
import { createApp } from 'vue'
// import Vue from 'vue';
import { config, ENV } from "@config/amb";
import { setRoute } from '@router';
import requestRem from "@shared/rem";
import { setTitle } from "igu/lib/core/utils";
import '@scss/common.scss';
import "@components/Message/src/scss/index.scss";
import { setupProdMockServer } from '../mock/_createProductionServer';
import { requestApi } from "@api/config/request";
import Antd from 'ant-design-vue';
// iconfont
// import './assets/icon/iconfont.css'
// import './assets/icon/iconfont.js'
const app = createApp(App);
app.use(Antd);
// 中介
// let bus = new createApp();
// createApp.prototype.$bus = bus;
requestApi();
setRoute(app);
requestRem(1920);
config?.moduleName && setTitle(config.moduleName);
// Turn off vue related warning messages
app.config.warnHandler = () => null;
// Open system performance
app.config.performance = true;
// The development environment takes effect
if (ENV === "dev") {
    // Whether to enable Mockjs
    // If the Amb mock parameter is enabled
    // then mock data simulation is enabled
    if (config?.mock) {
        setupProdMockServer()
    };
} else {
    // Close page error prompt
    app.config.errorHandler = () => null;
};

