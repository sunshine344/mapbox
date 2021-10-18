/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 13:45:36
 * @LastEditors  : Pat
 * @LastEditTime : 2021-10-18 18:46:13
 */
// import Route from "@router";
import { config } from "@config/amb";
import { actions, state } from "@store";
import { getsub, removeSub } from "@shared/storage";
import request, { useRequest, useResponse, useConfig, AxiosRequestConfig, AxiosResponse } from "igu/lib/core/request";

useConfig({
    defaults: {
        // Set response time
        timeout: 5 * 10000,
        headers: {
            // Set common configure request header
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    }
});

useRequest(({ url, method, ...requestConfig }: AxiosRequestConfig) => {
    if (!config?.mock) {
        let tk = getsub("token");
        if (tk) {
            requestConfig.headers['Token'] = tk;
        };
    };
    return { url, method, ...requestConfig };
});

useResponse((res: AxiosResponse<any>) => {
    let { code } = res?.data || {};
    if (code && (code == 302 || code == 401)) {
        removeSub(["token", "userInfo", "menu", "iportalMenu"])
        // Route.push("/login");
    };
    return res
});

if (config?.BASE_API_CONFIG) {
    localStorage.removeItem("--APP-STORAGE--");
    request('get', config?.BASE_API_CONFIG).then(({ api, config }: AnyObject) => {
        actions.setSysConfig({
            api,
            config
        });
    });
};

export const src = state.sysConfig.api;

export default request;