declare module '@config' {}

declare module '@config/type/global' {
	export interface StorageOption {
		value: any;
		expires: number | string;
		startTime: number;
	}

	export interface StorageItem {
		key: string;
		value: string;
	}

	export interface AnyObject {
		[key: string]: any;
	}

	export interface RequestObject {
		data: AnyObject;
		msg: string;
		code: number;
	}
}

declare module '@config/amb' {
	export const ENV: string;
	export const ENV_URL: string;
	export const api: { [key: string]: string };
	export const config: AnyObject;
	const amb: { [key: string]: any };
	export default amb;
}

declare module '@config/message' {
	export const message: { [key: string]: string };
	export const outputMessage: (arg: string, arg1?: string) => any;
}

declare module '@config/validate' {
	export const notEditSpecialSymbol: {
		validator: (_rule: AnyObject, value: string) => Promise<void>;
		trigger: string[];
	}[];
	export const userName: (
		| {
				validator: (_rule: AnyObject, value: string) => Promise<void>;
				trigger: string[];
		  }
		| {
				required: boolean;
				message: string;
				trigger: string;
		  }
	)[];
	export const password: {
		required: boolean;
		message: string;
		trigger: string;
	}[];
}
