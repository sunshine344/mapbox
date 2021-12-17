/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 13:45:36
 * @LastEditors  : Pat
 * @LastEditTime : 2021-12-17 10:48:26
 */
// import Route from "@router";
import { config } from "@config/amb";
import { actions, state } from "@store";
import { getsub, removeSub } from "@shared/storage";
import request, { useRequest, useResponse, useConfig, AxiosRequestConfig, AxiosResponse } from "igu/lib/core/request";
import { ref } from "vue";
import Message from "@components/Message";
import { outputMessage } from "@config/message";

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



export const src = ref(state.config.api);

export const requestApi = (callback: Function = (api: AnyObject) => api) => {
    try {
        if (config?.BASE_API_CONFIG) {
            request.get(config?.BASE_API_CONFIG).then(({ api, base, map }: AnyObject) => {
                actions.setSysConfig({ api, base, map });
                src.value = api;
                callback(api)
            }).catch(() => { });
        } else {
            callback(src.value);
        };
    } catch (error) { };
};

export const errorCatch = ({ response }: AnyObject) => {
    if (response) {
        const { data, status } = response;
        if (status === 500) {
            Message.error("服务器错误！");
        } else if (data?.errorCode || data?.message) {
            const msg: string = outputMessage(data?.message);
            Message.error(msg ? msg : data.message);
        } else {
            Message.error("服务器请求失败，接口不存在！");
        }
    }
};

export default request;