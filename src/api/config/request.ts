/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 13:45:36
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-27 10:48:52
 */
// import Route from "@router";
import api from "@/init/api.js";
import amb from "@/init/amb.js";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { getsub, removeSub } from "@shared/storage";
import request, { useIRequest, useIResponse, useIConfig } from "igu/core/request";

useIConfig({
    defaults: {
        // Set response time
        timeout: 5 * 10000,
        headers: {
            // Set common configure request header
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    }
});

useIRequest(({ url, method, ...config }: AxiosRequestConfig) => {
    if (!amb.mock) {
        let tk = getsub("token");
        if (tk) {
            config.headers['Token'] = tk;
        };
    };
    return { url, method, ...config };
});

useIResponse((res: AxiosResponse<any>) => {
    let { code } = res.data;
    if (code == 302 || code == 401) {
        removeSub(["token", "userInfo", "menu", "iportalMenu"])
        // Route.push("/login");
    };
    return res
});

export const src = api;

export default request;