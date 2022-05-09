/* eslint-disable camelcase */
/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 15:08:43
 * @LastEditors  : Pat
 * @LastEditTime : 2022-05-09 10:38:41
 */
import { resolve } from 'path';
import {
	alias,
	setPlugins,
	defineConfigs,
	build,
	rollupOptionsOutput,
} from '../config/Build/common.config';
import { defineConfig, ConfigEnv, UserConfigExport, loadEnv } from 'vite';
import { wrapperEnv, createProxy } from '../config/Build/common';
export const pathResolve = (dir: string) => resolve(__dirname, '.', dir);
export default ({ mode }: ConfigEnv): UserConfigExport => {
	const type = 'project';
	const root = `${process.cwd()}/${type}`;
	const env = loadEnv(mode, root);
	const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_LEGACY } =
		wrapperEnv(env);
	const outDir = `dist/${type}`;
	return defineConfig({
		root,
		resolve: {
			alias,
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
		},
		plugins: setPlugins(type, outDir),
		// Basic public path when serving in production
		base: mode.indexOf('pro') > -1 ? '/' : VITE_PUBLIC_PATH,
		// lintOnSave: true,
		build: {
			outDir,
			polyfillDynamicImport: VITE_LEGACY,
			rollupOptions: {
				output: rollupOptionsOutput,
			},
			...build,
		},
		...defineConfigs,
		// Api reverse proxy
		server: {
			cors: true,
			port: VITE_PORT,
			proxy: createProxy(VITE_PROXY),
			hmr: { overlay: false },
		},
	});
};
