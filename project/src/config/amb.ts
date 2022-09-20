interface AnyObject {
	[key: string]: any;
}

export const ENV = 'dev';
export const ENV_URL = 'ambiences.config.json';
export const api: AnyObject = {
	BASE_URL: '',
};
export const config: AnyObject = {
	mock: true,
	systemName: '前端开发模版-template-vue',
};

export default { ENV, ENV_URL, api, config };
