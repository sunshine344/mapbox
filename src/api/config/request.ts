/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 13:45:36
 * @LastEditors  : Pat
 * @LastEditTime : 2021-10-15 14:39:26
 */
// import Route from "@router";
import { config, api } from "@/amb";
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
    let { code } = res.data;
    if (code == 302 || code == 401) {
        removeSub(["token", "userInfo", "menu", "iportalMenu"])
        // Route.push("/login");
    };
    return res
});

let resApi: AnyObject = api;
if (api?.BASE_API_CONFIG) {
    request.get('post', api?.BASE_API_CONFIG).then((res: AnyObject) => {
        resApi = res;
    })
}

export const src = resApi;

export default request;