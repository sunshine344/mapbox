/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-18 13:45:36
 * @LastEditors  : GGos
 * @LastEditTime : 2022-10-12 14:32:09
 */
// import Route from "@router";
import { config, ENV } from '@config/amb';
import { actions, state } from '@store';
import { getsub, removeSub } from '@shared/storage';
import { get, useRequest, useResponse, useConfig } from 'axios-https';
import { ref, Ref } from 'vue';
import Message from '@components/Message';
import { outputMessage } from '@config/message';
interface AnyObject {
	[key: string]: any;
}

useConfig({
	// Set response time
	timeout: 5 * 10000,
	headers: {
		// Set common configure request header
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
	},
});

useRequest(({ url, method, ...requestConfig }: AnyObject) => {
	if (!config?.mock) {
		const tk = getsub('token');
		if (tk) {
			requestConfig.headers['Token'] = tk;
		}
	}
	return { url, method, ...requestConfig };
});

useResponse((res: AnyObject) => {
	const { code } = res?.data || {};
	if (code && (code == 302 || code == 401)) {
		removeSub(['token', 'userInfo', 'menu', 'iportalMenu']);
	}
	if (res?.data || ['200', '201'].includes(res?.status)) {
		return res.data || res.statusText;
	} else {
		return Promise.reject(res?.response?.data);
	}
});

export const src: Ref<AnyObject> = ref(state.sys.api);

export const requestApi: (callback: (api: AnyObject) => AnyObject) => void = (
	callback?: (api: AnyObject) => AnyObject,
) => {
	try {
		if (ENV === 'production') {
			get('./ambiences.config.json').then((data: AnyObject) => {
				if (data) {
					actions.setConfig(data);
					src.value = data.api;
					callback?.(data.api);
				} else {
					Message.error(
						'服务器配置请求失败，配置可能不存在！请联系管理员',
					);
				}
			});
		} else {
			callback?.(src.value);
		}
	} catch (error) {
		callback?.(error as unknown as AnyObject);
	}
};

export const errorCatch: (error: AnyObject) => void = ({
	response,
}: AnyObject) => {
	if (response) {
		const { data, status } = response;
		if (status === 500) {
			Message.error('服务器错误！');
		} else if (data?.errorCode || data?.message) {
			const msg: string = outputMessage(data?.message);
			Message.error(msg ? msg : data.message);
		} else {
			Message.error('服务器请求失败，接口不存在！');
		}
	}
};
