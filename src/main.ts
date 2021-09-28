/*
 * @Autor        : Pat
 * @Description  : Main
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 15:08:43
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-27 18:22:57
 */
import App from './App';
import sys from "./init/sys";
import { createApp } from 'vue'
import amb from "./init/amb.js";
import { setRoute } from '@router';
import { setupStore } from "@store";
import requestRem from "@shared/rem";
import { setTitle } from "igu/core/utils";
import '@scss/common.scss';
import "@components/Message/src/scss/index.scss";
import { setupProdMockServer } from '../mock/_createProductionServer';
const app = createApp(App);
setRoute(app);
setupStore(app);
requestRem(1920);
amb.moduleName && setTitle(amb.moduleName);
// Turn off vue related warning messages
app.config.warnHandler = () => null;
// Open system performance
app.config.performance = true;
// The development environment takes effect
if (sys.type === "enterprise") {
    // Whether to enable Mockjs
    // If the Amb mock parameter is enabled
    // then mock data simulation is enabled
    if (amb.mock) {
        setupProdMockServer();
    }
} else {
    // Close page error prompt
    app.config.errorHandler = () => null;
};

