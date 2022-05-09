declare module '@api' {
	export default function (
		configKey: any,
		option?: Array<string> | string,
	): any;
}

declare module '@api/config/request' {
	import { Ref } from 'vue';
	export const src: Ref<AnyObject>;
	export const requestApi: (callback?: (api: AnyObject) => AnyObject) => void;
	export const errorCatch: (error: AnyObject) => void;
}

declare module '@api/core/use' {
	export type userState = {
		userName: string;
		password: string;
	};
	// 用户登录接口
	export const Login: (params: userState) => Promise<AnyObject>;
}
